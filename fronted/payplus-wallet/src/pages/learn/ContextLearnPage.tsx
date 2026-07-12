import Alert from "react-bootstrap/Alert";
import Card from "react-bootstrap/Card";
import { MerchantsProvider } from "../../contexts/MerchantsContext";
import { WalletsProvider } from "../../contexts/WalletsContext";
import FileReference from "../../components/learn/FileReference";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";
import MerchantsListContext from "../../components/learn/MerchantsListContext";
import WalletsListContext from "../../components/learn/WalletsListContext";

function ContextLearnPage() {
  return (
    <WalletsProvider>
      <MerchantsProvider>
        <LearnTopicLayout title="Context" lesson={11}>
          <Card className="mb-4">
            <Card.Body>
              <h5>מה זה?</h5>
              <p>
                <strong>Context</strong> מאפשר לשתף state בין קומפוננטות בלי להעביר
                props בכל שכבה (prop drilling).
              </p>
              <p className="mb-0">
                <strong>Provider</strong> עוטף עץ קומפוננטות ומספק ערך.{" "}
                <strong>useContext</strong> קורא אותו מכל מקום בתוך העץ.
              </p>
            </Card.Body>
          </Card>

          <Alert variant="info" className="mb-4">
            דמו חי למטה משתמש ב-<strong>Context + useEffect</strong>. האפליקציה
            הראשית (תפריט למעלה) משתמשת ב-<strong>React Query</strong> — כך שתי
            הגישות קיימות בלי להתנגש.
          </Alert>

          <h5 className="mb-3">קבצים רלוונטיים</h5>
          <ul className="mb-4">
            <FileReference path="src/contexts/WalletsContext.tsx" />
            <FileReference path="src/contexts/MerchantsContext.tsx" />
            <FileReference path="src/hooks/legacy/useWalletsState.ts" />
            <FileReference path="src/components/learn/WalletsListContext.tsx" />
          </ul>

          <h5 className="mb-3">דמו חי</h5>
          <div className="d-flex flex-column gap-4">
            <WalletsListContext />
            <MerchantsListContext />
          </div>
        </LearnTopicLayout>
      </MerchantsProvider>
    </WalletsProvider>
  );
}

export default ContextLearnPage;
