import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import ErrorBoundary from "../../components/ErrorBoundary";
import FileReference from "../../components/learn/FileReference";
import CrashDemo from "../../components/learn/CrashDemo";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";

function ErrorBoundaryLearnPage() {
  return (
    <LearnTopicLayout title="Error Boundary" lesson={17}>
      <Card className="mb-4">
        <Card.Body>
          <h5>מה זה?</h5>
          <p>
            קומפוננטה שתופסת <strong>קריסה ב-render</strong> ומציגה הודעת שגיאה
            במקום מסך לבן.
          </p>
          <p className="mb-0">
            <strong>לא</strong> מחליף <code>try/catch</code> לשגיאות API — משלים
            אותו לבאגים לא צפויים ב-UI.
          </p>
        </Card.Body>
      </Card>

      <Alert variant="info" className="mb-4">
        ב-<code>App.tsx</code> עטפנו את ה-Routes ב-<code>ErrorBoundary</code> — התפריט
        נשאר, רק תוכן הדף מוגן.
      </Alert>

      <h5 className="mb-3">קבצים רלוונטיים</h5>
      <ul className="mb-4">
        <FileReference path="src/components/ErrorBoundary.tsx" />
        <FileReference path="src/App.tsx" description="עוטף את Routes" />
        <FileReference path="src/components/learn/CrashDemo.tsx" description="דמו קריסה" />
      </ul>

      <h5 className="mb-3">דמו חי</h5>
      <Card>
        <Card.Body>
          <ErrorBoundary>
            <CrashDemo />
          </ErrorBoundary>
        </Card.Body>
      </Card>
    </LearnTopicLayout>
  );
}

export default ErrorBoundaryLearnPage;
