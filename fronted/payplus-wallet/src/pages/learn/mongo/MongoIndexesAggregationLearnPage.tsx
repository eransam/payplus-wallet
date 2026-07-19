import { Link } from "react-router-dom";
import LearnCallout from "../../../components/learn/LearnCallout";
import LearnCode from "../../../components/learn/LearnCode";
import LearnSection from "../../../components/learn/LearnSection";
import LearnTopicLayout from "../../../components/learn/LearnTopicLayout";

function MongoIndexesAggregationLearnPage() {
  return (
    <LearnTopicLayout
      slug="mongo-indexes-aggregation"
      objectives={[
        "להבין מה אינדקס עושה ולמה בלעדיו כל שאילתה סורקת הכל",
        "ליצור אינדקסים — כולל unique ו-compound",
        "לבדוק ביצועים עם explain (ו-Explain Plan ב-Compass)",
        "לבנות aggregation pipeline — ה-GROUP BY של מונגו",
      ]}
    >
      <LearnSection title="1. למה צריך אינדקס?">
        <p>
          בלי אינדקס, כל <code>find</code> עושה <strong>COLLSCAN</strong> —
          סריקה של כל המסמכים ב-collection אחד-אחד. על 100 מסמכים לא מרגישים;
          על מיליון — כל שאילתה איטית ומכבידה. אינדקס הוא בדיוק כמו ב-Postgres:
          עץ ממוין שמאפשר לקפוץ ישר לתוצאה.
        </p>
        <LearnCode
          label="יצירת אינדקסים"
          code={`// אינדקס פשוט על שדה אחד
db.transactions.createIndex({ wallet_id: 1 })

// אינדקס ייחודי — כמו UNIQUE constraint (אימייל של משתמש)
db.users.createIndex({ email: 1 }, { unique: true })

// אינדקס מורכב (compound) — לשאילתה שמסננת וממיינת
db.transactions.createIndex({ wallet_id: 1, at: -1 })
// מושלם עבור: find({ wallet_id: X }).sort({ at: -1 })

// מה קיים?
db.transactions.getIndexes()`}
        />
        <LearnCallout variant="tip" title="על מה שמים אינדקס?">
          על שדות שמופיעים <strong>בפילטרים ובמיונים</strong> של השאילתות
          התכופות. אצלנו: <code>wallet_id</code> בעסקאות (כל מסך ארנק שולף לפי
          זה), <code>email</code> במשתמשים (login), <code>status</code> אם
          מסננים לפיו הרבה. שדה <code>_id</code> מקבל אינדקס אוטומטית.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="2. explain — לראות אם האינדקס באמת עובד">
        <LearnCode
          label="בדיקת ביצועים"
          code={`db.transactions.find({ wallet_id: ObjectId("AAA") })
  .explain("executionStats")

// בפלט מחפשים:
// "stage": "IXSCAN"  ← מצוין, השתמש באינדקס
// "stage": "COLLSCAN" ← סרק הכל, חסר אינדקס
// totalDocsExamined מול nReturned — כמה בדק כדי להחזיר כמה`}
        />
        <p>
          ב-<strong>Compass</strong> זה עוד יותר נוח: בטאב{" "}
          <strong>Explain Plan</strong> מדביקים את הפילטר ומקבלים תרשים ויזואלי
          של השלבים, כולל אזהרה אדומה כשיש COLLSCAN. בטאב{" "}
          <strong>Indexes</strong> יוצרים ומוחקים אינדקסים בכפתור.
        </p>
        <LearnCallout variant="warn" title="אינדקסים לא בחינם">
          כל אינדקס מאט מעט כל כתיבה (צריך לעדכן גם אותו) ותופס זיכרון. לא
          שמים אינדקס "ליתר ביטחון" על כל שדה — רק על מה שהשאילתות באמת
          צריכות.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="3. Aggregation Pipeline — ה-GROUP BY של מונגו">
        <p>
          כששאלה היא לא "תן לי מסמכים" אלא "תן לי <strong>סיכום</strong>" —
          סכום הוצאות לפי חודש, ממוצע יתרות לפי מטבע — נכנס ה-
          <strong>aggregation pipeline</strong>: צינור של שלבים, שכל שלב מקבל
          מסמכים ומעביר הלאה תוצאה מעובדת.
        </p>
        <LearnCode
          label="סך עסקאות לפי סוחר — צעד אחר צעד"
          code={`db.transactions.aggregate([
  // שלב 1: סינון (כמו WHERE)
  { $match: { status: "completed" } },

  // שלב 2: קיבוץ (כמו GROUP BY)
  { $group: {
      _id: "$merchant.name",          // לפי מה מקבצים
      total: { $sum: "$amount" },     // סכום
      count: { $sum: 1 },             // ספירה
      avg:   { $avg: "$amount" }      // ממוצע
  }},

  // שלב 3: מיון התוצאה
  { $sort: { total: -1 } },

  // שלב 4: רק 5 הראשונים
  { $limit: 5 }
])

-- SQL להשוואה:
-- SELECT merchant_name, SUM(amount), COUNT(*), AVG(amount)
-- FROM transactions WHERE status = 'completed'
-- GROUP BY merchant_name ORDER BY 2 DESC LIMIT 5;`}
        />
        <p>השלבים הנפוצים שכדאי להכיר:</p>
        <ul>
          <li>
            <code>$match</code> — סינון (WHERE). כדאי שיהיה ראשון — כך שאר
            השלבים עובדים על פחות מסמכים, והוא גם מנצל אינדקסים.
          </li>
          <li>
            <code>$group</code> — קיבוץ עם <code>$sum</code>, <code>$avg</code>
            , <code>$min</code>, <code>$max</code>.
          </li>
          <li>
            <code>$sort</code>, <code>$limit</code>, <code>$skip</code> — כמו
            ב-find.
          </li>
          <li>
            <code>$project</code> — עיצוב המסמך שיוצא (בחירת שדות, חישובים).
          </li>
          <li>
            <code>$lookup</code> — ה"JOIN" שפגשנו בשיעור הקודם.
          </li>
        </ul>
      </LearnSection>

      <LearnSection title="4. דוגמה מסכמת — הוצאות לפי חודש">
        <LearnCode
          label="pipeline אמיתי לדוח חודשי"
          code={`db.transactions.aggregate([
  { $match: {
      wallet_id: ObjectId("AAA"),
      amount: { $lt: 0 }                     // רק הוצאות
  }},
  { $group: {
      _id: {
        year:  { $year: "$at" },
        month: { $month: "$at" }
      },
      spent: { $sum: "$amount" },
      transactions: { $sum: 1 }
  }},
  { $sort: { "_id.year": -1, "_id.month": -1 } }
])

// תוצאה:
// { _id: { year: 2026, month: 7 }, spent: -3450, transactions: 42 }
// { _id: { year: 2026, month: 6 }, spent: -2890, transactions: 38 }`}
        />
        <LearnCallout variant="tip" title="גם את זה יש ב-Compass">
          טאב <strong>Aggregations</strong> ב-Compass מאפשר לבנות pipeline
          ויזואלית, שלב-שלב, עם תצוגה מקדימה של התוצאה אחרי כל שלב. דרך מצוינת
          ללמוד — ובסוף יש כפתור Export to Language שמייצר את הקוד ל-Node.
        </LearnCallout>
        <p className="mt-2 mb-0">
          סיימתם את מסלול MongoDB! חזרה ל
          <Link to="/learn">מרכז הלמידה</Link> — או התחילו לתרגל: הרימו מונגו
          עם Docker, פתחו Compass, ובנו collection משלכם.
        </p>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>בלי אינדקס = COLLSCAN (סריקה מלאה); עם = IXSCAN</li>
          <li>createIndex על שדות של פילטרים ומיונים תכופים</li>
          <li>unique: true = אכיפת ייחודיות (אימייל)</li>
          <li>compound index תומך בסינון + מיון יחד</li>
          <li>explain("executionStats") / Explain Plan ב-Compass</li>
          <li>aggregate = צינור שלבים: $match → $group → $sort</li>
          <li>$match ראשון — פחות מסמכים לשאר השלבים + אינדקסים</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default MongoIndexesAggregationLearnPage;
