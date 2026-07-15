import DemoLink from "../../components/learn/DemoLink";
import FileReference from "../../components/learn/FileReference";
import LearnCallout from "../../components/learn/LearnCallout";
import LearnCode from "../../components/learn/LearnCode";
import LearnSection from "../../components/learn/LearnSection";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";

function ValidationLearnPage() {
  return (
    <LearnTopicLayout
      slug="validation"
      objectives={[
        "להבין מה בודקים לפני שליחה לשרת",
        "לדעת להציג שגיאות ברורות בעברית",
        "להכיר AbortController כחלק מ-UX טוב",
      ]}
    >
      <LearnSection title="1. Validation — למה?">
        <p>
          לפני ששולחים בקשה לשרת (ולפעמים גם אחרי), בודקים שהקלט הגיוני: שדה לא
          ריק, סכום חיובי, אימייל בפורמט נכון וכו'.
        </p>
        <p>
          בלי זה המשתמש מקבל שגיאות מבלבלות מהשרת — או בכלל לא מבין מה לא בסדר.
        </p>
      </LearnSection>

      <LearnSection title="2. דוגמה פשוטה">
        <LearnCode
          label="בדיקה ידנית"
          code={`const trimmed = name.trim();
if (!trimmed) {
  setError("שם הסוחר הוא שדה חובה");
  return;
}`}
        />
        <p>
          בהמשך (שיעור react-hook-form) נעביר את החוקים ל-<strong>zod</strong> —
          אותה מטרה, יותר מסודר.
        </p>
      </LearnSection>

      <LearnSection title="3. UX: שגיאות מהשרת בעברית">
        <p>
          השרת מחזיר קוד שגיאה באנגלית. בפרונט מתרגמים להודעה ברורה למשתמש דרך{" "}
          <code>translateApiError</code>.
        </p>
        <LearnCode
          label="רעיון"
          code={`// השרת: { error: { code: "merchant_exists" } }
// הפרונט: "כבר קיים סוחר עם שם זה"`}
        />
      </LearnSection>

      <LearnSection title="4. AbortController — ביטול בקשה">
        <p>
          אם המשתמש עוזב את הדף באמצע טעינה — מבטלים את ה-<code>fetch</code>{" "}
          כדי לא לעדכן state אחרי שהקומפוננטה כבר לא קיימת (ולחסוך עבודה).
        </p>
        <LearnCallout variant="info" title="אצלך היום">
          ב-React Query זה מגיע כ-<code>signal</code> ל-<code>queryFn</code> →{" "}
          <code>getMerchants(signal)</code>. ראה שיעור React Query ואת{" "}
          <code>api.ts</code>.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="5. קבצים">
        <ul className="learn-files">
          <FileReference path="src/utils/apiErrors.ts" description="תרגום שגיאות לעברית" />
          <FileReference path="src/schemas/merchantSchema.ts" description="חוקי zod לטופס סוחר" />
          <FileReference path="src/services/api.ts" description="signal + ApiError" />
        </ul>
        <DemoLink to="/merchants" label="נסה ליצור סוחר בלי שם — תראי שגיאה ברורה" />
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>Validation = לבדוק קלט לפני/בזמן שליחה</li>
          <li>הודעות בעברית למשתמש</li>
          <li>Abort/signal = ביטול בקשה כשעוזבים</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default ValidationLearnPage;
