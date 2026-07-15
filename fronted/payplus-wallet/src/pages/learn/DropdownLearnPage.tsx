import DemoLink from "../../components/learn/DemoLink";
import FileReference from "../../components/learn/FileReference";
import LearnCallout from "../../components/learn/LearnCallout";
import LearnCode from "../../components/learn/LearnCode";
import LearnSection from "../../components/learn/LearnSection";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";

function DropdownLearnPage() {
  return (
    <LearnTopicLayout
      slug="dropdown"
      objectives={[
        "להבין למה select עדיף על הקלדת ID ידנית",
        "לחבר רשימה מהשרת לאפשרויות ב-dropdown",
        "למצוא את זה בטופסי הארנק / עסקאות",
      ]}
    >
      <LearnSection title="1. הבעיה שפתרנו">
        <p>
          בהתחלה אפשר לבקש מהמשתמש להקליד מזהה סוחר (מספר). זה לא נוח ומועד
          לטעויות.
        </p>
        <p>
          <strong>Dropdown (select)</strong> = בוחרים שם מסוחר מרשימה, והערך שנשמר
          הוא ה-id מאחורי הקלעים.
        </p>
      </LearnSection>

      <LearnSection title="2. איך זה נראה בקוד">
        <LearnCode
          label="תבנית"
          code={`const { merchants } = useMerchants();
const [merchantId, setMerchantId] = useState("");

<select
  value={merchantId}
  onChange={(e) => setMerchantId(e.target.value)}
>
  <option value="">בחר סוחר...</option>
  {merchants.map((m) => (
    <option key={m.id} value={m.id}>
      {m.name}
    </option>
  ))}
</select>`}
        />
        <LearnCallout variant="tip" title="Controlled גם כאן">
          ה-<code>value</code> של ה-select מחובר ל-state — אותו עיקרון כמו בשדה
          טקסט.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="3. בפרויקט">
        <ul className="learn-files">
          <FileReference
            path="src/components/CreateWalletForm.tsx"
            description="בחירת סוחר מתוך רשימה"
          />
          <FileReference
            path="src/components/ChargeForm.tsx"
            description="בחירת ארנק לחיוב"
          />
          <FileReference
            path="src/components/RefundForm.tsx"
            description="בחירת ארנק / עסקה להחזר"
          />
        </ul>
        <DemoLink to="/wallets" label="צור ארנק — שים לב ל-dropdown של סוחרים" />
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>select מציג שמות, שומר ids</li>
          <li>האפשרויות מגיעות לרוב מ-API (רשימת סוחרים/ארנקים)</li>
          <li>controlled: value + onChange</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default DropdownLearnPage;
