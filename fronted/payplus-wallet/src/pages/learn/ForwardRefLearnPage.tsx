import { forwardRef, useRef } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import FileReference from "../../components/learn/FileReference";
import LearnCallout from "../../components/learn/LearnCallout";
import LearnCode from "../../components/learn/LearnCode";
import LearnSection from "../../components/learn/LearnSection";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";

const FancyInput = forwardRef<HTMLInputElement, { label: string }>(
  function FancyInput({ label }, ref) {
    return (
      <Form.Group>
        <Form.Label>{label}</Form.Label>
        <Form.Control ref={ref} type="text" placeholder="ההורה שולט בפוקוס" />
      </Form.Group>
    );
  },
);

function ForwardRefDemo() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Stack gap={2}>
      <FancyInput label="שדה עם forwardRef" ref={inputRef} />
      <Button type="button" size="sm" onClick={() => inputRef.current?.focus()}>
        פוקוס מההורה
      </Button>
    </Stack>
  );
}

function ForwardRefLearnPage() {
  return (
    <LearnTopicLayout
      slug="forward-ref"
      objectives={[
        "להבין למה ref לא עובר כ-prop רגיל",
        "להשתמש ב-forwardRef כדי שהורה יקבל DOM של ילד",
        "לדעת מתי זה נחוץ (מודל, פוקוס, ספריות UI)",
      ]}
    >
      <LearnSection title="1. הבעיה">
        <p>
          <code>ref</code> הוא לא prop רגיל. אם כותבים{" "}
          <code>&lt;Child ref=&#123;r&#125; /&gt;</code> על קומפוננטה שלך — בלי{" "}
          <code>forwardRef</code> ה-ref <strong>לא מגיע</strong> ל-
          <code>&lt;input&gt;</code> בפנים.
        </p>
      </LearnSection>

      <LearnSection title="2. הפתרון — forwardRef">
        <LearnCode
          label="תבנית"
          code={`const Input = forwardRef<HTMLInputElement, Props>(
  function Input(props, ref) {
    return <input ref={ref} {...props} />;
  }
);

// הורה:
const ref = useRef<HTMLInputElement>(null);
<Input ref={ref} />;
ref.current?.focus();`}
        />
        <div className="learn-demo-box">
          <ForwardRefDemo />
        </div>
      </LearnSection>

      <LearnSection title="3. useImperativeHandle (בקצרה)">
        <p>
          חושפים להורה API מצומצם במקום את כל ה-DOM — למשל רק{" "}
          <code>&#123; focus, clear &#125;</code>. נדיר ביום־יום; שואלים
          בראיונות סניור.
        </p>
      </LearnSection>

      <LearnSection title="4. מתי משתמשים">
        <ul>
          <li>מודל שנפתח → פוקוס אוטומטי לשדה הראשון</li>
          <li>עטיפת input בספריית UI</li>
          <li>מדידת גודל / scroll לילד</li>
        </ul>
        <LearnCallout variant="tip" title="משפט לראיון">
          "forwardRef מעביר ref מקומפוננטה מותאמת לאלמנט DOM בפנים — חובה
          כשההורה צריך focus/scroll על הילד."
        </LearnCallout>
      </LearnSection>

      <LearnSection title="קבצים">
        <ul className="learn-files">
          <FileReference
            path="fronted/payplus-wallet/src/pages/learn/UseRefLearnPage.tsx"
            description="useRef בסיסי — לפני forwardRef"
          />
        </ul>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>ref לא עובר כ-prop רגיל</li>
          <li>
            <code>forwardRef</code> = גשר מההורה ל-DOM בילד
          </li>
          <li>שימוש קלאסי: פוקוס במודל / input עטוף</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default ForwardRefLearnPage;
