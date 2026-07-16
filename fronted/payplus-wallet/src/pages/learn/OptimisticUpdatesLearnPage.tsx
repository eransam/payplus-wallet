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
        "להבין מהי עדכון אופטימיסטי ולמה זה מרגיש מהיר",
        "להכיר את המחזור: onMutate → onError → onSuccess/onSettled",
        "לראות את המימוש האמיתי ב-useMerchants",
      ]}
    >
      <LearnSection title="1. מה זה Optimistic Update?">
        <p>
          בדרך כלל: לוחצים "מחק" → מחכים לשרת → רק אז מעדכנים את הרשימה.
        </p>
        <p>
          <strong>אופטימיסטי:</strong> לוחצים "מחק" → הרשימה מתעדכנת{" "}
          <em>מיד</em> (מניחים שהשרת יצליח) → במקביל נשלחת הבקשה. אם השרת
          נכשל — <strong>מחזירים את המצב הקודם</strong> (rollback).
        </p>
        <LearnCallout variant="tip" title="למה זה חשוב לסניור?">
          האפליקציה מרגישה מיידית. המשתמש לא מחכה ל-spinner על כל פעולה קטנה.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="2. ארבעת השלבים (React Query)">
        <ol>
          <li>
            <strong>onMutate</strong> — לפני שהשרת ענה: שומרים snapshot של
            ה-cache, מעדכנים את ה-UI מיד
          </li>
          <li>
            <strong>mutationFn</strong> — הקריאה האמיתית לשרת (POST/PATCH/DELETE)
          </li>
          <li>
            <strong>onError</strong> — אם נכשל: מחזירים את ה-snapshot
          </li>
          <li>
            <strong>onSuccess / onSettled</strong> — מסנכרנים עם התשובה האמיתית /
            מרעננים את ה-cache
          </li>
        </ol>
        <LearnCode
          label="שלד כללי"
          code={`useMutation({
  mutationFn: (id) => deleteMerchant(id),

  onMutate: async (id) => {
    await queryClient.cancelQueries({ queryKey: ["merchants"] });
    const previous = queryClient.getQueryData(["merchants"]);
    // עדכון מיידי של ה-UI
    queryClient.setQueryData(["merchants"], (list) =>
      list.filter((m) => m.id !== id)
    );
    return { previous }; // לשמירה ל-rollback
  },

  onError: (_err, _id, context) => {
    // השרת נכשל → החזר כמו שהיה
    queryClient.setQueryData(["merchants"], context.previous);
  },

  onSettled: () => {
    // בסוף — סנכרון עם האמת מהשרת
    queryClient.invalidateQueries({ queryKey: ["merchants"] });
  },
});`}
        />
      </LearnSection>

      <LearnSection title="3. למה cancelQueries?">
        <p>
          אם יש fetch ברקע שעומד להחזיר רשימה ישנה — הוא עלול לדרוס את העדכון
          האופטימיסטי. לכן מבטלים queries פתוחים על אותו key לפני השינוי.
        </p>
      </LearnSection>

      <LearnSection title="4. מה מימשנו אצלך">
        <ul>
          <li>
            <strong>מחיקת סוחר</strong> — נעלם מהטבלה מיד
          </li>
          <li>
            <strong>יצירת סוחר</strong> — מופיע מיד עם id זמני שלילי, ואז מוחלף
            בתשובת השרת האמיתית
          </li>
          <li>
            <strong>עדכון סוחר</strong> — השם/סטטוס משתנים מיד על המסך
          </li>
        </ul>
        <LearnCallout variant="warn" title="מתי לא חובה?">
          פעולות כבדות/כספיות (charge) לפעמים עדיף לחכות לשרת ורק אז לעדכן —
          כדי לא להציג יתרה שגויה אפילו לשנייה.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="5. תרגול">
        <p>
          פתח סוחרים: מחק סוחר (או צור אחד) — שימו לב שהרשימה משתנה{" "}
          <strong>לפני</strong> שהבקשה מסתיימת ב-Network.
        </p>
        <ul className="learn-files">
          <FileReference
            path="src/hooks/useMerchants.ts"
            description="useCreateMerchant / useUpdateMerchant / useDeleteMerchant"
          />
          <FileReference
            path="src/hooks/queryKeys.ts"
            description="queryKeys.merchants"
          />
        </ul>
        <DemoLink to="/merchants" label="נסה יצירה / עריכה / מחיקה של סוחר" />
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>Optimistic = מעדכנים UI לפני תשובת השרת</li>
          <li>onMutate שומר previous ומעדכן cache</li>
          <li>onError עושה rollback</li>
          <li>onSettled מסנכרן עם השרת</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default OptimisticUpdatesLearnPage;
