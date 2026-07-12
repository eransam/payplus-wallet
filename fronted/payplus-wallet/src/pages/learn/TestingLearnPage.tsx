import Card from "react-bootstrap/Card";
import DemoLink from "../../components/learn/DemoLink";
import FileReference from "../../components/learn/FileReference";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";

function TestingLearnPage() {
  return (
    <LearnTopicLayout title="Testing" lesson={14}>
      <Card className="mb-4">
        <Card.Body>
          <h5>מה זה?</h5>
          <p>
            קוד שבודק שהקוד שלך עובד — <strong>Vitest</strong> מריץ,{" "}
            <strong>React Testing Library</strong> מרנדר קומפוננטות ובודק UI.
          </p>
          <p className="mb-0">
            <code>npm run test:run</code> — מריץ את כל הבדיקות.
          </p>
        </Card.Body>
      </Card>

      <h5 className="mb-3">קבצים רלוונטיים</h5>
      <ul className="mb-4">
        <FileReference path="src/utils/validation.test.ts" description="unit test" />
        <FileReference path="src/components/CreateMerchantForm.test.tsx" description="component test" />
        <FileReference path="src/test/test-utils.tsx" description="renderWithProviders" />
      </ul>

      <DemoLink to="/merchants" label="הטופס שנבדק ב-CreateMerchantForm.test" />
    </LearnTopicLayout>
  );
}

export default TestingLearnPage;
