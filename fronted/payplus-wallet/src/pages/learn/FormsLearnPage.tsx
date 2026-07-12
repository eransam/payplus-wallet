import Card from "react-bootstrap/Card";
import DemoLink from "../../components/learn/DemoLink";
import FileReference from "../../components/learn/FileReference";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";

function FormsLearnPage() {
  return (
    <LearnTopicLayout title="טפסים ו-POST" lesson={3}>
      <Card className="mb-4">
        <Card.Body>
          <h5>מה זה?</h5>
          <p>
            <strong>Controlled input:</strong> הערך של השדה נשמר ב-state (
            <code>value</code> + <code>onChange</code>). React שולט בטופס, לא ה-DOM.
          </p>
          <p>
            בשליחה — <code>preventDefault</code>, קריאת POST ל-API, ואז עדכון הרשימה
            (callback או invalidation).
          </p>
          <p className="mb-0">
            <strong>client_request_id:</strong> מזהה ייחודי לכל בקשה — מונע כפילות
            בעסקאות (idempotency).
          </p>
        </Card.Body>
      </Card>

      <h5 className="mb-3">קבצים רלוונטיים</h5>
      <ul>
        <FileReference path="src/components/CreateMerchantForm.tsx" />
        <FileReference path="src/components/CreateWalletForm.tsx" />
        <FileReference path="src/components/ChargeForm.tsx" />
        <FileReference path="src/components/RefundForm.tsx" />
      </ul>

      <DemoLink to="/merchants" label="צור סוחר חדש" />
      <DemoLink to="/wallets" label="צור ארנק חדש" />
    </LearnTopicLayout>
  );
}

export default FormsLearnPage;
