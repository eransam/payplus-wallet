import FileReference from "../../components/learn/FileReference";
import LearnCallout from "../../components/learn/LearnCallout";
import LearnCode from "../../components/learn/LearnCode";
import LearnSection from "../../components/learn/LearnSection";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";

function PgAdminLearnPage() {
  return (
    <LearnTopicLayout
      slug="pgadmin"
      objectives={[
        "להבין מה זה pgAdmin ולמה משתמשים בו ליד ה-API",
        "להתמצא ב-Object Explorer: Tables, Columns, Constraints, Indexes",
        "להבחין בין Primary Key, Foreign Key, Check, Unique",
        "להריץ שאילתות ב-Query Tool ולבדוק באגים בנתונים",
        "לדעת איפה רואים ERD ואיך זה קשור ל-database_scripts שלנו",
      ]}
    >
      <LearnSection title="1. מה זה pgAdmin?">
        <p>
          <strong>pgAdmin</strong> = תוכנה גרפית לניהול{" "}
          <strong>PostgreSQL</strong> (המסד שלנו). במקום לעבוד רק בטרמינל,
          רואים טבלאות, נתונים, קשרים ואינדקסים במסך.
        </p>
        <LearnCallout variant="info" title="אנלוגיה">
          <ul>
            <li>
              <strong>PostgreSQL</strong> = המנוע שמחזיק את הנתונים
            </li>
            <li>
              <strong>pgAdmin</strong> = החלון / לוח הבקרה שמסתכלים דרכו
            </li>
            <li>
              <strong>ה-API (Express)</strong> = האפליקציה שכותבת וקוראת מה-DB
            </li>
          </ul>
        </LearnCallout>
        <p>
          בפרויקט: מקומית זה Docker (<code>docker compose</code>), בענן זה
          RDS — בשני המקרים אפשר לחבר pgAdmin עם host / port / user /
          password.
        </p>
      </LearnSection>

      <LearnSection title="2. חיבור לשרת (Register Server)">
        <p>בפעם הראשונה מגדירים שרת. הפרטים כמו ב-<code>.env</code> של ה-API:</p>
        <LearnCode
          label="דוגמה — מקומי (Docker)"
          code={`Host:     localhost
Port:     5432
Database: payplus_wallet
Username: payplus
Password: payplus`}
        />
        <LearnCode
          label="אותו דבר ב-.env של ה-API"
          code={`DATABASE_URL=postgresql://payplus:payplus@localhost:5432/payplus_wallet`}
        />
        <LearnCallout variant="warn" title="פרודקשן (RDS)">
          לא לפתוח RDS לאינטרנט בלי צורך. חיבור מ-pgAdmin מהבית דורש
          Security Group מתאים (או VPN / bastion). ללמידה — מספיק ה-DB
          המקומי.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="3. מפת המסך — Object Explorer">
        <p>
          העץ בצד שמאל הוא הניווט העיקרי. אצלנו זה נראה בערך כך:
        </p>
        <LearnCode
          label="עץ טיפוסי בפרויקט"
          code={`Servers
 └── PayPlus Wallet          ← החיבור שהגדרת
      └── Databases
           └── payplus_wallet
                └── Schemas
                     └── public
                          └── Tables
                               ├── merchants
                               ├── wallets
                               ├── transactions
                               ├── ledger_entries
                               └── users (אם הרצת את סקריפט המשתמשים)
                          └── ...`}
        />
        <p>
          <strong>Schema <code>public</code></strong> = המקום הסטנדרטי שבו
          נוצרים הטבלאות שלנו (אלא אם מגדירים אחרת).
        </p>
      </LearnSection>

      <LearnSection title="4. בתוך טבלה — מה חייב להכיר">
        <p>
          פותחים למשל <code>ledger_entries</code>. מתחתיו תיקיות חשובות:
        </p>
        <LearnCode
          label="מבנה תחת טבלה"
          code={`ledger_entries
  ├── Columns      ← עמודות (id, wallet_id, amount...)
  ├── Constraints  ← חוקים: PK, FK, Check, Unique
  ├── Indexes      ← מה מאיץ חיפושים
  ├── Triggers     ← אצלנו: חוסמים UPDATE/DELETE על ledger
  └── ...`}
        />

        <h3 className="learn-section__subtitle">4.1 Columns</h3>
        <p>
          רשימת העמודות + טיפוסים (<code>integer</code>,{" "}
          <code>numeric(18,2)</code>, <code>varchar</code>...).
        </p>
        <p>
          לחיצה כפולה על עמודה → Properties. בטאב{" "}
          <strong>Constraints של העמודה</strong> רואים בעיקר{" "}
          <strong>Not NULL</strong> / Default —{" "}
          <em>לא</em> את ה-Foreign Key (זה ברמת הטבלה).
        </p>

        <h3 className="learn-section__subtitle">4.2 Constraints (הכי חשוב להבנה)</h3>
        <p>חוקים ש-Postgres אוכף. דוגמה אמיתית מ-<code>ledger_entries</code>:</p>
        <LearnCode
          label="Constraints (6) — מה כל אחד אומר"
          code={`ledger_entries_pkey              → Primary Key (id ייחודי)
ledger_entries_wallet_id_fkey    → FK → wallets(id)
ledger_entries_transaction_id_fkey → FK → transactions(id)
ledger_entries_amount_check      → Check (למשל amount > 0)
ledger_entries_type_check        → Check (charge / refund בלבד)
uq_ledger_transaction            → Unique (לא כפילות לפי transaction)`}
        />
        <LearnCallout variant="tip" title="איך מזהים לפי השם">
          <ul>
            <li>
              <code>_pkey</code> = Primary Key
            </li>
            <li>
              <code>_fkey</code> = Foreign Key (קשר לטבלה אחרת)
            </li>
            <li>
              <code>_check</code> = תנאי לוגי
            </li>
            <li>
              <code>uq_</code> / Unique = ייחודיות
            </li>
          </ul>
        </LearnCallout>

        <h3 className="learn-section__subtitle">4.3 Indexes</h3>
        <p>
          אינדקס = מבנה עזר לחיפוש מהיר. לא דיפולטיבי על כל עמודה —
          יוצרים במכוון כשיודעים שיחפשו לפיה.
        </p>
        <LearnCode
          label="מה שיש אצלנו (מה-SQL)"
          code={`ix_ledger_entries_wallet_id     ON ledger_entries(wallet_id)
ix_transactions_wallet_id       ON transactions(wallet_id)
ix_transactions_merchant_id     ON transactions(merchant_id)

-- בנוסף: PK תמיד יוצר אינדקס אוטומטי על id`}
        />
        <p>
          ב-pgAdmin: לחיצה ימנית על אינדקס → <strong>Scripts → CREATE
          Script</strong> כדי לראות את ה-<code>CREATE INDEX</code>. טאב SQL
          ב-Properties מציג <code>-- No updates</code> אם לא שינית כלום —
          זה תקין.
        </p>

        <h3 className="learn-section__subtitle">4.4 Triggers</h3>
        <p>
          ב-<code>ledger_entries</code> יש triggers שמונעים UPDATE/DELETE —
          ה-ledger הוא <strong>append-only</strong> (רק הוספה). זה מוגדר ב-
          <code>database_scripts/02_ledger_append_only.sql</code>.
        </p>
      </LearnSection>

      <LearnSection title="5. ERD — התרשים של הקשרים">
        <p>
          <strong>ERD</strong> = Entity Relationship Diagram — תמונה של
          הטבלאות והקווים ביניהן.
        </p>
        <p>
          ב-pgAdmin: לחיצה ימנית על מסד <code>payplus_wallet</code> →{" "}
          <strong>ERD For Database</strong>.
        </p>
        <LearnCode
          label="הקשרים המרכזיים אצלנו (לוגי)"
          code={`merchants
    ↑
    │ merchant_id (FK)
transactions ── wallet_id (FK) ──→ wallets
    ↑
    │ transaction_id (FK)
ledger_entries ── wallet_id (FK) ──→ wallets`}
        />
        <p>
          בלי ERD עדיין אפשר לראות קשרים: כל Constraint עם{" "}
          <code>_fkey</code> תחת הטבלה.
        </p>
      </LearnSection>

      <LearnSection title="6. Query Tool — איפה באמת עובדים">
        <p>
          לחיצה ימנית על <code>payplus_wallet</code> (או על הטבלה) →{" "}
          <strong>Query Tool</strong>.
        </p>
        <LearnCode
          label="שאילתות שימושיות ללמידה / דיבוג"
          code={`-- כל ה-ledger של ארנק 4
SELECT * FROM ledger_entries
WHERE wallet_id = 4
ORDER BY id;

-- ארנק + יתרה
SELECT id, owner_identity, balance, status
FROM wallets
WHERE id = 1;

-- עסקאות של סוחר
SELECT t.id, t.type, t.amount, t.status, m.name AS merchant
FROM transactions t
JOIN merchants m ON m.id = t.merchant_id
WHERE m.id = 1;

-- לראות אינדקסים של טבלה
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'ledger_entries';`}
        />
        <LearnCallout variant="tip" title="קיצור דרך בלי SQL">
          לחיצה ימנית על טבלה → <strong>View/Edit Data → All Rows</strong> —
          רואים את הנתונים בטבלה. נוח לבדיקה מהירה; לסינון מורכב עדיף Query
          Tool.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="7. תרחישי באגים שתראה ב-pgAdmin">
        <ol>
          <li>
            <strong>שגיאת FK</strong> — מנסים charge עם{" "}
            <code>wallet_id</code> שלא קיים → Postgres דוחה. ב-pgAdmin
            תוודא שהשורה ב-<code>wallets</code> קיימת.
          </li>
          <li>
            <strong>Check constraint</strong> —{" "}
            <code>amount</code> שלילי / <code>type</code> לא חוקי → נדחה.
          </li>
          <li>
            <strong>Unique</strong> — אותו <code>client_request_id</code>{" "}
            פעמיים ב-<code>transactions</code> (idempotency).
          </li>
          <li>
            <strong>Trigger על ledger</strong> — ניסיון למחוק/לעדכן שורת
            ledger ידנית → ייכשל (append-only).
          </li>
        </ol>
        <LearnCallout variant="warn" title="אל תשנה schema ידנית בפרודקשן">
          מקור האמת הוא <code>database_scripts/</code> +{" "}
          <code>npm run run-sql</code>. pgAdmin טוב לבדיקה; שינויי מבנה
          עדיף דרך הקבצים ב-Git.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="8. pgAdmin מול הקוד שלנו">
        <LearnCode
          label="מי עושה מה"
          code={`אתה כותב SQL ב-database_scripts/
        ↓
npm run run-sql   →  יוצר טבלאות / SP / triggers
        ↓
API (Express + pg)  →  קורא ל-sp_* בזמן ריצה
        ↓
pgAdmin             →  אתה מסתכל / בודק / מדברג`}
        />
        <p>
          ה-API לא משתמש ב-pgAdmin. הוא מתחבר עם <code>DATABASE_URL</code>{" "}
          ומריץ stored procedures (<code>sp_*</code>) מ-
          <code>04_stored_procedures.sql</code>.
        </p>
      </LearnSection>

      <LearnSection title="9. צ׳קליסט — מה חייב לדעת">
        <ul>
          <li>לחבר שרת (host, port, db, user, password)</li>
          <li>למצוא טבלה תחת <code>public → Tables</code></li>
          <li>לקרוא Columns / Constraints / Indexes</li>
          <li>
            להבין ש-<code>_fkey</code> = קשר בין טבלאות (ERD)
          </li>
          <li>להריץ SELECT ב-Query Tool</li>
          <li>לבדוק נתונים אחרי charge / refund מהאפליקציה</li>
          <li>לא לסמוך על עריכה ידנית כתחליף למיגרציות ב-Git</li>
        </ul>
      </LearnSection>

      <LearnSection title="10. קבצים רלוונטיים בפרויקט">
        <ul className="learn-files">
          <FileReference
            path="database_scripts/01_create_wallet_tables.sql"
            description="טבלאות, FK, Check, Indexes"
          />
          <FileReference
            path="database_scripts/02_ledger_append_only.sql"
            description="Triggers — ledger רק להוספה"
          />
          <FileReference
            path="database_scripts/04_stored_procedures.sql"
            description="sp_* שה-API קורא אליהם"
          />
          <FileReference
            path="docker-compose.yml"
            description="Postgres מקומי — host/port ל-pgAdmin"
          />
          <FileReference
            path="src/01-utils/config.ts"
            description="DATABASE_URL — אותם פרטי חיבור"
          />
        </ul>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>
            <strong>pgAdmin</strong> = UI ל-PostgreSQL (עיניים על ה-DB)
          </li>
          <li>
            <strong>Columns</strong> = מבנה · <strong>Constraints</strong> =
            חוקים · <strong>Indexes</strong> = מהירות
          </li>
          <li>
            <code>_fkey</code> = קשר בין טבלאות · <strong>ERD</strong> =
            התרשים
          </li>
          <li>
            <strong>Query Tool</strong> = הכלי היומיומי לבדיקות
          </li>
          <li>
            Schema ב-Git (<code>database_scripts</code>) = מקור האמת
          </li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default PgAdminLearnPage;
