import DemoLink from "../../components/learn/DemoLink";
import FileReference from "../../components/learn/FileReference";
import LearnCallout from "../../components/learn/LearnCallout";
import LearnCode from "../../components/learn/LearnCode";
import LearnSection from "../../components/learn/LearnSection";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";

function FormsLearnPage() {
  return (
    <LearnTopicLayout
      slug="forms"
      objectives={[
        "להבין מהו controlled input",
        "לדעת למה צריך preventDefault בטופס",
        "לזהות את שלבי השליחה לשרת (POST)",
      ]}
    >
      <LearnSection title="1. Controlled input — מה זה?">
        <p>
          ב-React, בדרך כלל השדה בטופס נשלט על ידי <strong>state</strong>: הערך על
          המסך תמיד שווה למה שיש ב-state, וכל הקלדה מעדכנת את ה-state.
        </p>
        <LearnCode
          label="Controlled"
          code={`const [name, setName] = useState("");

<input
  value={name}
  onChange={(e) => setName(e.target.value)}
/>`}
        />
        <p>
          בלי זה — ה-DOM מחזיק ערך אחד ו-React חושב משהו אחר. עם controlled יש{" "}
          <strong>מקור אמת אחד</strong>.
        </p>
      </LearnSection>

      <LearnSection title="2. שליחת טופס">
        <LearnCode
          label="handleSubmit"
          code={`async function handleSubmit(event) {
  event.preventDefault(); // בלי רענון דף!
  if (!name.trim()) {
    setError("שדה חובה");
    return;
  }
  setSubmitting(true);
  try {
    await createMerchant(name.trim()); // POST לשרת
    setName("");
  } catch {
    setError("השמירה נכשלה");
  } finally {
    setSubmitting(false);
  }
}`}
        />
        <ul>
          <li>
            <code>preventDefault</code> — הדפדפן לא מרענן את הדף
          </li>
          <li>
            <code>submitting</code> — מונע לחיצה כפולה בזמן בקשה
          </li>
          <li>validation לפני שליחה + טיפול בשגיאה אחרי</li>
        </ul>
      </LearnSection>

      <LearnSection title="3. בפרויקט">
        <p>
          היום הטופס הראשי משתמש ב-<strong>react-hook-form + zod</strong> (שיעור
          נפרד), אבל הרעיון זהה: שדות → validation → POST → עדכון הרשימה.
        </p>
        <ul className="learn-files">
          <FileReference
            path="src/components/CreateMerchantForm.tsx"
            description="טופס יצירת סוחר באפליקציה"
          />
          <FileReference
            path="src/components/learn/CreateMerchantFormManual.tsx"
            description="גרסת useState ידנית — ללמידה"
          />
          <FileReference
            path="src/services/api.ts"
            description="createMerchant → POST /api/merchants"
          />
        </ul>
        <LearnCallout variant="tip" title="תרגול">
          פתח את דף הסוחרים, צור סוחר, ושים לב: אחרי הצלחה הרשימה מתעדכנת בלי
          רענון דף.
        </LearnCallout>
        <DemoLink to="/merchants" label="נסה ליצור סוחר" />
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>Controlled = value + onChange מחוברים ל-state</li>
          <li>preventDefault בשליחה</li>
          <li>loading/error מסביב ל-POST</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default FormsLearnPage;
