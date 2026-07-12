import Card from "react-bootstrap/Card";
import DemoLink from "../../components/learn/DemoLink";
import FileReference from "../../components/learn/FileReference";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";

function DropdownLearnPage() {
  return (
    <LearnTopicLayout title="Dropdown (select)" lesson={9}>
      <Card className="mb-4">
        <Card.Body>
          <h5>מה זה?</h5>
          <p>
            במקום להקליד ID ידנית, טוענים רשימה מהשרת ומציגים <code>&lt;select&gt;</code>{" "}
            controlled — כמו input רגיל עם <code>value</code> ו-<code>onChange</code>.
          </p>
          <p className="mb-0">
            UX טוב יותר: פחות טעויות, המשתמש רואה שמות ולא מזהים.
          </p>
        </Card.Body>
      </Card>

      <h5 className="mb-3">קבצים רלוונטיים</h5>
      <ul>
        <FileReference
          path="src/components/ChargeForm.tsx"
          description="בחירת ארנק וסוחר מ-dropdown"
        />
        <FileReference path="src/components/RefundForm.tsx" />
      </ul>

      <DemoLink to="/transactions" label="טען/החזר עסקה" />
    </LearnTopicLayout>
  );
}

export default DropdownLearnPage;
