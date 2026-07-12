import Card from "react-bootstrap/Card";
import DemoLink from "../../components/learn/DemoLink";
import FileReference from "../../components/learn/FileReference";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";

function RouterLearnPage() {
  return (
    <LearnTopicLayout title="React Router" lesson={5}>
      <Card className="mb-4">
        <Card.Body>
          <h5>מה זה?</h5>
          <p>
            SPA (Single Page Application) לא טוען דף חדש מהשרת — React מחליף את
            התוכן לפי ה-URL.
          </p>
          <ul className="mb-0">
            <li>
              <code>Routes</code> + <code>Route</code> — מגדירים איזה קומפוננטה לכל
              נתיב
            </li>
            <li>
              <code>NavLink</code> — קישור עם סימון אוטומטי של הדף הפעיל
            </li>
            <li>
              <code>Link</code> — ניווט בלי רענון דף
            </li>
          </ul>
        </Card.Body>
      </Card>

      <h5 className="mb-3">קבצים רלוונטיים</h5>
      <ul>
        <FileReference path="src/App.tsx" description="הגדרת כל ה-Routes" />
        <FileReference path="src/components/Layout.tsx" description="NavLink בתפריט" />
        <FileReference path="src/main.tsx" description="BrowserRouter עוטף את האפליקציה" />
      </ul>

      <DemoLink to="/wallets" label="עבור לארנקים" />
    </LearnTopicLayout>
  );
}

export default RouterLearnPage;
