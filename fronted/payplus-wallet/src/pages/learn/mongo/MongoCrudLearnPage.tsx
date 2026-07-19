import { Link } from "react-router-dom";
import LearnCallout from "../../../components/learn/LearnCallout";
import LearnCode from "../../../components/learn/LearnCode";
import LearnSection from "../../../components/learn/LearnSection";
import LearnTopicLayout from "../../../components/learn/LearnTopicLayout";

function MongoCrudLearnPage() {
  return (
    <LearnTopicLayout
      slug="mongo-crud"
      objectives={[
        "לבצע את 4 פעולות הבסיס: Create, Read, Update, Delete",
        "להבין את ההבדל בין insertOne ל-insertMany (וכו')",
        "להכיר את אופרטורי העדכון — $set, $inc, $push",
        "להיזהר מהטעות המסוכנת: עדכון/מחיקה בלי פילטר",
      ]}
    >
      <LearnSection title="1. C — Create: הכנסת מסמכים">
        <p>
          נעבוד על collection של ארנקים, כמו בפרויקט שלנו. את הכל אפשר להריץ
          ב-mongosh שבתחתית Compass:
        </p>
        <LearnCode
          label="insertOne — מסמך אחד, insertMany — כמה בבת אחת"
          code={`use payplus_learn

db.wallets.insertOne({
  owner: "דנה לוי",
  balance: 1200,
  currency: "ILS",
  status: "active",
  created_at: new Date()
})

db.wallets.insertMany([
  { owner: "יוסי כהן",  balance: 50,   currency: "ILS", status: "active" },
  { owner: "רונית בר",  balance: 8700, currency: "USD", status: "active" },
  { owner: "אבי מזרחי", balance: 0,    currency: "ILS", status: "frozen" }
])`}
        />
        <p>
          התשובה שחוזרת כוללת את ה-<code>insertedId</code> — ה-
          <code>ObjectId</code> שמונגו יצר לכל מסמך. שדה <code>_id</code> תמיד
          קיים ותמיד ייחודי בתוך ה-collection.
        </p>
      </LearnSection>

      <LearnSection title="2. R — Read: שליפת מסמכים">
        <LearnCode
          label="find — עם פילטר ובלעדיו"
          code={`db.wallets.find()                        // הכל
db.wallets.find({ currency: "ILS" })     // רק שקלים
db.wallets.findOne({ owner: "דנה לוי" }) // מסמך אחד (הראשון שמתאים)

// פילטר על שדה מקונן — עם נקודה
db.wallets.find({ "address.city": "תל אביב" })`}
        />
        <p>
          הפילטר הוא בעצמו אובייקט JSON: <code>{"{ currency: 'ILS' }"}</code>{" "}
          פירושו "כל מסמך שבו השדה שווה לערך". בשיעור הבא נראה אופרטורים
          מתקדמים (גדול מ-, או, בתוך רשימה...).
        </p>
        <LearnCallout variant="info" title="ב-Compass זה אותו דבר בדיוק">
          שורת ה-Filter בטאב Documents מקבלת את אותו אובייקט בדיוק:{" "}
          <code>{"{ currency: 'ILS' }"}</code> ואנטר. מה שלומדים ב-shell עובד
          אחד-לאחד ב-GUI.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="3. U — Update: עדכון מסמכים">
        <p>
          עדכון מקבל שני ארגומנטים: <strong>פילטר</strong> (את מי לעדכן)
          ו<strong>פעולת עדכון</strong> (מה לשנות). את השינוי כותבים עם
          אופרטורים שמתחילים ב-<code>$</code>:
        </p>
        <LearnCode
          label="updateOne עם $set ו-$inc"
          code={`// שינוי ערך של שדה (או יצירתו אם לא קיים)
db.wallets.updateOne(
  { owner: "דנה לוי" },
  { $set: { status: "frozen" } }
)

// הוספה/החסרה מספרית — מושלם ליתרה
db.wallets.updateOne(
  { owner: "יוסי כהן" },
  { $inc: { balance: 100 } }    // הפקדה של 100
)

// הוספת איבר למערך
db.wallets.updateOne(
  { owner: "רונית בר" },
  { $push: { tags: "vip" } }
)

// updateMany — כל מי שמתאים לפילטר
db.wallets.updateMany(
  { balance: 0 },
  { $set: { status: "inactive" } }
)`}
        />
        <LearnCallout variant="warn" title="הטעות הקלאסית — לשכוח את האופרטור">
          <code>{`updateOne({ owner: "דנה" }, { status: "frozen" })`}</code> בלי{" "}
          <code>$set</code> — שגיאה במונגו מודרני, ובגרסאות ישנות זה היה{" "}
          <strong>מחליף את כל המסמך</strong> ומוחק את שאר השדות. תמיד עובדים עם{" "}
          <code>$set</code> / <code>$inc</code> וחברים.
        </LearnCallout>
        <p>
          יש גם <code>replaceOne</code> שמחליף מסמך שלם בכוונה, ו-
          <code>upsert</code> — אופציה שאומרת "אם לא נמצא מסמך מתאים, צור אחד
          חדש":
        </p>
        <LearnCode
          label="upsert — עדכן או צור"
          code={`db.settings.updateOne(
  { user_id: 1 },
  { $set: { theme: "dark" } },
  { upsert: true }   // אין הגדרות למשתמש 1? ייווצר מסמך חדש
)`}
        />
      </LearnSection>

      <LearnSection title="4. D — Delete: מחיקת מסמכים">
        <LearnCode
          label="deleteOne / deleteMany"
          code={`db.wallets.deleteOne({ owner: "אבי מזרחי" })

db.wallets.deleteMany({ status: "inactive" })

// למחוק את כל ה-collection (מבנה + אינדקסים)
db.wallets.drop()`}
        />
        <LearnCallout variant="warn" title="הפקודה הכי מסוכנת במונגו">
          <code>db.wallets.deleteMany({"{}"})</code> — פילטר ריק ={" "}
          <strong>מוחק את כל המסמכים</strong>. אין undo. לפני כל{" "}
          <code>deleteMany</code> / <code>updateMany</code>, הרגל של סניור:
          מריצים קודם <code>find</code> עם אותו פילטר בדיוק, ובודקים שמקבלים רק
          את מה שהתכוונו.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="5. תרגיל קטן — נסו לבד">
        <p>ב-mongosh או ב-Compass, על ה-collection שיצרנו:</p>
        <ul>
          <li>הכניסו ארנק חדש על שמכם עם יתרה של 300.</li>
          <li>
            העלו את היתרה ב-250 עם <code>$inc</code>.
          </li>
          <li>
            הוסיפו שדה מערך <code>tags</code> עם <code>$push</code>.
          </li>
          <li>
            שלפו רק את הארנקים עם <code>currency: "ILS"</code>.
          </li>
          <li>מחקו את הארנק שיצרתם — עם פילטר מדויק על השם.</li>
        </ul>
        <p className="mt-2 mb-0">
          ממשיכים:{" "}
          <Link to="/learn/mongo-queries">שאילתות ואופרטורים</Link> — איך שולפים
          בדיוק את מה שצריך.
        </p>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>Create: insertOne / insertMany — _id נוצר אוטומטית</li>
          <li>Read: find(פילטר) / findOne — הפילטר הוא אובייקט JSON</li>
          <li>Update: updateOne(פילטר, שינוי) — תמיד עם $set / $inc / $push</li>
          <li>Delete: deleteOne / deleteMany — פילטר ריק מוחק הכל!</li>
          <li>upsert: true — עדכן אם קיים, צור אם לא</li>
          <li>לפני updateMany/deleteMany — תמיד find קודם לבדיקה</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default MongoCrudLearnPage;
