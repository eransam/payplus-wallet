import FileReference from "../../components/learn/FileReference";
import LearnCallout from "../../components/learn/LearnCallout";
import LearnCode from "../../components/learn/LearnCode";
import LearnSection from "../../components/learn/LearnSection";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";

function CodeSplittingLearnPage() {
  return (
    <LearnTopicLayout
      slug="code-splitting"
      objectives={[
        "להבין למה לא לטעון את כל הדפים בהתחלה",
        "להכיר lazy + Suspense",
        "לראות את המימוש ב-App.tsx",
      ]}
    >
      <LearnSection title="1. הבעיה">
        <p>
          אם כל הדפים נטענים עם <code>import</code> רגיל ב-<code>App.tsx</code> —
          גם כשנכנסים רק ל-Login כבר הורדתם את קוד Testing, Redux learn, וכו'.
        </p>
        <p>
          <strong>Code Splitting</strong> = לפצל את ה-JS לחלקים (chunks) ולטעון
          דף רק כשנכנסים אליו.
        </p>
      </LearnSection>

      <LearnSection title="2. הכלים">
        <LearnCode
          label="לפני"
          code={`import MerchantsPage from "./pages/MerchantsPage";
// נטען מיד עם ה-bundle הראשי`}
        />
        <LearnCode
          label="אחרי"
          code={`const MerchantsPage = lazy(() => import("./pages/MerchantsPage"));

<Suspense fallback={<Spinner />}>
  <Routes>...</Routes>
</Suspense>`}
        />
        <ul>
          <li>
            <code>lazy</code> — טוען את הקובץ רק כשצריך את הקומפוננטה
          </li>
          <li>
            <code>Suspense</code> — מציג fallback בזמן ההורדה
          </li>
        </ul>
      </LearnSection>

      <LearnSection title="3. מה נטען מיד אצלך">
        <p>
          Landing / Login / Register — eager (מסך ראשון). שאר הדפים כולל דפי
          למידה — lazy.
        </p>
        <LearnCallout variant="tip" title="איך להרגיש את זה">
          פתח DevTools → Network, רענן, ואז נווט ל-/merchants. תראה chunk נוסף
          יורד ברגע הכניסה לדף.
        </LearnCallout>
        <ul className="learn-files">
          <FileReference path="src/App.tsx" description="lazy לכל הדפים הכבדים + Suspense" />
        </ul>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>lazy = טעינה בעת הצורך</li>
          <li>Suspense = UI בזמן המתנה</li>
          <li>פחות JS בטעינה הראשונה = תחושת מהירות</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default CodeSplittingLearnPage;
