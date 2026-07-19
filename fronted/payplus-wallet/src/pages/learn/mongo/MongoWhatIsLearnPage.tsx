import { Link } from "react-router-dom";
import LearnCallout from "../../../components/learn/LearnCallout";
import LearnCode from "../../../components/learn/LearnCode";
import LearnSection from "../../../components/learn/LearnSection";
import LearnTopicLayout from "../../../components/learn/LearnTopicLayout";

function MongoWhatIsLearnPage() {
  return (
    <LearnTopicLayout
      slug="mongo-what-is"
      objectives={[
        "להבין מה זה MongoDB ומה זה מסד מסמכים (Document Database)",
        "להכיר את המבנה: Database → Collection → Document",
        "להבין את ההבדלים מ-Postgres (טבלאות מול מסמכים)",
        "לדעת מתי בוחרים MongoDB ומתי מסד רלציוני",
      ]}
    >
      <LearnSection title="1. מאפס — מה זה MongoDB?">
        <p>
          <strong>MongoDB</strong> הוא מסד נתונים מסוג{" "}
          <strong>NoSQL — מסד מסמכים (Document Database)</strong>. במקום לשמור
          נתונים בטבלאות עם שורות ועמודות (כמו Postgres), הוא שומר{" "}
          <strong>מסמכים (Documents)</strong> — אובייקטים שנראים בדיוק כמו JSON.
        </p>
        <LearnCode
          label="ככה נראה מסמך במונגו — מוכר, נכון? זה בעצם אובייקט JS"
          code={`{
  "_id": ObjectId("66a1f2c9e4b0a1b2c3d4e5f6"),
  "email": "admin@payplus.local",
  "full_name": "Admin User",
  "balance": 250.5,
  "tags": ["vip", "verified"],
  "address": {
    "city": "תל אביב",
    "street": "רוטשילד 1"
  }
}`}
        />
        <p>
          שימו לב לשני דברים שאי אפשר לעשות בשורה אחת של טבלה רלציונית: יש כאן{" "}
          <strong>מערך</strong> (<code>tags</code>) ויש{" "}
          <strong>אובייקט מקונן</strong> (<code>address</code>). במונגו זה
          טבעי — המסמך מכיל הכל בפנים.
        </p>
        <LearnCallout variant="tip" title="במשפט אחד">
          MongoDB = מסד נתונים ששומר אובייקטים דמויי JSON. אם אתם יודעים לעבוד
          עם אובייקטים ב-JavaScript — אתם כבר מבינים איך הנתונים נראים.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="2. אבני הבניין: Database → Collection → Document">
        <p>ההיררכיה במונגו פשוטה, והכי קל להבין אותה מול המקבילה ב-SQL:</p>
        <ul>
          <li>
            <strong>Database</strong> — כמו database ב-Postgres. למשל:{" "}
            <code>payplus_wallet</code>.
          </li>
          <li>
            <strong>Collection (אוסף)</strong> — המקבילה לטבלה. למשל:{" "}
            <code>wallets</code>, <code>transactions</code>, <code>users</code>.
          </li>
          <li>
            <strong>Document (מסמך)</strong> — המקבילה לשורה. אובייקט JSON אחד
            בתוך ה-Collection.
          </li>
          <li>
            <strong>Field (שדה)</strong> — המקבילה לעמודה. מפתח בתוך המסמך.
          </li>
        </ul>
        <LearnCode
          label="טבלת תרגום SQL ↔ MongoDB"
          code={`SQL (Postgres)      MongoDB
--------------      -------
Database            Database
Table               Collection
Row                 Document
Column              Field
Primary Key (id)    _id (נוצר אוטומטית)
JOIN                $lookup (או embed - בשיעור 6)`}
        />
        <LearnCallout variant="info" title="ההבדל הגדול: אין סכמה כפויה">
          ב-Postgres חייבים להגדיר טבלה מראש (<code>CREATE TABLE</code>) וכל
          שורה חייבת להתאים. במונגו — כל מסמך ב-Collection יכול להיראות אחרת.
          זו גמישות גדולה, אבל גם אחריות: הקוד שלנו (או Mongoose — שיעור 5)
          צריך לשמור על הסדר.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="3. במה זה שונה מ-Postgres שאנחנו מכירים?">
        <p>
          בפרויקט PayPlus Wallet אנחנו שומרים ארנק וסוחר בטבלאות נפרדות,
          ומחברים אותם עם JOIN. במונגו החשיבה הפוכה —{" "}
          <strong>מה שנקרא יחד, נשמר יחד</strong>:
        </p>
        <LearnCode
          label="אותם נתונים, שתי גישות"
          code={`-- Postgres: שתי טבלאות + JOIN
SELECT t.*, m.name AS merchant_name
FROM transactions t
JOIN merchants m ON m.id = t.merchant_id;

// MongoDB: מסמך אחד שמכיל את מה שצריך
{
  "_id": ObjectId("..."),
  "amount": 120,
  "status": "completed",
  "merchant": { "name": "סופר יוחננוף", "category": "מזון" }
}`}
        />
        <ul>
          <li>
            <strong>גמישות</strong> — מוסיפים שדה חדש? פשוט כותבים אותו במסמך
            הבא. אין <code>ALTER TABLE</code>.
          </li>
          <li>
            <strong>מהירות קריאה</strong> — כשהכול במסמך אחד, קריאה אחת מביאה
            הכול. אין צורך ב-JOIN.
          </li>
          <li>
            <strong>המחיר</strong> — טרנזקציות בין הרבה מסמכים מסובכות יותר,
            ואין הגנות כמו foreign keys. שלמות הנתונים עלינו.
          </li>
        </ul>
      </LearnSection>

      <LearnSection title="4. אז מתי MongoDB ומתי Postgres?">
        <p>
          <strong>MongoDB מתאים כאשר:</strong>
        </p>
        <ul>
          <li>
            המבנה של הנתונים <strong>משתנה או גמיש</strong> — קטלוג מוצרים שבו
            לכל מוצר מאפיינים שונים, פרופילים, תוכן, לוגים, אירועים.
          </li>
          <li>
            הנתונים <strong>נקראים יחד כיחידה אחת</strong> — הזמנה עם הפריטים
            שלה, פוסט עם התגובות שלו.
          </li>
          <li>
            צריך <strong>לפתח מהר</strong> — אין migrations על כל שינוי קטן.
          </li>
        </ul>
        <p>
          <strong>Postgres (רלציוני) מתאים כאשר:</strong>
        </p>
        <ul>
          <li>
            נתונים <strong>פיננסיים/קריטיים</strong> עם טרנזקציות מורכבות — כמו
            הארנק שלנו. ACID חזק וגם ledger.
          </li>
          <li>
            יש <strong>הרבה קשרים</strong> בין ישויות ושאילתות מורכבות עם JOIN.
          </li>
          <li>צריך אכיפת סכמה ברמת המסד (constraints, foreign keys).</li>
        </ul>
        <LearnCallout variant="warn" title="לא 'או-או' — הרבה חברות משתמשות בשניהם">
          תבנית נפוצה בתעשייה: Postgres לכסף ולנתונים העסקיים הקריטיים, MongoDB
          לקטלוגים, תוכן, לוגים והעדפות משתמש. בראיון עבודה — התשובה "תלוי
          באופי הנתונים" עם נימוק היא תשובה של סניור.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="5. עוד שני מושגים שכדאי להכיר כבר עכשיו">
        <ul>
          <li>
            <strong>_id ו-ObjectId</strong> — לכל מסמך יש שדה <code>_id</code>{" "}
            ייחודי. אם לא נותנים אחד, מונגו יוצר <code>ObjectId</code> אוטומטית
            (12 בייטים שכוללים גם חותמת זמן — אפשר לדעת מתי מסמך נוצר רק
            מה-id שלו).
          </li>
          <li>
            <strong>BSON</strong> — מאחורי הקלעים מונגו לא שומר JSON טקסטואלי
            אלא <strong>BSON</strong> (Binary JSON) — פורמט בינארי מהיר יותר,
            שתומך בטיפוסים נוספים כמו תאריכים ו-ObjectId.
          </li>
        </ul>
        <p className="mt-2 mb-0">
          מוכנים להתחיל בפועל? השיעור הבא:{" "}
          <Link to="/learn/mongo-install">התקנה + Compass (GUI)</Link> — מקימים
          סביבת עבודה מלאה.
        </p>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>MongoDB = מסד מסמכים (NoSQL) — שומר אובייקטים דמויי JSON</li>
          <li>Database → Collection (טבלה) → Document (שורה) → Field (עמודה)</li>
          <li>אין סכמה כפויה — גמיש, אבל האחריות על הקוד</li>
          <li>מה שנקרא יחד — נשמר יחד (embed במקום JOIN)</li>
          <li>כסף וטרנזקציות → Postgres; תוכן גמיש וקטלוגים → MongoDB</li>
          <li>_id נוצר אוטומטית (ObjectId); בפנים הכל BSON</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default MongoWhatIsLearnPage;
