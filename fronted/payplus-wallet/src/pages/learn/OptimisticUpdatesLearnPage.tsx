import DemoLink from "../../components/learn/DemoLink";
import FileReference from "../../components/learn/FileReference";
import LearnCallout from "../../components/learn/LearnCallout";
import LearnCode from "../../components/learn/LearnCode";
import LearnSection from "../../components/learn/LearnSection";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";

function OptimisticUpdatesLearnPage() {
  return (
    <LearnTopicLayout
      slug="optimistic-updates"
      objectives={[
        "להבין מה זה 'אופטימיסטי' בפשטות — מעדכנים מסך לפני השרת",
        "לדעת מה קורה אם השרת נכשל (rollback)",
        "לראות את זה בדף הסוחרים שלנו",
      ]}
    >
      <LearnSection title="1. מה רוצים ממך להבין?">
        <p>
          כשלוחצים &quot;מחק סוחר&quot; — יש שתי דרכים:
        </p>
        <LearnCode
          label="רגיל (פסימי)"
          code={`1. לוחצים מחק
2. מחכים לשרת... (spinner)
3. השרת אומר OK
4. רק אז הסוחר נעלם מהרשימה`}
        />
        <LearnCode
          label="אופטימיסטי"
          code={`1. לוחצים מחק
2. הסוחר נעלם מהרשימה מיד   ← מניחים שהשרת יצליח
3. ברקע נשלחת בקשה לשרת
4. אם השרת נכשל → מחזירים את הסוחר לרשימה`}
        />
        <p>
          <strong>Optimistic</strong> = אופטימי = &quot;נניח שהכל יצליח, נראה
          למשתמש תוצאה מיד&quot;.
        </p>
        <LearnCallout variant="info" title="אנלוגיה">
          כמו למחוק מייל ב-Gmail: הוא נעלם מיד. אם המחיקה בשרת נכשלה — הוא
          חוזר לתיבה. לא מחכים שניה עם מסך טעינה על כל מחיקה.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="2. למה עושים את זה?">
        <p>
          שהאפליקציה תרגיש <strong>מהירה</strong>. המשתמש לא מחכה לשרת על כל
          לחיצה קטנה (מחיקה, שינוי שם).
        </p>
      </LearnSection>

      <LearnSection title="3. מה קורה בקוד (בלי מושגים מסובכים)">
        <p>כשמוחקים סוחר עם Optimistic:</p>
        <ol>
          <li>
            <strong>לפני הבקשה</strong> — שומרים עותק של הרשימה הישנה
            (&quot;למקרה שנצטרך להחזיר&quot;)
          </li>
          <li>
            <strong>מיד</strong> — מעדכנים את הרשימה במסך (בלי הסוחר)
          </li>
          <li>
            <strong>שולחים</strong> בקשת מחיקה לשרת
          </li>
          <li>
            <strong>אם נכשל</strong> — מחזירים את הרשימה הישנה (rollback)
          </li>
          <li>
            <strong>אם הצליח</strong> — משאירים / מסנכרנים עם השרת
          </li>
        </ol>
      </LearnSection>

      <LearnSection title="4. איך זה נראה ב-React Query">
        <p>
          אותם שלבים, עם השמות של הספרייה:
        </p>
        <LearnCode
          label="שמות → מה הם עושים"
          code={`onMutate   = לפני השרת: שמור רשימה ישנה + עדכן מסך מיד
mutationFn = שלח לשרת (המחיקה האמיתית)
onError    = השרת נכשל → החזר את הרשימה הישנה
onSettled  = בסוף → סנכרן עם השרת (רענון)`}
        />
        <LearnCode
          label="מחיקה — שלד"
          code={`useMutation({
  mutationFn: (id) => deleteMerchant(id),

  onMutate: async (id) => {
    const previous = /* הרשימה לפני המחיקה */;
    // עדכון מסך מיד — בלי הסוחר
    setMerchantsList(list => list.filter(m => m.id !== id));
    return { previous };
  },

  onError: (_err, _id, context) => {
    // כשלון → החזר כמו שהיה
    setMerchantsList(context.previous);
  },
});`}
        />
      </LearnSection>

      <LearnSection title="5. אצלנו בפרויקט">
        <p>
          בדף <strong>סוחרים</strong>:
        </p>
        <ul>
          <li>
            <strong>מחק</strong> — נעלם מיד
          </li>
          <li>
            <strong>צור</strong> — מופיע מיד (עם id זמני), אחר כך מתחלף
            בתשובה האמיתית מהשרת
          </li>
          <li>
            <strong>ערוך</strong> — השם/סטטוס משתנים מיד
          </li>
        </ul>
        <p>
          הקוד: <code>useMerchants.ts</code> —{" "}
          <code>useCreateMerchant</code> / <code>useDeleteMerchant</code> /
          וכו'.
        </p>
        <LearnCallout variant="warn" title="מתי לא חובה">
          פעולות כסף (charge) — לפעמים עדיף לחכות לשרת, כדי לא להציג יתרה
          שגויה אפילו לרגע.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="6. תראה בעצמך">
        <p>
          פתח סוחרים → מחק או צור. הרשימה משתנה <strong>מיד</strong>, לא רק
          אחרי שה-Network נגמר.
        </p>
        <DemoLink to="/merchants" label="דף סוחרים — נסה מחיקה / יצירה" />
        <ul className="learn-files mt-3">
          <FileReference
            path="fronted/payplus-wallet/src/hooks/useMerchants.ts"
            description="המימוש האופטימיסטי"
          />
        </ul>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>
            Optimistic = מעדכנים את המסך <em>לפני</em> תשובת השרת
          </li>
          <li>אם השרת נכשל → מחזירים אחורה (rollback)</li>
          <li>מרגיש מהיר יותר למשתמש</li>
          <li>אצלנו: יצירה / עריכה / מחיקה של סוחרים</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default OptimisticUpdatesLearnPage;
