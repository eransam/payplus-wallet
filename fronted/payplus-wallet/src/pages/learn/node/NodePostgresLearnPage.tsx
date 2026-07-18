import { Link } from "react-router-dom";
import LearnCallout from "../../../components/learn/LearnCallout";
import LearnCode from "../../../components/learn/LearnCode";
import LearnSection from "../../../components/learn/LearnSection";
import LearnTopicLayout from "../../../components/learn/LearnTopicLayout";

function NodePostgresLearnPage() {
  return (
    <LearnTopicLayout
      slug="node-postgres"
      objectives={[
        "להבין חיבור Node ל-PostgreSQL דרך ספריית pg",
        "לדעת למה Pool ולא חיבור בודד לכל query",
        "לכתוב queries בטוחות עם פרמטרים ($1, $2)",
        "להבין מתי צריך client ייעודי במקום pool.query",
      ]}
    >
      <LearnSection title="1. מאפס — Postgres ו-Node">
        <p>
          PostgreSQL הוא <strong>מסד נתונים relational</strong> — טבלאות,
          שורות, SQL. Node לא "יודע" Postgres מלידה — משתמשים בחבילה{" "}
          <code>pg</code> (node-postgres) שמדברת TCP עם השרת ומריצה queries.
        </p>
        <p>
          הדפוס המקובל: כל הגישה למסד מרוכזת בשכבת repositories (השיעור על
          ארכיטקטורה), והחיבור עצמו מנוהל דרך <strong>Pool</strong> אחד לכל
          התהליך.
        </p>
      </LearnSection>

      <LearnSection title="2. Connection string">
        <LearnCode
          label="DATABASE_URL"
          code={`postgresql://appuser:secret@localhost:5432/myapp
//          user    pass    host      port  database`}
        />
        <p>
          הכתובת מגיעה ממשתנה סביבה (<code>DATABASE_URL</code>) דרך קובץ
          ה-config — כמו שראינו בשיעור הקודם. הקוד שניגש למסד לא בונה את
          ה-string בעצמו ולא מכיל סיסמאות.
        </p>
      </LearnSection>

      <LearnSection title="3. Pool — למה לא connect() לכל query?">
        <p>
          פתיחת חיבור TCP + אימות מול Postgres היא פעולה{" "}
          <strong>יקרה</strong> (זמן + משאבים בשני הצדדים). Pool פותח מראש
          מספר חיבורים, שומר אותם חיים, ומלווה כל query לחיבור פנוי.
        </p>
        <LearnCode
          label="db.ts — יצירת Pool"
          code={`import { Pool } from "pg";
import config from "./config";

let pool: Pool | null = null;

export async function connect() {
  if (pool) return;

  pool = new Pool({
    connectionString: config.databaseUrl,
    max: 20,                       // עד 20 חיבורים במקביל
    idleTimeoutMillis: 30000,      // חיבור פנוי נסגר אחרי 30 שניות
    connectionTimeoutMillis: 10000,
  });

  pool.on("error", (err) => {
    logger.error("PostgreSQL pool error:", err.message);
  });

  const client = await pool.connect();
  await client.query("SELECT 1"); // בדיקת חיים בעליית השרת
  client.release();
}`}
        />
        <ul>
          <li>
            <code>max: 20</code> — תקרת חיבורים; בקשה נוספת מחכה בתור
          </li>
          <li>
            <code>connect()</code> נקרא פעם אחת בעליית השרת — warm-up
          </li>
          <li>
            <code>client.release()</code> — <strong>חובה</strong> להחזיר חיבור
            ל-pool אחרי שימוש ישיר ב-client
          </li>
        </ul>
        <LearnCallout variant="warn" title="דליפת חיבורים">
          client שנלקח מה-pool בלי <code>release()</code> → ה-pool מתרוקן →
          כל הבקשות הבאות נתקעות בהמתנה לחיבור. זו תקלה קלאסית בשרתי Node.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="4. query — שליפה ועדכון">
        <LearnCode
          label="שליפה טיפוסית"
          code={`const result = await pool.query(
  "SELECT * FROM users WHERE id = $1",
  [userId]
);
const user = result.rows[0]; // undefined אם אין תוצאה`}
        />
        <p>
          <strong>Parameterized queries</strong> (<code>$1, $2</code>) — הערכים
          נשלחים לשרת בנפרד מטקסט ה-SQL, ולכן קלט זדוני לא יכול לשנות את מבנה
          השאילתה. זו ההגנה הבסיסית מפני SQL injection.
        </p>
        <LearnCode
          label="INSERT עם RETURNING"
          code={`const result = await pool.query(
  \`INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *\`,
  [name, email]
);
const created = result.rows[0]; // השורה החדשה, כולל id שנוצר`}
        />
        <LearnCallout variant="warn" title="לעולם לא שרשור מחרוזות">
          <code>{'`SELECT * FROM users WHERE name = \'${name}\'`'}</code> —
          פתח ל-SQL injection. תמיד פרמטרים.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="5. getClient — כשצריך כמה פעולות ביחד">
        <p>
          <code>pool.query</code> מתאים לפעולה בודדת — כל קריאה עלולה לרוץ על
          חיבור אחר. כשצריך כמה statements שירוצו <strong>יחד</strong> (למשל
          טרנזקציה עם BEGIN/COMMIT), חייבים client אחד קבוע לכל הרצף.
        </p>
        <LearnCode
          label="db.ts"
          code={`import type { PoolClient } from "pg";

export async function getClient(): Promise<PoolClient> {
  const activePool = await getPool();
  return activePool.connect();
}
// זכרו: client.release() ב-finally אצל הקורא`}
        />
        <p>
          זה בדיוק הנושא של השיעור הבא — טרנזקציות.
        </p>
      </LearnSection>

      <LearnSection title="6. דוגמה מלאה — repository קטן">
        <LearnCode
          label="users-repository.ts"
          code={`import { getPool } from "./db";

export async function findById(id: number) {
  const pool = await getPool();
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0] ?? null;
}

export async function insert(name: string, email: string) {
  const pool = await getPool();
  const result = await pool.query(
    "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
    [name, email]
  );
  return result.rows[0];
}`}
        />
        <p className="mt-2 mb-0">
          המשך: <Link to="/learn/node-transactions">טרנזקציות DB</Link> —
          BEGIN / COMMIT / ROLLBACK כשכמה פעולות חייבות להצליח או להיכשל יחד.
        </p>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>pg = driver ל-Postgres מ-Node</li>
          <li>Pool = חיבורים ממוחזרים; max, release</li>
          <li>connect פעם אחת בעליית השרת</li>
          <li>$1, $2 — parameterized queries נגד injection</li>
          <li>getClient לרצף פעולות על אותו חיבור</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default NodePostgresLearnPage;
