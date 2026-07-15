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
        "להבין מה React Query מנהל (cache, loading, errors)",
        "להבדיל בין useQuery ל-useMutation",
        "לדעת איך invalidate / setQueryData מעדכנים את המסך",
      ]}
    >
      <LearnSection title="1. מה זה React Query?">
        <p>
          ספרייה לניהול <strong>נתוני שרת</strong> ב-React: מתי לטעון, איך
          לשמור ב-cache, loading/error, ורענון אחרי שינויים.
        </p>
        <p>
          במקום לכתוב ידנית <code>useEffect</code> + <code>useState</code> בכל
          דף — כותבים hook עם <code>useQuery</code> / <code>useMutation</code>.
        </p>
      </LearnSection>

      <LearnSection title="2. המבנה בפרויקט (שכבות)">
        <ol>
          <li>
            <code>main.tsx</code> — <code>QueryClientProvider</code>
          </li>
          <li>
            <code>lib/queryClient.ts</code> — הגדרות (staleTime, retry...)
          </li>
          <li>
            <code>hooks/queryKeys.ts</code> — שמות המגירות ב-cache
          </li>
          <li>
            <code>hooks/useMerchants.ts</code> וכו' — useQuery / useMutation
          </li>
          <li>
            <code>services/api.ts</code> — fetch בפועל
          </li>
        </ol>
      </LearnSection>

      <LearnSection title="3. useQuery — קריאה">
        <LearnCode
          label="useMerchants (מפושט)"
          code={`const query = useQuery({
  queryKey: queryKeys.merchants,
  queryFn: ({ signal }) => getMerchants(signal),
});

return {
  merchants: query.data ?? [],
  loading: query.isLoading,
  error: ...,
};`}
        />
        <p>
          <code>queryKey</code> = שם המגירה. אם כבר יש נתונים טריים — מחזירים
          מה-cache בלי fetch מחדש.
        </p>
      </LearnSection>

      <LearnSection title="4. useMutation — שינוי">
        <LearnCode
          label="יצירת סוחר"
          code={`useMutation({
  mutationFn: (name) => createMerchant(name),
  onSuccess: (merchant) => {
    queryClient.setQueryData(queryKeys.merchants, (current) =>
      [merchant, ...(current ?? [])]
    );
  },
});`}
        />
        <p>
          אחרי charge/refund משתמשים ב-<code>invalidateQueries</code> — אומרים
          ל-cache שהנתונים ישנים ומביאים מחדש מהשרת.
        </p>
        <LearnCallout variant="tip" title="signal">
          ה-<code>signal</code> לא נשלח לשרת כ-header — הוא מבטל את ההמתנה
          בדפדפן כשעוזבים דף. ראה <code>api.ts</code>.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="5. קבצים">
        <ul className="learn-files">
          <FileReference path="src/lib/queryClient.ts" description="הגדרות גלובליות" />
          <FileReference path="src/hooks/queryKeys.ts" description="מפתחות cache" />
          <FileReference path="src/hooks/useMerchants.ts" description="דוגמה מלאה" />
          <FileReference path="src/hooks/useTransactions.ts" description="mutations + invalidate" />
          <FileReference path="src/main.tsx" description="QueryClientProvider" />
        </ul>
        <p>
          להשוואה עם Context:{" "}
          <Link to="/learn/context">שיעור Context</Link>.
        </p>
        <DemoLink to="/wallets" label="כל דפי הנתונים רצים על React Query" />
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>useQuery = GET + cache</li>
          <li>useMutation = POST/PATCH/DELETE</li>
          <li>setQueryData / invalidate מעדכנים את המסך אחרי שינוי</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default ReactQueryLearnPage;
