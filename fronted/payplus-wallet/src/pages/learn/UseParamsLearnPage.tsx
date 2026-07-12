import Card from "react-bootstrap/Card";
import DemoLink from "../../components/learn/DemoLink";
import FileReference from "../../components/learn/FileReference";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";

function UseParamsLearnPage() {
  return (
    <LearnTopicLayout title="useParams — ראוטים דינמיים" lesson={8}>
      <Card className="mb-4">
        <Card.Body>
          <h5>מה זה?</h5>
          <p>
            כשה-URL מכיל מזהה משתנה (למשל <code>/wallets/42</code>), React Router
            מעביר אותו דרך <code>useParams()</code>.
          </p>
          <p className="mb-0">
            הקומפוננטה קוראת את ה-id, טוענת את הנתונים הספציפיים, ומציגה פרטי ארנק
            + עסקאות שלו.
          </p>
        </Card.Body>
      </Card>

      <h5 className="mb-3">קבצים רלוונטיים</h5>
      <ul>
        <FileReference
          path="src/App.tsx"
          description='Route path="/wallets/:id"'
        />
        <FileReference
          path="src/pages/WalletDetailsPage.tsx"
          description="useParams + useWalletDetails"
        />
        <FileReference
          path="src/components/WalletRow.tsx"
          description="Link לדף פרטי ארנק"
        />
      </ul>

      <DemoLink to="/wallets" label="בחר ארנק מהרשימה" />
    </LearnTopicLayout>
  );
}

export default UseParamsLearnPage;
