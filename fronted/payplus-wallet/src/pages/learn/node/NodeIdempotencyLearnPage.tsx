import { Link } from "react-router-dom";
import LearnCallout from "../../../components/learn/LearnCallout";
import LearnCode from "../../../components/learn/LearnCode";
import LearnSection from "../../../components/learn/LearnSection";
import LearnTopicLayout from "../../../components/learn/LearnTopicLayout";

function NodeIdempotencyLearnPage() {
  return (
    <LearnTopicLayout
      slug="node-idempotency"
      objectives={[
        "להבין למה בקשה כפולה בפעולות כתיבה היא בעיה אמיתית",
        "להכיר idempotency key ומי מייצר אותו",
        "לבנות זרימת הגנה: cache מהיר + מסד נתונים כאמת",
        "לדעת שזה דפוס סטנדרטי בכל מערכת תשלומים והזמנות",
      ]}
    >
      <LearnSection title="1. הבעיה — אותה בקשה פעמיים">
        <p>
          ברשת שום דבר לא מובטח: timeout, retry אוטומטי, double-click, proxy
          ששולח שוב. אם לקוח שולח <strong>בקשת תשלום של 100 ש"ח</strong>{" "}
          פעמיים — בלי הגנה — עלולים לחייב 200. אותו סיפור עם יצירת הזמנה,
          שליחת מייל, או כל פעולה עם side effect.
        </p>
        <p>
          <strong>Idempotency</strong> = אותה פעולה, עם אותו מזהה, מחזירה{" "}
          <em>אותה תוצאה</em> — ולא מבצעת את הפעולה שוב. זו לא תוספת נחמדה;
          זו דרישה בסיסית בכל API של תשלומים (Stripe, PayPal וכו' עובדים כך).
        </p>
        <LearnCallout variant="tip" title="במשפט אחד">
          הלקוח נותן מזהה ייחודי לבקשה (idempotency key); השרת זוכר — אם כבר
          ראה את המזהה, מחזיר את התשובה הקודמת בלי לבצע שוב.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="2. Idempotency Key — מי מייצר ומה שולחים">
        <p>
          ה<strong>לקוח</strong> (פרונט, סקריפט, שירות חיצוני) יוצר UUID או
          מזהה ייחודי לכל <em>ניסיון לוגי</em> — לא לכל HTTP retry. כלומר:
          לחיצה על "שלם" = מפתח אחד; ה-retry האוטומטי אחרי timeout שולח את{" "}
          <em>אותו</em> מפתח.
        </p>
        <LearnCode
          label="בקשת יצירת תשלום"
          code={`POST /api/payments
Authorization: Bearer <token>
Content-Type: application/json

{
  "order_id": 42,
  "amount": "100.00",
  "idempotency_key": "b4f7a3e0-1c9d-4f2a-8b6e-2d5c9e1f0a37"
}`}
        />
        <p>
          שליחה חוזרת עם <strong>אותו</strong> <code>idempotency_key</code> —
          מחזירה את אותו אובייקט תשלום (הצליח או נדחה), בלי חיוב כפול. מזהה{" "}
          <em>חדש</em> = ניסיון חדש שמבוצע באמת.
        </p>
      </LearnSection>

      <LearnSection title="3. שכבות ההגנה">
        <ol>
          <li>
            <strong>Cache מהיר (Redis):</strong> מפתח{" "}
            <code>idempotency:{"{key}"}</code> עם TTL — תשובה מיידית בלי לגעת
            במסד.
          </li>
          <li>
            <strong>מסד הנתונים (האמת):</strong> עמודת{" "}
            <code>idempotency_key</code> עם UNIQUE constraint — עובד גם אם
            Redis ריק או נפל.
          </li>
          <li>
            <strong>טרנזקציית DB:</strong> הבדיקה והביצוע רצים בתוך
            BEGIN/COMMIT — כמו שראינו בשיעור הטרנזקציות.
          </li>
        </ol>
        <LearnCode
          label="payments-service.ts — הזרימה"
          code={`async function createPayment(input: CreatePaymentInput) {
  const key = input.idempotencyKey.trim();

  // 1) cache — הכי מהיר
  const cached = await idempotencyCache.get(key);
  if (cached) return cached;

  // 2) בתוך טרנזקציה — בדיקה במסד (מקור האמת)
  const existing = await paymentsRepository.findByIdempotencyKey(key);
  if (existing) return cacheAndReturn(key, existing);

  // 3) ביצוע התשלום החדש
  const payment = await runPayment(input);
  return cacheAndReturn(key, payment);
}`}
        />
      </LearnSection>

      <LearnSection title="4. מה שומרים ב-cache">
        <p>
          לא רק "כן/לא" — שומרים את <strong>אובייקט התוצאה המלא</strong>{" "}
          כ-JSON. כך retry מקבל בדיוק את אותה תשובת HTTP (status, סכום, סיבת
          דחייה), והלקוח לא יכול להבחין בין התשובה המקורית לתשובה מה-cache.
        </p>
        <LearnCode
          label="idempotency-cache.ts"
          code={`const KEY_PREFIX = "idempotency:";
const TTL_SECONDS = 60 * 60 * 24; // 24 שעות — חלון retry סביר

export async function set(key: string, payment: Payment) {
  const redis = await getRedis();
  await redis.set(
    \`\${KEY_PREFIX}\${key}\`,
    JSON.stringify(payment),
    { EX: TTL_SECONDS }
  );
}

export async function get(key: string): Promise<Payment | null> {
  const redis = await getRedis();
  const value = await redis.get(\`\${KEY_PREFIX}\${key}\`);
  return value ? JSON.parse(value) : null;
}`}
        />
        <LearnCallout variant="warn" title="כשל cache ≠ כשל idempotency">
          אם קריאה ל-Redis נכשלת — הלוגיקה ממשיכה לבדיקה במסד (עם warn בלוג).
          ה-cache הוא האצה; ה-UNIQUE constraint במסד הוא ההגנה האמיתית.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="5. UNIQUE constraint — קו ההגנה האחרון">
        <p>
          גם עם cache ובדיקה במסד, שתי בקשות זהות עלולות להגיע{" "}
          <em>באותה מילישנייה</em> — שתיהן לא ימצאו רשומה קיימת. הפתרון: אילוץ
          ייחודיות ברמת המסד.
        </p>
        <LearnCode
          label="schema"
          code={`CREATE TABLE payments (
  id              SERIAL PRIMARY KEY,
  order_id        INTEGER NOT NULL,
  amount          NUMERIC(12, 2) NOT NULL,
  status          TEXT NOT NULL,
  idempotency_key TEXT NOT NULL UNIQUE
);`}
        />
        <p>
          הבקשה השנייה תיכשל על הפרת UNIQUE — ואז ה-service תופס את השגיאה,
          שולף את הרשומה הקיימת ומחזיר אותה. race condition נסגר ברמת המסד,
          לא ברמת הקוד.
        </p>
      </LearnSection>

      <LearnSection title="6. דפוס מקצועי — מה לזכור">
        <ul>
          <li>
            Idempotency חובה ב-<strong>כתיבה עם side effects</strong> — כסף,
            שליחת מייל, יצירת הזמנה.
          </li>
          <li>
            המזהה מגיע מה<strong>לקוח</strong> — השרת לא יכול לנחש
            retroactively אילו שתי בקשות הן "אותו ניסיון".
          </li>
          <li>
            TTL ב-cache — מספיק לחלון retry סביר (שעות עד ימים).
          </li>
          <li>
            GET הוא idempotent מטבעו; POST שיוצר משהו — לא, ולכן צריך את
            המפתח.
          </li>
        </ul>
        <p className="mt-2 mb-0">
          המשך: <Link to="/learn/node-auth">JWT ו-Auth</Link> — מי בכלל רשאי
          לשלוח את הבקשה.
        </p>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>Retry ברשת = הסיבה ל-idempotency</li>
          <li>idempotency key = מזהה ייחודי מהלקוח לכל ניסיון לוגי</li>
          <li>Redis מהיר + מסד נתונים כאמת + UNIQUE constraint</li>
          <li>שומרים את התשובה המלאה, לא רק "כן/לא"</li>
          <li>אותו מפתח → אותה תשובה, בלי ביצוע כפול</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default NodeIdempotencyLearnPage;
