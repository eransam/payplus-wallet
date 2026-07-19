import { Link } from "react-router-dom";
import LearnCallout from "../../../components/learn/LearnCallout";
import LearnCode from "../../../components/learn/LearnCode";
import LearnSection from "../../../components/learn/LearnSection";
import LearnTopicLayout from "../../../components/learn/LearnTopicLayout";

function MongoSchemaDesignLearnPage() {
  return (
    <LearnTopicLayout
      slug="mongo-schema-design"
      objectives={[
        "להבין את שתי הגישות: Embed (הטמעה) מול Reference (הפניה)",
        "לדעת את כלל הזהב — מה שנקרא יחד נשמר יחד",
        "לזהות מתי embed מסוכן (מערכים שגדלים בלי גבול)",
        "להכיר את $lookup — ה'JOIN' של מונגו",
      ]}
    >
      <LearnSection title="1. השאלה החשובה ביותר במונגו">
        <p>
          ב-Postgres התשובה תמיד אחת: מפרקים לטבלאות ומחברים עם JOIN
          (נורמליזציה). במונגו יש <strong>שתי דרכים</strong> לייצג קשר בין
          ישויות — וההחלטה ביניהן היא ההחלטה שהכי משפיעה על ביצועים ופשטות:
        </p>
        <LearnCode
          label="אותו קשר (ארנק ↔ עסקאות), שתי גישות"
          code={`// גישה 1: Embed — העסקאות בתוך מסמך הארנק
{
  _id: ObjectId("..."),
  owner: "דנה",
  balance: 500,
  transactions: [
    { amount: -50, merchant: "קפה גרג", at: ISODate("...") },
    { amount: 200, merchant: "הפקדה",  at: ISODate("...") }
  ]
}

// גישה 2: Reference — collection נפרד עם הפניה (כמו foreign key)
// wallets:
{ _id: ObjectId("AAA"), owner: "דנה", balance: 500 }
// transactions:
{ _id: ObjectId("..."), wallet_id: ObjectId("AAA"), amount: -50, merchant: "קפה גרג" }`}
        />
      </LearnSection>

      <LearnSection title="2. מתי Embed (הטמעה)?">
        <p>
          <strong>כלל הזהב של מונגו: מה שנקרא יחד — נשמר יחד.</strong> אם בכל
          פעם שמציגים את הישות הראשית צריך גם את הילדים שלה, ההטמעה חוסכת
          שאילתה שנייה.
        </p>
        <ul>
          <li>
            <strong>הילדים תמיד מוצגים עם ההורה</strong> — כתובת של משתמש,
            פריטי הזמנה בהזמנה.
          </li>
          <li>
            <strong>לילדים אין חיים משלהם</strong> — פריט הזמנה לא קיים בלי
            ההזמנה, ואף אחד לא שואל "תן לי את כל הפריטים מכל ההזמנות".
          </li>
          <li>
            <strong>הרשימה חסומה בגודלה</strong> — לכתובת יש 5 שדות, להזמנה
            10-20 פריטים. לא אלפים.
          </li>
        </ul>
        <LearnCallout variant="warn" title="הסכנה: מערך שגדל בלי גבול">
          עסקאות של ארנק זה דוגמה למערך <strong>שרק גדל</strong> — אלפי עסקאות
          בשנה. מסמך במונגו מוגבל ל-<strong>16MB</strong>, וכל עדכון של מסמך
          ענק יקר. רשימות שגדלות ללא גבול (עסקאות, לוגים, הודעות) —{" "}
          <strong>תמיד Reference</strong>.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="3. מתי Reference (הפניה)?">
        <ul>
          <li>
            <strong>הרשימה גדלה בלי גבול</strong> — עסקאות, הודעות, לוגים.
          </li>
          <li>
            <strong>הילד קיים בזכות עצמו</strong> — סוחר (merchant) מופיע
            בעסקאות של הרבה ארנקים; לא נעתיק אותו לכל אחד.
          </li>
          <li>
            <strong>ניגשים לילדים בנפרד</strong> — "כל העסקאות מהחודש האחרון
            בכל הארנקים" — שאילתה כזו רוצה collection נפרד.
          </li>
        </ul>
        <LearnCode
          label="עבודה עם reference — שתי שאילתות, או $lookup"
          code={`// דרך פשוטה: שתי שאילתות
const wallet = await db.collection("wallets").findOne({ owner: "דנה" });
const txs = await db.collection("transactions")
  .find({ wallet_id: wallet._id })
  .sort({ at: -1 })
  .limit(20)
  .toArray();

// דרך אחת: $lookup — ה"JOIN" של מונגו (בתוך aggregation)
db.wallets.aggregate([
  { $match: { owner: "דנה" } },
  { $lookup: {
      from: "transactions",
      localField: "_id",
      foreignField: "wallet_id",
      as: "transactions"
  }}
])`}
        />
        <LearnCallout variant="info" title="$lookup קיים — אבל הוא לא ברירת המחדל">
          אם אתם מוצאים את עצמכם עושים $lookup בכל שאילתה — כנראה שהמבנה לא
          נכון למונגו (או שהנתונים בכלל רלציוניים באופיים והיו שמחים
          ב-Postgres). $lookup הוא כלי לגיטימי, לא דפוס עבודה קבוע.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="4. דפוס ביניים נפוץ — שכפול מבוקר (Extended Reference)">
        <p>
          לפעמים רוצים גם וגם: reference נפרד, אבל עם{" "}
          <strong>עותק קטן של השדות שצריך להצגה</strong>. למשל בעסקה נשמור גם
          את שם הסוחר, לא רק את ה-id שלו:
        </p>
        <LearnCode
          label="עסקה עם עותק של שם הסוחר"
          code={`{
  _id: ObjectId("..."),
  wallet_id: ObjectId("AAA"),
  amount: -50,
  merchant: {
    _id: ObjectId("BBB"),
    name: "קפה גרג"      // עותק! חוסך $lookup בכל הצגת רשימה
  },
  at: ISODate("...")
}`}
        />
        <p>
          המחיר: אם הסוחר משנה שם, העסקאות הישנות מציגות את השם הישן. בהרבה
          מקרים (כמו היסטוריית עסקאות) זה דווקא <em>נכון עסקית</em> — הקבלה
          צריכה להראות את השם כפי שהיה בזמן הקנייה.
        </p>
      </LearnSection>

      <LearnSection title="5. טבלת החלטה מהירה">
        <LearnCode
          label="לשמור ליד המחשב"
          code={`השאלה                                        התשובה
--------------------------------------------  ---------
תמיד מוצג יחד עם ההורה?                       Embed
רשימה קטנה וחסומה (כתובת, פריטי הזמנה)?       Embed
גדל בלי גבול (עסקאות, לוגים, הודעות)?         Reference
משותף לכמה הורים (סוחר, קטגוריה)?             Reference
צריך שאילתות על הילדים לבד?                   Reference
רשימה + צריך רק שם להצגה?                     Reference + עותק קטן`}
        />
        <p className="mt-2 mb-0">
          נשאר שיעור אחרון:{" "}
          <Link to="/learn/mongo-indexes-aggregation">
            אינדקסים ו-Aggregation
          </Link>{" "}
          — ביצועים וסיכומים.
        </p>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>כלל הזהב: מה שנקרא יחד — נשמר יחד</li>
          <li>Embed: מוצג עם ההורה, רשימה חסומה, אין חיים עצמאיים</li>
          <li>Reference: גדל בלי גבול, משותף, או נשאל בנפרד</li>
          <li>מסמך מוגבל ל-16MB — מערך אינסופי הוא באג בעיצוב</li>
          <li>$lookup = JOIN של מונגו — קיים, אבל לא דפוס קבוע</li>
          <li>Extended Reference: הפניה + עותק קטן לתצוגה</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default MongoSchemaDesignLearnPage;
