import { Link } from "react-router-dom";
import LearnCallout from "../../../components/learn/LearnCallout";
import LearnCode from "../../../components/learn/LearnCode";
import LearnSection from "../../../components/learn/LearnSection";
import LearnTopicLayout from "../../../components/learn/LearnTopicLayout";

function NodeTransactionsLearnPage() {
  return (
    <LearnTopicLayout
      slug="node-transactions"
      objectives={[
        "להבין BEGIN / COMMIT / ROLLBACK",
        "לדעת למה העברת כסף בין חשבונות חייבת atomicity",
        "לשלוט בדפוס getClient + try/catch/finally",
        "להבין SELECT ... FOR UPDATE ולמה הוא מונע race condition",
      ]}
    >
      <LearnSection title="1. מאפס — מה זו טרנזקציה?">
        <p>
          טרנזקציה במסד נתונים היא <strong>יחידת עבודה</strong>: כמה פעולות
          שמתבצעות כולן — או לא מתבצעות בכלל. אם משהו נכשל באמצע,{" "}
          <strong>ROLLBACK</strong> מבטל הכל, כאילו לא התחיל.
        </p>
        <p>
          הדוגמה הקלאסית: העברת 100 ש"ח מחשבון א' לחשבון ב'. בלי טרנזקציה —
          ירד כסף מחשבון א' אבל לא נכנס לחשבון ב' (או להפך). במערכת אמיתית זה
          בלתי מתקבל.
        </p>
        <LearnCallout variant="tip" title="ACID">
          ה-A ב-ACID = <strong>Atomicity</strong> — כל הטרנזקציה או כלום.
          Postgres מספק את זה בחינם — צריך רק להשתמש נכון.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="2. פקודות SQL">
        <LearnCode
          label="מחזור חיים"
          code={`BEGIN;                       -- מתחיל טרנזקציה
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
INSERT INTO transfers (from_id, to_id, amount) VALUES (1, 2, 100);
COMMIT;                      -- שומר הכל לצמיתות

-- אם נזרקה שגיאה באמצע:
ROLLBACK;                    -- מבטל כל מה שנעשה מאז BEGIN`}
        />
        <p>
          נקודה קריטית ב-<code>pg</code>: כל הפקודות חייבות לרוץ על{" "}
          <strong>אותו client</strong>. <code>pool.query</code> עלול לתת חיבור
          אחר לכל statement — ו-BEGIN על חיבור אחד לא משפיע על COMMIT בחיבור
          אחר.
        </p>
      </LearnSection>

      <LearnSection title="3. הדפוס — getClient + try/catch/finally">
        <LearnCode
          label="דפוס חובה"
          code={`const client = await getClient();
try {
  await client.query("BEGIN");

  // כל ה-queries על client — לא על pool

  await client.query("COMMIT");
  return result;
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  client.release(); // תמיד — גם אחרי COMMIT וגם אחרי ROLLBACK
}`}
        />
        <LearnCallout variant="warn" title="finally">
          <code>release()</code> חייב להיות ב-<code>finally</code> — גם אם היה
          ROLLBACK או throw. בלי זה ה-pool "שורף" חיבור בכל שגיאה, ואחרי כמה
          שגיאות השרת נתקע.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="4. דוגמה מלאה — העברת כסף">
        <LearnCode
          label="transfers-service.ts"
          code={`async function transfer(fromId: number, toId: number, amount: number) {
  const client = await getClient();
  try {
    await client.query("BEGIN");

    // נעילת שורת החשבון — מונע שתי העברות במקביל
    const result = await client.query(
      "SELECT * FROM accounts WHERE id = $1 FOR UPDATE",
      [fromId]
    );
    const from = result.rows[0];
    if (!from) throw notFound("Account", fromId);
    if (from.balance < amount) {
      throw new AppError("insufficient_funds", "Not enough balance", 409);
    }

    await client.query(
      "UPDATE accounts SET balance = balance - $1 WHERE id = $2",
      [amount, fromId]
    );
    await client.query(
      "UPDATE accounts SET balance = balance + $1 WHERE id = $2",
      [amount, toId]
    );
    const transferRow = await client.query(
      \`INSERT INTO transfers (from_id, to_id, amount)
       VALUES ($1, $2, $3) RETURNING *\`,
      [fromId, toId, amount]
    );

    await client.query("COMMIT");
    return transferRow.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}`}
        />
        <p>
          <code>SELECT ... FOR UPDATE</code> נועל את השורה עד סוף הטרנזקציה.
          בלי זה, שתי העברות במקביל עלולות לקרוא את אותה יתרה ישנה ולהוריד את
          החשבון מתחת לאפס — race condition קלאסי.
        </p>
      </LearnSection>

      <LearnSection title="5. כישלון עסקי מול שגיאה טכנית">
        <ul>
          <li>
            <strong>תוצאה עסקית לגיטימית</strong> — למשל "אין מספיק יתרה" כשהמוצר
            דורש רישום הניסיון: אפשר לשמור רשומת "נדחה" ולעשות COMMIT. המערכת
            עבדה; הפעולה נדחתה.
          </li>
          <li>
            <strong>throw + ROLLBACK</strong> — משהו לא תקין או לא צפוי: קלט
            שגוי, רשומה חסרה, שגיאת מסד. מבטלים הכל, וה-error handler מחזיר
            404/409/500.
          </li>
        </ul>
        <p>
          ההחלטה איזה מקרה הוא איזה — לוגיקה עסקית, ולכן היא חיה בשכבת
          ה-service, לא ב-repository.
        </p>
      </LearnSection>

      <LearnSection title="6. טעויות נפוצות">
        <ul>
          <li>
            <strong>ערבוב pool ו-client</strong> — BEGIN על client אבל UPDATE
            דרך <code>pool.query</code>. ה-UPDATE רץ מחוץ לטרנזקציה בלי שום
            אזהרה.
          </li>
          <li>
            <strong>טרנזקציה ארוכה מדי</strong> — קריאת API חיצוני בין BEGIN
            ל-COMMIT מחזיקה נעילות ומחניקה את המסד. עושים I/O חיצוני לפני או
            אחרי.
          </li>
          <li>
            <strong>שכחת ROLLBACK ב-catch</strong> — החיבור חוזר ל-pool עם
            טרנזקציה פתוחה, והבקשה הבאה שתקבל אותו תרוץ בתוך טרנזקציה זרה.
          </li>
        </ul>
        <p className="mt-2 mb-0">
          המשך: <Link to="/learn/node-redis">Redis</Link> — מאגר מהיר בזיכרון
          שעובד לצד מסד הנתונים.
        </p>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>טרנזקציה = BEGIN → פעולות → COMMIT או ROLLBACK</li>
          <li>אותו client לכל ה-queries ביחידה</li>
          <li>finally: client.release()</li>
          <li>FOR UPDATE = נעילת שורה נגד race condition</li>
          <li>כישלון עסקי עם COMMIT; שגיאה עם ROLLBACK + throw</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default NodeTransactionsLearnPage;
