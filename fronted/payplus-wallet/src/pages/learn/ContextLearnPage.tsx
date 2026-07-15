import { MerchantsProvider } from "../../contexts/MerchantsContext";
import { WalletsProvider } from "../../contexts/WalletsContext";
import FileReference from "../../components/learn/FileReference";
import LearnCallout from "../../components/learn/LearnCallout";
import LearnCode from "../../components/learn/LearnCode";
import LearnSection from "../../components/learn/LearnSection";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";
import MerchantsListContext from "../../components/learn/MerchantsListContext";
import WalletsListContext from "../../components/learn/WalletsListContext";

function ContextLearnPage() {
  return (
    <WalletsProvider>
      <MerchantsProvider>
        <LearnTopicLayout
          slug="context"
          objectives={[
            "להבין מהי בעיית prop drilling",
            "לדעת את התבנית: createContext + Provider + useContext",
            "להבדיל בין Context ללמידה לבין React Query באפליקציה",
          ]}
        >
          <LearnSection title="1. מה הבעיה שContext פותר?">
            <p>
              בלי Context, אם הרבה קומפוננטות רחוקות צריכות את אותו מידע —
              מעבירים props דרך כל שכבה גם אם השכבות האמצעיות לא משתמשות בו.
              זה נקרא <strong>prop drilling</strong>.
            </p>
            <p>
              <strong>Context</strong> = מחסן משותף לעץ קומפוננטות. מי שבתוך
              ה-Provider יכול לקרוא את הערך ישירות.
            </p>
          </LearnSection>

          <LearnSection title="2. התבנית בשלושה חלקים">
            <LearnCode
              label="1) יצירה + Provider"
              code={`const MerchantsContext = createContext(null);

export function MerchantsProvider({ children }) {
  const value = useMerchantsState(); // state + load
  return (
    <MerchantsContext.Provider value={value}>
      {children}
    </MerchantsContext.Provider>
  );
}`}
            />
            <LearnCode
              label="2) קריאה"
              code={`export function useMerchantsContext() {
  const ctx = useContext(MerchantsContext);
  if (!ctx) throw new Error("חייבים להיות בתוך Provider");
  return ctx;
}`}
            />
            <LearnCode
              label="3) שימוש בקומפוננטה"
              code={`const { merchants, loading, addMerchant } = useMerchantsContext();`}
            />
          </LearnSection>

          <LearnSection title="3. Context אמיתי באפליקציה: Auth">
            <p>
              ב-<code>main.tsx</code> יש <code>AuthProvider</code> — משתמש מחובר,
              login/logout. זה מתאים ל-Context כי זה state של האפליקציה, לא רשימת
              שרת עם cache.
            </p>
            <LearnCallout variant="info" title="מול React Query">
              הדמו למטה משתמש ב-Context + useEffect. האפליקציה הראשית (תפריט)
              טוענת סוחרים/ארנקים עם <strong>React Query</strong>. שתי הגישות
              קיימות כדי שתוכל להשוות.
            </LearnCallout>
          </LearnSection>

          <LearnSection title="4. דמו חי">
            <p className="mb-3">
              צור סוחר / ארנק כאן — הרשימה מתעדכנת כי כולם קוראים מאותו Context.
            </p>
            <div className="learn-demo-box d-flex flex-column gap-4">
              <WalletsListContext />
              <MerchantsListContext />
            </div>
          </LearnSection>

          <LearnSection title="5. קבצים">
            <ul className="learn-files">
              <FileReference path="src/contexts/AuthContext.tsx" description="Context אמיתי באפליקציה" />
              <FileReference path="src/contexts/MerchantsContext.tsx" description="דמו למידה" />
              <FileReference path="src/contexts/WalletsContext.tsx" description="דמו למידה" />
              <FileReference path="src/hooks/legacy/useMerchantsState.ts" description="state + useEffect לדמו" />
            </ul>
          </LearnSection>

          <LearnSection title="סיכום למחברת" variant="notebook">
            <ul>
              <li>Context = שיתוף state בלי prop drilling</li>
              <li>Provider עוטף → useContext קורא</li>
              <li>Auth ב-Context; נתוני שרת לרוב ב-React Query</li>
            </ul>
          </LearnSection>
        </LearnTopicLayout>
      </MerchantsProvider>
    </WalletsProvider>
  );
}

export default ContextLearnPage;
