import Card from "react-bootstrap/Card";
import DemoLink from "../../components/learn/DemoLink";
import FileReference from "../../components/learn/FileReference";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";

function ValidationLearnPage() {
  return (
    <LearnTopicLayout title="Validation ו-UX" lesson={12}>
      <Card className="mb-4">
        <Card.Body>
          <h5>מה זה?</h5>
          <p>
            <strong>Validation לפני שליחה:</strong> בודקים קלט בצד הלקוח — חוסכים
            round-trip לשרת על שגיאות ברורות.
          </p>
          <p>
            <strong>תרגום שגיאות:</strong> ה-API מחזיר קודים באנגלית —{" "}
            <code>apiErrors.ts</code> מתרגם לעברית.
          </p>
          <p className="mb-0">
            <strong>AbortController:</strong> מבטל בקשות כשהקומפוננטה יורדת מהמסך —
            מונע race conditions.
          </p>
        </Card.Body>
      </Card>

      <h5 className="mb-3">קבצים רלוונטיים</h5>
      <ul>
        <FileReference path="src/utils/validation.ts" description="validateAmount" />
        <FileReference path="src/utils/apiErrors.ts" description="translateApiError" />
        <FileReference path="src/services/api.ts" description="תמיכה ב-AbortSignal" />
        <FileReference path="src/components/ChargeForm.tsx" description="שימוש ב-validation" />
      </ul>

      <DemoLink to="/transactions" label="נסה סכום לא תקין בטופס טעינה" />
    </LearnTopicLayout>
  );
}

export default ValidationLearnPage;
