import DemoLink from "../../components/learn/DemoLink";
import FileReference from "../../components/learn/FileReference";
import LearnCallout from "../../components/learn/LearnCallout";
import LearnCode from "../../components/learn/LearnCode";
import LearnSection from "../../components/learn/LearnSection";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";

function ApiLearnPage() {
  return (
    <LearnTopicLayout
      slug="api"
      objectives={[
        "להבין למה צריך useEffect לקריאות שרת",
        "לזהות את דפוס loading / data / error",
        "לדעת איפה זה קיים בפרויקט (legacy מול React Query)",
      ]}
    >
      <LearnSection title="1. הבעיה">
        <p>
          כשדף נטען, רוצים להביא נתונים מהשרת (רשימת סוחרים). אי אפשר פשוט לקרוא
          ל-<code>fetch</code> באמצע ה-render — זה ירוץ שוב ושוב בלי שליטה.
        </p>
        <p>
          <strong>useEffect</strong> אומר: "אחרי שהמסך צויר — תריץ את הקוד הזה"
          (למשל קריאת API).
        </p>
      </LearnSection>

      <LearnSection title="2. הדפוס הקלאסי (useEffect + useState)">
        <LearnCode
          label="תבנית כללית"
          code={`const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

useEffect(() => {
  async function load() {
    try {
      setLoading(true);
      const result = await getMerchants();
      setData(result);
    } catch {
      setError("הטעינה נכשלה");
    } finally {
      setLoading(false);
    }
  }
  load();
}, []); // [] = פעם אחת בכניסה לדף`}
        />
        <p>שלושה מצבים חשובים תמיד:</p>
        <ul>
          <li>
            <strong>loading</strong> — מציגים Spinner
          </li>
          <li>
            <strong>error</strong> — מציגים הודעת שגיאה
          </li>
          <li>
            <strong>data</strong> — מציגים את הרשימה
          </li>
        </ul>
      </LearnSection>

      <LearnSection title="3. בפרויקט שלך — שני שלבים">
        <p>
          בהתחלה למדנו את הגישה הידנית. אחר כך עברנו ל-<strong>React Query</strong>{" "}
          שעושה את אותו דבר בצורה מקצועית יותר (cache, ביטול בקשות...).
        </p>
        <ul className="learn-files">
          <FileReference
            path="src/hooks/legacy/useMerchantsState.ts"
            description="הגרסה הישנה: useEffect + fetch — ללמידה"
          />
          <FileReference
            path="src/hooks/useMerchants.ts"
            description="הגרסה באפליקציה: React Query"
          />
          <FileReference
            path="src/services/api.ts"
            description="שכבת ה-fetch האמיתית לשרת"
          />
        </ul>
        <LearnCallout variant="info" title="חשוב">
          גם עם React Query — הקריאה לשרת עדיין עוברת ב-<code>api.ts</code>. מה
          שהשתנה הוא <em>איך</em> מנהלים loading/cache, לא פרוטוקול ה-HTTP.
        </LearnCallout>
        <DemoLink to="/learn/context" label="ראה דמו חי עם useEffect (שיעור Context)" />
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>useEffect = קוד שרץ אחרי render (תופעות לוואי / API)</li>
          <li>תלות <code>[]</code> = פעם אחת בכניסה</li>
          <li>תמיד לטפל ב-loading, error, data</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default ApiLearnPage;
