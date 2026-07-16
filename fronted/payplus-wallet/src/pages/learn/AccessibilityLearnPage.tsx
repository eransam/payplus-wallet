import LearnCallout from "../../components/learn/LearnCallout";
import LearnCode from "../../components/learn/LearnCode";
import LearnSection from "../../components/learn/LearnSection";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";

function AccessibilityLearnPage() {
  return (
    <LearnTopicLayout
      slug="accessibility"
      objectives={[
        "להבין למה a11y חשוב ב-React (ולראיון)",
        "לחבר label ל-input נכון",
        "לדעת על מקלדת, focus, ו-aria בסיסי",
        "להכיר כלים לבדיקה מהירה",
      ]}
    >
      <LearnSection title="1. מה זה a11y?">
        <p>
          <strong>Accessibility (a11y)</strong> = נגישות — שהממשק יעבוד גם עם
          מקלדת, קורא מסך, וניגודיות טובה. ב-React זה לא "תוסף" — זה HTML
          נכון + התנהגות focus.
        </p>
        <LearnCallout variant="tip" title="למה בראיון">
          סניור חושב על משתמשים אמיתיים ומודלים/טפסים — לא רק על מראה.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="2. Labels לטפסים">
        <LearnCode
          label="נכון"
          code={`<label htmlFor="merchant-name">שם סוחר</label>
<input id="merchant-name" value={name} onChange={...} />

// או עטיפה:
<label>
  שם סוחר
  <input value={name} onChange={...} />
</label>`}
        />
        <p>
          ב-React: המאפיין הוא <code>htmlFor</code> (לא <code>for</code> —
          מילת מפתח ב-JS).
        </p>
      </LearnSection>

      <LearnSection title="3. מקלדת ו-focus">
        <ul>
          <li>
            כפתורים אמיתיים: <code>&lt;button&gt;</code> — לא{" "}
            <code>div onClick</code> בלי role/tabIndex
          </li>
          <li>
            מודל: בפתיחה → focus לשדה/כפתור; ב-Esc → סגירה; focus trap
            (אופציונלי עם ספרייה)
          </li>
          <li>
            אחרי מחיקה: להחזיר focus למקום הגיוני (לא "לאיבוד")
          </li>
        </ul>
        <LearnCode
          label="פוקוס אחרי mount (עם ref)"
          code={`useEffect(() => {
  inputRef.current?.focus();
}, []);`}
        />
      </LearnSection>

      <LearnSection title="4. ARIA — בקצרה">
        <p>
          כש-HTML סמנטי לא מספיק (מודל מותאם, טאבים):
        </p>
        <LearnCode
          label="דוגמאות"
          code={`role="dialog"
aria-label="מחיקת סוחר"
aria-labelledby="title-id"
aria-busy={isLoading}
aria-invalid={!!error}`}
        />
        <LearnCallout variant="warn" title="עדיפות">
          קודם אלמנט סמנטי נכון (<code>button</code>, <code>nav</code>,{" "}
          <code>main</code>). ARIA רק כשצריך להשלים.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="5. תמונות וטקסט">
        <LearnCode
          label="img"
          code={`<img src={url} alt="לוגו PayPlus" />
// דקורטיבי: alt=""`}
        />
      </LearnSection>

      <LearnSection title="6. איך בודקים מהר">
        <ul>
          <li>רק מקלדת: Tab / Shift+Tab / Enter / Esc</li>
          <li>Chrome Lighthouse → Accessibility</li>
          <li>extension: axe DevTools</li>
          <li>בדיקות: Testing Library מעודד שאילתות לפי role/name</li>
        </ul>
        <LearnCode
          label="בטסט"
          code={`screen.getByRole("button", { name: /שמור/i });
screen.getByLabelText("שם סוחר");`}
        />
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>label + htmlFor · button אמיתי · alt בתמונות</li>
          <li>מודל = focus + Esc</li>
          <li>ARIA משלים HTML — לא מחליף</li>
          <li>Tab במקלדת = בדיקה בסיסית טובה</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default AccessibilityLearnPage;
