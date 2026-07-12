import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import DemoLink from "../../components/learn/DemoLink";
import FileReference from "../../components/learn/FileReference";
import CreateMerchantFormManual from "../../components/learn/CreateMerchantFormManual";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";

function ReactHookFormLearnPage() {
  return (
    <LearnTopicLayout title="react-hook-form + zod" lesson={15}>
      <Card className="mb-4">
        <Card.Body>
          <h5>מה זה?</h5>
          <p>
            <strong>react-hook-form</strong> — מנהל את הטופס (שדות, שליחה, שגיאות) בלי{" "}
            <code>useState</code> לכל שדה.
          </p>
          <p className="mb-0">
            <strong>zod</strong> — מגדיר חוקי validation במקום אחד. מחובר לטופס דרך{" "}
            <code>zodResolver</code>.
          </p>
        </Card.Body>
      </Card>

      <Alert variant="info" className="mb-4">
        דף זה מדגים את גישת <strong>useState ידנית</strong>. האפליקציה הראשית (דף סוחרים)
        משתמשת ב-<strong>react-hook-form + zod</strong> — כמו עם Context ו-React Query.
      </Alert>

      <h5 className="mb-3">קבצים רלוונטיים</h5>
      <ul className="mb-4">
        <FileReference path="src/schemas/merchantSchema.ts" description="חוקי zod" />
        <FileReference path="src/components/CreateMerchantForm.tsx" description="RHF — אפליקציה ראשית" />
        <FileReference
          path="src/components/learn/CreateMerchantFormManual.tsx"
          description="useState — למידה"
        />
      </ul>

      <Row className="g-4 mb-4">
        <Col md={6}>
          <Card className="h-100">
            <Card.Header>דמו — useState ידני (למידה)</Card.Header>
            <Card.Body>
              <CreateMerchantFormManual />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100">
            <Card.Header>באפליקציה הראשית</Card.Header>
            <Card.Body>
              <p className="text-muted mb-0">
                בדף הסוחרים הטופס רץ עם react-hook-form + zod — אותה חוויה למשתמש,
                פחות קוד ו-validation מסודר.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <DemoLink to="/merchants" label="ראה את הטופס החדש בדף סוחרים" />
    </LearnTopicLayout>
  );
}

export default ReactHookFormLearnPage;
