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
          שורות, SQL. חשוב להבין: Postgres הוא{" "}
          <strong>תוכנה נפרדת לגמרי</strong> שרצה ליד Node (על אותו מחשב או
          על שרת אחר) — Node לא "יודע" Postgres מלידה.
        </p>
        <p>
          אז איך הם מדברים? דרך <strong>TCP</strong>. רגע — מה זה TCP?
        </p>
        <LearnCallout variant="info" title="TCP במילים פשוטות">
          TCP הוא "קו טלפון" בין שתי תוכנות ברשת: פותחים חיבור, שני הצדדים
          יכולים לשלוח ולקבל הודעות, והחיבור נשאר פתוח עד שסוגרים. HTTP
          שלמדנו? הוא בעצמו רץ <em>מעל</em> TCP. גם השיחה עם Postgres רצה
          מעל TCP — רק בשפה אחרת (פרוטוקול של Postgres במקום HTTP).
        </LearnCallout>
        <p>
          החבילה <code>pg</code> (node-postgres) היא ה"מתורגמן": היא פותחת
          את חיבור ה-TCP אל Postgres (בדרך כלל לפורט 5432), שולחת את
          ה-SQL שכתבת, ומחזירה לך את התוצאות כאובייקטים של JavaScript.
        </p>
        <LearnCode
          label="התמונה המלאה"
          code={`הדפדפן ──HTTP──▶ Node (Express) ──TCP──▶ PostgreSQL
                    "תן לי משתמש 5"      SELECT * FROM users
                                          WHERE id = 5`}
        />
        <p>
          ומה זה <strong>Pool</strong>? בקצרה: "מאגר חיבורים מוכנים". פתיחת
          חיבור TCP חדש ל-Postgres לוקחת זמן (לחיצת יד ברשת + אימות סיסמה).
          אם נפתח חיבור חדש לכל בקשה — נבזבז את רוב הזמן על התחברות. Pool
          פותח כמה חיבורים <strong>פעם אחת</strong>, שומר אותם פתוחים,
          ומשאיל אותם לבקשות לפי הצורך — כמו עמדות טעונות מראש. נרחיב על
          זה בסעיף 3.
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
          כמו שאמרנו בסעיף 1: פתיחת חיבור TCP + אימות סיסמה מול Postgres היא
          פעולה <strong>יקרה</strong> — עשרות מילישניות ומשאבים בשני הצדדים.
          אם השאילתה עצמה לוקחת 2ms והחיבור לוקח 50ms — בזבזנו 96% מהזמן על
          התחברות.
        </p>
        <p>
          דימוי: קופות בסופר. במקום לבנות קופה חדשה לכל לקוח ולפרק אותה
          כשהוא מסיים — פותחים 20 קופות <strong>פעם אחת בבוקר</strong>, וכל
          לקוח ניגש לקופה פנויה. אין קופה פנויה? מחכים רגע בתור. זה בדיוק
          Pool: פותח מראש מספר חיבורים, שומר אותם חיים, ומלווה כל query
          לחיבור פנוי.
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
