import FileReference from "../../components/learn/FileReference";
import LearnCallout from "../../components/learn/LearnCallout";
import LearnCode from "../../components/learn/LearnCode";
import LearnSection from "../../components/learn/LearnSection";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";

function TestingLearnPage() {
  return (
    <LearnTopicLayout
      slug="testing"
      objectives={[
        "להבין למה כותבים בדיקות אוטומטיות",
        "להכיר Vitest + React Testing Library",
        "לדעת איך מריצים בדיקות בפרויקט",
      ]}
    >
      <LearnSection title="1. למה Testing?">
        <p>
          בדיקה אוטומטית = קוד שמוודא שהפיצ&apos;ר עובד, בלי ללחוץ ידנית בכל פעם.
          כשמשנים משהו — אם נשבר משהו אחר, הבדיקה נופלת ומצביעה על הבעיה.
        </p>
      </LearnSection>

      <LearnSection title="2. הכלים אצלך">
        <ul>
          <li>
            <strong>Vitest</strong> — מריץ את הבדיקות (כמו Jest לאקוסיסטם Vite)
          </li>
          <li>
            <strong>React Testing Library</strong> — מרנדר קומפוננטה ובודק כמו
            משתמש: רואה טקסט, לוחץ כפתור
          </li>
        </ul>
        <LearnCode
          label="רעיון של בדיקה"
          code={`renderWithProviders(<CreateMerchantForm />);
// המשתמש רואה כפתור...
await user.click(screen.getByRole("button", { name: /צור/i }));
// מצפים לראות שגיאה אם השדה ריק`}
        />
        <LearnCallout variant="tip" title="הרצה">
          בתיקיית הפרונט: <code>npm test</code> או <code>npm run test:run</code>
        </LearnCallout>
      </LearnSection>

      <LearnSection title="3. Providers בבדיקות">
        <p>
          קומפוננטות שמשתמשות ב-React Query / Redux צריכות את אותם Providers גם
          בטסט. לכן יש <code>renderWithProviders</code>.
        </p>
        <ul className="learn-files">
          <FileReference path="src/test/test-utils.tsx" description="Wrapper עם Query + Redux" />
          <FileReference path="src/components/CreateMerchantForm.test.tsx" description="דוגמת בדיקה" />
        </ul>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>בדיקות = ביטחון לרגרסיות</li>
          <li>RTL בודק התנהגות משתמש, לא פרטי מימוש</li>
          <li>תמיד לעטוף ב-Providers כמו באפליקציה</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default TestingLearnPage;
