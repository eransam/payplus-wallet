import ErrorBoundary from "../../components/ErrorBoundary";
import CrashDemo from "../../components/learn/CrashDemo";
import FileReference from "../../components/learn/FileReference";
import LearnCallout from "../../components/learn/LearnCallout";
import LearnCode from "../../components/learn/LearnCode";
import LearnSection from "../../components/learn/LearnSection";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";

function ErrorBoundaryLearnPage() {
  return (
    <LearnTopicLayout
      slug="error-boundary"
      objectives={[
        "להבין איזו שגיאה Error Boundary תופס",
        "לדעת למה זה לא מחליף try/catch ל-API",
        "לראות דמו קריסה עם fallback",
      ]}
    >
      <LearnSection title="1. הבעיה ב-React">
        <p>
          אם יש באג בזמן <strong>render</strong> (למשל קריאה ל-
          <code>null.name</code>), React עלול להפיל את כל עץ הקומפוננטות — מסך
          לבן.
        </p>
        <p>
          <strong>Error Boundary</strong> = קומפוננטה שתופסת את הקריסה ומציגה
          הודעה ידידותית במקום שהכל יישבר.
        </p>
      </LearnSection>

      <LearnSection title="2. מה הוא כן / לא תופס">
        <ul>
          <li>
            <strong>כן:</strong> שגיאות ב-render של ילדים
          </li>
          <li>
            <strong>לא:</strong> שגיאות ב-event handlers (שם משתמשים ב-try/catch)
          </li>
          <li>
            <strong>לא:</strong> כשלון API — זה מצב error רגיל ב-UI / React Query
          </li>
        </ul>
        <LearnCallout variant="warn" title="Angular?">
          ב-Angular יש מנגנון אחר (ErrorHandler). הרעיון דומה — לא לתת לשגיאה לא
          מטופלת להרוס את כל החוויה — אבל ה-API שונה.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="3. איך זה נראה">
        <LearnCode
          label="שימוש"
          code={`<ErrorBoundary>
  <SomePage />
</ErrorBoundary>`}
        />
        <p>
          אצלך ב-<code>App.tsx</code> עטפנו את ה-Routes — התפריט יכול להישאר, רק
          אזור התוכן מוגן.
        </p>
      </LearnSection>

      <LearnSection title="4. דמו חי">
        <p className="mb-3">לחץ להפעיל קריסה מכוונת — ותראה את ה-fallback.</p>
        <div className="learn-demo-box">
          <ErrorBoundary>
            <CrashDemo />
          </ErrorBoundary>
        </div>
      </LearnSection>

      <LearnSection title="5. קבצים">
        <ul className="learn-files">
          <FileReference path="src/components/ErrorBoundary.tsx" description="מימוש ה-Boundary" />
          <FileReference path="src/App.tsx" description="עוטף את Routes" />
          <FileReference path="src/components/learn/CrashDemo.tsx" description="דמו קריסה" />
        </ul>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>Error Boundary = רשת בטיחות לקריסות render</li>
          <li>לא מחליף טיפול בשגיאות API</li>
          <li>מציג fallback במקום מסך לבן</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default ErrorBoundaryLearnPage;
