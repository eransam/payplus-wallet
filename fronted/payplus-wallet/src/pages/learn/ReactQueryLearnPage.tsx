import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import DemoLink from "../../components/learn/DemoLink";
import FileReference from "../../components/learn/FileReference";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";

function ReactQueryLearnPage() {
  return (
    <LearnTopicLayout title="React Query (TanStack Query)" lesson={13}>
      <Card className="mb-4">
        <Card.Body>
          <h5>מה זה?</h5>
          <p>
            ספרייה לניהול <strong>נתוני שרת</strong> — cache, loading, שגיאות,
            refetch אוטומטי, ו-mutations עם invalidation.
          </p>
          <ul className="mb-0">
            <li>
              <code>useQuery</code> — קריאת GET (wallets, merchants...)
            </li>
            <li>
              <code>useMutation</code> — POST/PUT (יצירה, טעינה, החזר)
            </li>
            <li>
              <code>queryClient.invalidateQueries</code> — מרענן cache אחרי שינוי
            </li>
            <li>
              <code>queryKeys</code> — מפתחות מרכזיים לכל סוג נתונים
            </li>
          </ul>
        </Card.Body>
      </Card>

      <h5 className="mb-3">קבצים רלוונטיים</h5>
      <ul>
        <FileReference path="src/lib/queryClient.ts" />
        <FileReference path="src/hooks/queryKeys.ts" />
        <FileReference path="src/hooks/useWallets.ts" />
        <FileReference path="src/hooks/useTransactions.ts" description="useCharge, useRefund" />
        <FileReference path="src/main.tsx" description="QueryClientProvider" />
      </ul>

      <p className="text-muted">
        להשוואה עם Context + useEffect — ראה{" "}
        <Link to="/learn/context">שיעור Context</Link>.
      </p>

      <DemoLink to="/wallets" label="כל האפליקציה רצה על React Query" />
    </LearnTopicLayout>
  );
}

export default ReactQueryLearnPage;
