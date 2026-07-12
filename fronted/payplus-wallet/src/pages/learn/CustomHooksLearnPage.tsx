import Card from "react-bootstrap/Card";
import DemoLink from "../../components/learn/DemoLink";
import FileReference from "../../components/learn/FileReference";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";

function CustomHooksLearnPage() {
  return (
    <LearnTopicLayout title="Custom Hooks" lesson={10}>
      <Card className="mb-4">
        <Card.Body>
          <h5>מה זה?</h5>
          <p>
            כשאותה לוגיקה (state + effects / queries) חוזרת בכמה קומפוננטות —
            מוציאים אותה לפונקציה שמתחילה ב-<code>use</code>.
          </p>
          <p className="mb-0">
            הקומפוננטה נשארת "דקה" — רק UI. ה-hook מטפל בנתונים.
          </p>
        </Card.Body>
      </Card>

      <h5 className="mb-3">קבצים רלוונטיים</h5>
      <ul>
        <FileReference path="src/hooks/useWallets.ts" description="React Query — גישה ראשית" />
        <FileReference path="src/hooks/useMerchants.ts" />
        <FileReference path="src/hooks/useTransactions.ts" />
        <FileReference path="src/hooks/useWalletDetails.ts" />
        <FileReference
          path="src/hooks/legacy/useWalletsState.ts"
          description="גרסת useEffect — להשוואה"
        />
      </ul>

      <DemoLink to="/wallets" label="ה-hooks מזינים את דף הארנקים" />
    </LearnTopicLayout>
  );
}

export default CustomHooksLearnPage;
