import { Link } from "react-router-dom";
import DemoLink from "../../components/learn/DemoLink";
import FileReference from "../../components/learn/FileReference";
import LearnCallout from "../../components/learn/LearnCallout";
import LearnCode from "../../components/learn/LearnCode";
import LearnSection from "../../components/learn/LearnSection";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";

function ReactQueryLearnPage() {
  return (
    <LearnTopicLayout
      slug="react-query"
      objectives={[
        "להבין מה React Query עושה במקום useEffect+useState",
        "להכיר useQuery (קריאה) ו-useMutation (שינוי)",
        "להבין cache ו-queryKey בפשטות",
        "לדעת איפה זה בפרויקט (useMerchants)",
      ]}
    >
      <LearnSection title="1. הבעיה — בלי React Query">
        <p>
          רוצים להציג רשימת סוחרים מהשרת. בלי ספרייה, בכל דף כותבים בערך:
        </p>
        <LearnCode
          label="הדרך הישנה (ידנית)"
          code={`const [merchants, setMerchants] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
  setLoading(true);
  fetch("/api/merchants")
    .then((r) => r.json())
    .then((data) => setMerchants(data))
    .catch(() => setError("שגיאה"))
    .finally(() => setLoading(false));
}, []);`}
        />
        <p>זה חוזר בכל דף. וגם:</p>
        <ul>
          <li>נכנסים לדף → טוענים → יוצאים → חוזרים → טוענים שוב (גם אם כבר יש נתונים)</li>
          <li>צריך לטפל לבד ב-loading / error / ביטול כשעוזבים</li>
          <li>אחרי יצירת סוחר — צריך לרענן את הרשימה ידנית</li>
        </ul>
      </LearnSection>

      <LearnSection title="2. מה React Query עושה? (משפט אחד)">
        <p>
          <strong>React Query</strong> = מנהל בשבילך את{" "}
          <em>הנתונים שמגיעים מהשרת</em>: טעינה, שמירה בזיכרון (cache),
          loading, שגיאות, ורענון אחרי שינוי.
        </p>
        <LearnCallout variant="info" title="אנלוגיה">
          <ul>
            <li>
              <strong>השרת</strong> = מחסן גדול רחוק
            </li>
            <li>
              <strong>Cache של React Query</strong> = מגירה קרובה על השולחן
            </li>
            <li>
              פעם ראשונה — הולכים למחסן ומעתיקים למגירה
            </li>
            <li>
              פעם שנייה (מהר) — לוקחים מהמגירה, בלי לנסוע שוב
            </li>
          </ul>
        </LearnCallout>
        <p>
          זה <strong>לא</strong> מחליף את ה-API וזה <strong>לא</strong> Redux.
          Redux = state של UI (סיידבר וכו'). React Query = נתוני שרת
          (סוחרים, ארנקים).
        </p>
      </LearnSection>

      <LearnSection title="3. שני כלים עיקריים">
        <h3 className="learn-section__subtitle">useQuery — לקרוא מהשרת</h3>
        <p>
          &quot;תן לי את רשימת הסוחרים&quot; — GET.
        </p>
        <LearnCode
          label="אצלנו — useMerchants"
          code={`const query = useQuery({
  queryKey: ["merchants"],           // שם המגירה ב-cache
  queryFn: () => getMerchants(),     // איך מביאים מהשרת
});

// מה מקבלים בחינם:
query.data      // הנתונים (או undefined בזמן טעינה)
query.isLoading // האם טוען עכשיו
query.error     // אם נכשל`}
        />
        <p>
          בקומפוננטה פשוט:
        </p>
        <LearnCode
          label="שימוש"
          code={`const { merchants, loading, error } = useMerchants();

if (loading) return <Spinner />;
if (error) return <p>{error}</p>;
return merchants.map(...);`}
        />

        <h3 className="learn-section__subtitle">useMutation — לשנות בשרת</h3>
        <p>
          &quot;צור סוחר&quot; / &quot;מחק&quot; — POST / PATCH / DELETE.
        </p>
        <LearnCode
          label="רעיון"
          code={`const create = useMutation({
  mutationFn: (name) => createMerchant(name),
  onSuccess: () => {
    // אחרי הצלחה — לרענן את מגירת הסוחרים
    queryClient.invalidateQueries({ queryKey: ["merchants"] });
  },
});

create.mutate("שם חדש");`}
        />
      </LearnSection>

      <LearnSection title="4. queryKey — שם המגירה">
        <p>
          לכל סוג נתונים יש מפתח (שם). ככה React Query יודע מה לשמור ומה
          לרענן.
        </p>
        <LearnCode
          label="אצלנו — queryKeys.ts"
          code={`queryKeys.merchants  →  ["merchants"]
queryKeys.wallets    →  ["wallets"]
// ...`}
        />
        <p>
          אם שני מסכים משתמשים ב-<code>["merchants"]</code> — הם חולקים את
          אותה מגירה. אחד טוען → השני יכול לקבל מיד מה-cache.
        </p>
      </LearnSection>

      <LearnSection title="5. הסיפור המלא — דף סוחרים">
        <LearnCode
          label="צעד אחר צעד"
          code={`1. נכנסים ל-/merchants
2. useMerchants → useQuery עם key ["merchants"]
3. אין במגירה? → קוראים ל-getMerchants() מה-API
4. התשובה נשמרת ב-cache + מוצגת במסך
5. עוברים לדף אחר וחוזרים מהר
6. יש במגירה (עדיין טרי) → מציגים בלי לחכות לשרת
7. לוחצים "צור סוחר" → useMutation
8. אחרי הצלחה → invalidate / setQueryData
9. הרשימה מתעדכנת`}
        />
      </LearnSection>

      <LearnSection title="6. מה לא לשים ב-React Query">
        <ul>
          <li>האם הסיידבר פתוח — זה UI → Redux / useState</li>
          <li>טקסט זמני בטופס לפני שליחה — useState / RHF</li>
        </ul>
        <p>
          כלל: <strong>בא מהשרת וחוזרים אליו?</strong> → React Query.{" "}
          <strong>רק על המסך?</strong> → state רגיל.
        </p>
      </LearnSection>

      <LearnSection title="7. React Query Devtools">
        <p>
          חבילת npm (לא extension) שמוסיפים לקוד. אצלנו היא ב-
          <code>main.tsx</code> — אייקון צף בפינה השמאלית התחתונה.
        </p>
        <ol>
          <li>רענן את האפליקציה</li>
          <li>לחץ על אייקון הלוגו של TanStack / React Query</li>
          <li>
            פתח <strong>סוחרים</strong> — תראה query כמו{" "}
            <code>["merchants"]</code>
          </li>
          <li>
            סטטוס: fresh / stale / fetching · ואת הנתונים ב-cache
          </li>
        </ol>
        <LearnCallout variant="tip" title="למה זה עוזר">
          לראות אם הנתונים באו מהשרת או מה-cache, ומתי הם נחשבים ישנים
          (stale) — בלי לנחש.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="8. איפה בפרויקט">
        <ul className="learn-files">
          <FileReference
            path="fronted/payplus-wallet/src/main.tsx"
            description="QueryClientProvider + ReactQueryDevtools"
          />
          <FileReference
            path="fronted/payplus-wallet/src/hooks/useMerchants.ts"
            description="useQuery + useMutation לסוחרים"
          />
          <FileReference
            path="fronted/payplus-wallet/src/hooks/queryKeys.ts"
            description="שמות המגירות"
          />
          <FileReference
            path="fronted/payplus-wallet/src/services/api.ts"
            description="ה-fetch עצמו לשרת"
          />
        </ul>
        <DemoLink to="/merchants" label="לראות חי — דף סוחרים + Devtools" />
        <p className="mt-2 mb-0">
          המשך:{" "}
          <Link to="/learn/optimistic-updates">Optimistic Updates</Link> — איך
          הרשימה מתעדכנת עוד לפני תשובת השרת.
        </p>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>
            React Query = מנהל נתוני שרת (cache + loading + error)
          </li>
          <li>
            <code>useQuery</code> = קרא · <code>useMutation</code> = שנה
          </li>
          <li>
            <code>queryKey</code> = שם המגירה ב-cache
          </li>
          <li>לא מחליף Redux — משלים אותו (שרת מול UI)</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default ReactQueryLearnPage;
