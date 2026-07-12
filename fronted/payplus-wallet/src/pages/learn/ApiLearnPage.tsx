import Card from "react-bootstrap/Card";
import DemoLink from "../../components/learn/DemoLink";
import FileReference from "../../components/learn/FileReference";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";

function ApiLearnPage() {
  return (
    <LearnTopicLayout title="useEffect ו-API" lesson={2}>
      <Card className="mb-4">
        <Card.Body>
          <h5>מה זה?</h5>
          <p>
            כשקומפוננטה צריכה נתונים מהשרת, משתמשים ב-<code>useEffect</code> כדי
            לבצע <code>fetch</code> אחרי שהקומפוננטה נטענת. בינתיים מציגים loading,
            ואם נכשל — הודעת שגיאה.
          </p>
          <p className="mb-0">
            <strong>בפרויקט היום:</strong> האפליקציה הראשית עברה ל-React Query, אבל
            אותה לוגיקה קיימת ב-legacy hooks — ראה גם שיעור Context.
          </p>
        </Card.Body>
      </Card>

      <h5 className="mb-3">קבצים רלוונטיים</h5>
      <ul>
        <FileReference
          path="src/services/api.ts"
          description="פונקציות fetch מרכזיות + ApiError"
        />
        <FileReference
          path="src/hooks/legacy/useWalletsState.ts"
          description="useEffect + AbortController — גרסת למידה"
        />
        <FileReference
          path="src/components/HealthStatus.tsx"
          description="מציג סטטוס שרת (עם React Query היום)"
        />
      </ul>

      <DemoLink to="/dashboard" label="ראה Health Status בלוח הבקרה" />
    </LearnTopicLayout>
  );
}

export default ApiLearnPage;
