import { Link } from "react-router-dom";
import LearnCallout from "../../../components/learn/LearnCallout";
import LearnCode from "../../../components/learn/LearnCode";
import LearnSection from "../../../components/learn/LearnSection";
import LearnTopicLayout from "../../../components/learn/LearnTopicLayout";

function MongoQueriesLearnPage() {
  return (
    <LearnTopicLayout
      slug="mongo-queries"
      objectives={[
        "להשוות ערכים: $gt, $gte, $lt, $lte, $ne",
        "לבדוק שייכות: $in, $nin, $exists",
        "לשלב תנאים: $and, $or, $not",
        "לעצב תוצאה: sort, limit, skip, projection",
      ]}
    >
      <LearnSection title="1. אופרטורי השוואה">
        <p>
          עד עכשיו סיננו לפי שוויון מדויק. אופרטורים (מילים שמתחילות ב-
          <code>$</code>) פותחים את כל השאר:
        </p>
        <LearnCode
          label="גדול / קטן / שונה — המקבילה ל-WHERE ב-SQL"
          code={`// יתרה גדולה מ-1000
db.wallets.find({ balance: { $gt: 1000 } })

// בין 100 ל-1000 (כולל)
db.wallets.find({ balance: { $gte: 100, $lte: 1000 } })

// כל מי שלא בשקלים
db.wallets.find({ currency: { $ne: "ILS" } })

// SQL להשוואה:
// SELECT * FROM wallets WHERE balance > 1000;`}
        />
        <ul>
          <li>
            <code>$gt</code> / <code>$gte</code> — גדול מ- / גדול-שווה
          </li>
          <li>
            <code>$lt</code> / <code>$lte</code> — קטן מ- / קטן-שווה
          </li>
          <li>
            <code>$ne</code> — שונה מ- (not equal)
          </li>
        </ul>
      </LearnSection>

      <LearnSection title="2. שייכות וקיום: $in, $nin, $exists">
        <LearnCode
          label="בתוך רשימה / לא ברשימה / האם השדה קיים"
          code={`// סטטוס אחד מתוך רשימה — כמו IN ב-SQL
db.wallets.find({ status: { $in: ["active", "pending"] } })

// ההפך — כל מי שלא ברשימה
db.wallets.find({ currency: { $nin: ["ILS", "USD"] } })

// מסמכים שבכלל יש להם שדה tags
db.wallets.find({ tags: { $exists: true } })`}
        />
        <LearnCallout variant="info" title="$exists — ייחודי לעולם ללא סכמה">
          ב-Postgres לכל שורה יש את כל העמודות. במונגו מסמכים שונים יכולים
          להכיל שדות שונים — ולכן צריך לפעמים לשאול "למי בכלל יש את השדה
          הזה?". זה בדיוק <code>$exists</code>.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="3. שילוב תנאים: $and, $or">
        <LearnCode
          label="תנאים לוגיים"
          code={`// AND — פשוט כותבים כמה תנאים באותו אובייקט
db.wallets.find({ currency: "ILS", status: "active" })

// OR — צריך אופרטור מפורש
db.wallets.find({
  $or: [
    { balance: { $gt: 5000 } },
    { tags: "vip" }
  ]
})

// שילוב: שקלים וגם (יתרה גבוהה או vip)
db.wallets.find({
  currency: "ILS",
  $or: [{ balance: { $gt: 5000 } }, { tags: "vip" }]
})`}
        />
        <p>
          שימו לב לשורה האחרונה בדוגמה הראשונה: כששמים כמה שדות באותו אובייקט
          פילטר — זה אוטומטית AND. את <code>$or</code> חייבים לכתוב במפורש,
          עם מערך של תנאים.
        </p>
      </LearnSection>

      <LearnSection title="4. עיצוב התוצאה: sort, limit, skip, projection">
        <LearnCode
          label="מיון, הגבלה, דילוג — ו-projection לבחירת שדות"
          code={`// 5 הארנקים העשירים ביותר, מהגדול לקטן
db.wallets.find({ status: "active" })
  .sort({ balance: -1 })   // -1 = יורד, 1 = עולה
  .limit(5)

// עמוד 2 של תוצאות (pagination): מדלגים על 10 הראשונים
db.wallets.find().sort({ created_at: -1 }).skip(10).limit(10)

// projection — רק השדות שצריך (הארגומנט השני של find)
db.wallets.find(
  { currency: "ILS" },
  { owner: 1, balance: 1, _id: 0 }   // 1 = כלול, 0 = אל תכלול
)

// SQL להשוואה:
// SELECT owner, balance FROM wallets
// WHERE currency = 'ILS' ORDER BY balance DESC LIMIT 5;`}
        />
        <LearnCallout variant="tip" title="למה projection חשוב">
          אם המסמך גדול (למשל מכיל היסטוריה שלמה) ואתם צריכים רק שם ויתרה —
          projection חוסך רשת וזיכרון. אותו רעיון כמו לא לכתוב{" "}
          <code>SELECT *</code> בפרודקשן.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="5. בונוס: ספירה וחיפוש בתוך מערך">
        <LearnCode
          label="countDocuments + התנהגות מיוחדת של מערכים"
          code={`// כמה ארנקים פעילים יש?
db.wallets.countDocuments({ status: "active" })

// חיפוש בתוך מערך — עובד "בפנים" אוטומטית
db.wallets.find({ tags: "vip" })
// מוצא כל מסמך שהמערך tags שלו מכיל "vip"

// ומי שמכיל את כל הערכים האלה
db.wallets.find({ tags: { $all: ["vip", "verified"] } })`}
        />
        <p className="mt-2 mb-0">
          עכשיו כשאנחנו שולטים בשאילתות — הגיע הזמן לחבר את מונגו לקוד:{" "}
          <Link to="/learn/mongo-node">MongoDB עם Node.js</Link>.
        </p>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>השוואה: $gt / $gte / $lt / $lte / $ne</li>
          <li>שייכות: $in / $nin; קיום שדה: $exists</li>
          <li>כמה שדות באותו פילטר = AND; ל-OR צריך $or עם מערך</li>
          <li>sort({"{שדה: -1}"}) יורד, limit + skip ל-pagination</li>
          <li>projection = הארגומנט השני של find — רק שדות שצריך</li>
          <li>פילטר על מערך בודק אוטומטית אם הערך נמצא בפנים</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default MongoQueriesLearnPage;
