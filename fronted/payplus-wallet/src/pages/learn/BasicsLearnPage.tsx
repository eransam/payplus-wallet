import Card from "react-bootstrap/Card";
import DemoLink from "../../components/learn/DemoLink";
import FileReference from "../../components/learn/FileReference";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";

function BasicsLearnPage() {
  return (
    <LearnTopicLayout title="קומפוננטות, props ו-state" lesson={1}>
      <Card className="mb-4">
        <Card.Body>
          <h5>מה זה?</h5>
          <p>
            React בונה UI מ<strong>קומפוננטות</strong> — פונקציות שמחזירות JSX.
            כל קומפוננטה יכולה לקבל <strong>props</strong> (נתונים מההורה) ולנהל{" "}
            <strong>state</strong> פנימי עם <code>useState</code>.
          </p>
          <p className="mb-0">
            <strong>אנלוגיה:</strong> קומפוננטה = רכיב לגו. Props = ההוראות שמגיעות
            מהקופסה הגדולה. State = מצב פנימי שהרכיב משנה בעצמו (למשל טקסט בשדה קלט).
          </p>
        </Card.Body>
      </Card>

      <h5 className="mb-3">דוגמה בפרויקט</h5>
      <ul>
        <FileReference
          path="src/components/MerchantRow.tsx"
          description="מקבל merchant כ-prop ומציג שורה"
        />
        <FileReference
          path="src/components/MerchantsList.tsx"
          description="מעביר props לכל שורה עם map"
        />
        <FileReference
          path="src/components/CreateMerchantForm.tsx"
          description="useState לשדה name ולשגיאות"
        />
      </ul>

      <DemoLink to="/merchants" label="ראה רשימת סוחרים בפעולה" />
    </LearnTopicLayout>
  );
}

export default BasicsLearnPage;
