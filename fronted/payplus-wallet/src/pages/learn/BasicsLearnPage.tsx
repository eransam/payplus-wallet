import DemoLink from "../../components/learn/DemoLink";
import FileReference from "../../components/learn/FileReference";
import LearnCallout from "../../components/learn/LearnCallout";
import LearnCode from "../../components/learn/LearnCode";
import LearnSection from "../../components/learn/LearnSection";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";

function BasicsLearnPage() {
  return (
    <LearnTopicLayout
      slug="basics"
      objectives={[
        "להבין מהי קומפוננטה ב-React",
        "להבדיל בין props ל-state",
        "לזהות איפה זה מופיע בפרויקט (רשימת סוחרים)",
      ]}
    >
      <LearnSection title="1. מהי קומפוננטה?">
        <p>
          קומפוננטה היא <strong>פונקציית JavaScript</strong> שמחזירה JSX — תיאור של
          איך המסך אמור להיראות. במקום לכתוב דף HTML אחד ענק, בונים את הממשק
          מחלקים קטנים שחוזרים על עצמם.
        </p>
        <LearnCode
          label="קומפוננטה בסיסית"
          code={`function Hello({ name }) {
  return <h1>שלום, {name}</h1>;
}`}
        />
        <p>
          <strong>אנלוגיה:</strong> כמו לבני לגו. כל לבנה (קומפוננטה) עושה דבר אחד
          ברור, ואפשר להרכיב מהן מסך שלם.
        </p>
      </LearnSection>

      <LearnSection title="2. Props — נתונים שמגיעים מבחוץ">
        <p>
          <strong>Props</strong> = פרמטרים שההורה מעביר לילד. הילד <strong>לא</strong>{" "}
          משנה אותם — רק מציג / משתמש.
        </p>
        <LearnCode
          label="הורה מעביר prop"
          code={`// ההורה
<MerchantRow merchant={merchant} />

// הילד
function MerchantRow({ merchant }) {
  return <tr><td>{merchant.name}</td></tr>;
}`}
        />
        <LearnCallout variant="tip" title="זכור">
          Props זורמים מלמעלה למטה (מהורה לילד). זה חד-כיווני.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="3. State — מצב פנימי שהקומפוננטה משנה">
        <p>
          <strong>State</strong> = נתונים שהקומפוננטה שומרת אצלה. כשמשנים אותם עם
          ה-setter — React מרנדר מחדש ומעדכן את המסך.
        </p>
        <LearnCode
          label="useState"
          code={`const [name, setName] = useState("");

// קריאה: name
// עדכון: setName("דני")  ← גורם ל-render מחדש`}
        />
        <p>
          <strong>Props מול State:</strong> props = מה ההורה נתן לי. state = מה{" "}
          <em>אני</em> מנהל ומשנה (טופס, האם מודל פתוח, וכו').
        </p>
      </LearnSection>

      <LearnSection title="4. איפה זה בפרויקט שלך">
        <ul className="learn-files">
          <FileReference
            path="src/components/MerchantRow.tsx"
            description="מקבל merchant כ-prop ומציג שורה בטבלה"
          />
          <FileReference
            path="src/components/MerchantsList.tsx"
            description="עושה map ומעביר לכל שורה את ה-prop"
          />
          <FileReference
            path="src/components/CreateMerchantForm.tsx"
            description="משתמש ב-state (דרך ספריית טפסים) לניהול השדות"
          />
        </ul>
        <DemoLink to="/merchants" label="פתח את דף הסוחרים ורשום איך רשימה + שורה עובדים יחד" />
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>קומפוננטה = פונקציה שמחזירה JSX</li>
          <li>Props = קלט מההורה (לקריאה)</li>
          <li>State = מצב פנימי שמשנה → render מחדש</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default BasicsLearnPage;
