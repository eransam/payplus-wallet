import DemoLink from "../../components/learn/DemoLink";
import FileReference from "../../components/learn/FileReference";
import LearnCallout from "../../components/learn/LearnCallout";
import LearnCode from "../../components/learn/LearnCode";
import LearnSection from "../../components/learn/LearnSection";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";

function CustomHooksLearnPage() {
  return (
    <LearnTopicLayout
      slug="custom-hooks"
      objectives={[
        "להבין מהו Custom Hook ולמה הוא קיים",
        "לדעת כלל השם: חייב להתחיל ב-use",
        "לראות איך useMerchants מפריד לוגיקה מ-UI",
      ]}
    >
      <LearnSection title="1. מה זה Custom Hook?">
        <p>
          פונקציה שמתחילה ב-<code>use...</code> ומאגדת לוגיקת React (state,
          effects, קריאות ל-API) לשימוש חוזר.
        </p>
        <p>
          במקום שכל קומפוננטה תדע איך לטעון סוחרים — כותבים{" "}
          <code>useMerchants()</code> פעם אחת, וקוראים לה ממקומות רבים.
        </p>
      </LearnSection>

      <LearnSection title="2. למה זה טוב?">
        <ul>
          <li>
            <strong>הפרדה:</strong> הקומפוננטה מציגה UI; ה-hook מנהל נתונים
          </li>
          <li>
            <strong>שימוש חוזר:</strong> Dashboard ו-MerchantsList יכולים לקרוא
            לאותו hook
          </li>
          <li>
            <strong>בדיקות:</strong> קל יותר לבדוק לוגיקה בנפרד מהמסך
          </li>
        </ul>
        <LearnCode
          label="שימוש בקומפוננטה"
          code={`function MerchantsList() {
  const { merchants, loading, error } = useMerchants();

  if (loading) return <Spinner />;
  if (error) return <Alert>{error}</Alert>;
  return <Table>...</Table>;
}`}
        />
        <LearnCallout variant="tip" title="כלל">
          אם יש <code>useState</code> / <code>useEffect</code> /{" "}
          <code>useQuery</code> בתוך הפונקציה — השם חייב להתחיל ב-<code>use</code>.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="3. בפרויקט">
        <ul className="learn-files">
          <FileReference
            path="src/hooks/useMerchants.ts"
            description="query + create/update/delete"
          />
          <FileReference
            path="src/hooks/useWallets.ts"
            description="אותו דפוס לארנקים"
          />
          <FileReference
            path="src/hooks/useTransactions.ts"
            description="עסקאות, charge, refund"
          />
          <FileReference
            path="src/contexts/AuthContext.tsx"
            description="useAuth — hook שקורא מ-Context"
          />
        </ul>
        <DemoLink to="/merchants" label="הקומפוננטה רק מציגה — הלוגיקה ב-hook" />
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>Custom Hook = לוגיקת React משותפת בפונקציית useX</li>
          <li>קומפוננטה = UI; hook = נתונים / התנהגות</li>
          <li>חובה להתחיל ב-use כדי שחוקי ה-hooks יחולו</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default CustomHooksLearnPage;
