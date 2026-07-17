import { memo, useCallback, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import { Link } from "react-router-dom";
import FileReference from "../../components/learn/FileReference";
import LearnCallout from "../../components/learn/LearnCallout";
import LearnCode from "../../components/learn/LearnCode";
import LearnSection from "../../components/learn/LearnSection";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";

type ChildProps = {
  title: string;
  onPick: () => void;
};

/** ילד עטוף ב-memo — אמור להצטייר מחדש רק כשה-props באמת משתנים */
const MemoChild = memo(function MemoChild({ title, onPick }: ChildProps) {
  const renders = useRef(0);
  renders.current += 1;

  return (
    <div className="border rounded p-2 mb-2 bg-white d-flex align-items-center gap-2">
      <Button type="button" size="sm" variant="outline-primary" onClick={onPick}>
        {title}
      </Button>
      <span className="small">
        צויר <span className="badge bg-secondary">{renders.current}</span> פעמים
      </span>
    </div>
  );
});

function UseCallbackDemo() {
  const [count, setCount] = useState(0);
  const [picked, setPicked] = useState("—");

  // בכל render של ההורה נוצרת פונקציה *חדשה* בזיכרון.
  // הילד עטוף ב-memo, אבל מבחינתו ה-prop השתנה → מצטייר שוב.
  const onPickUnstable = () => setPicked("בלי useCallback");

  // useCallback שומר את *אותה* פונקציה בין renders (deps ריקים =
  // אף פעם לא מחליפים אותה) → memo של הילד סוף סוף עובד.
  const onPickStable = useCallback(() => {
    setPicked("עם useCallback");
  }, []);

  return (
    <Stack gap={2}>
      <p className="mb-0 small text-muted">
        שני הילדים עטופים ב-<code>memo</code> ומקבלים בדיוק את אותם props
        בכל פעם. ההבדל היחיד: איך ההורה יוצר את הפונקציה שהוא מעביר להם.
      </p>
      <Button type="button" size="sm" onClick={() => setCount((c) => c + 1)}>
        Re-render של ההורה (לחצת {count} פעמים)
      </Button>
      <MemoChild title="קיבל פונקציה רגילה" onPick={onPickUnstable} />
      <MemoChild title="קיבל useCallback" onPick={onPickStable} />
      <p className="mb-0 small">נלחץ לאחרונה: {picked}</p>
      <p className="mb-0 small text-muted">
        המונה של הראשון עולה בכל לחיצה — הפונקציה החדשה "שברה" את ה-memo.
        השני נשאר תקוע — אותה פונקציה, memo מדלג עליו.
      </p>
    </Stack>
  );
}

function UseCallbackLearnPage() {
  return (
    <LearnTopicLayout
      slug="use-callback"
      objectives={[
        "להבין למה פונקציה 'רגילה' נוצרת מחדש בכל render",
        "להבין מה useCallback עושה — במשפט אחד",
        "לראות בדמו איך useCallback מציל את memo",
        "לדעת מתי בכלל צריך את זה (פחות ממה שנדמה)",
      ]}
    >
      <LearnSection title="1. הבעיה — פונקציה חדשה בכל render">
        <p>
          שוב הבסיס: render = הפונקציה של הקומפוננטה רצה מחדש. וכל דבר שמוגדר{" "}
          <strong>בתוך</strong> הפונקציה — נוצר מחדש. כולל פונקציות:
        </p>
        <LearnCode
          label="שתי פונקציות 'זהות' הן לא אותו דבר בזיכרון"
          code={`function Parent() {
  // render מס' 1 יוצר פונקציה בכתובת זיכרון A
  // render מס' 2 יוצר פונקציה בכתובת זיכרון B
  const onClick = () => console.log("קליק");
  ...
}

// למרות שהקוד זהה:
// פונקציה-מ-render-1 === פונקציה-מ-render-2  →  false!`}
        />
        <p>
          למי זה מפריע? בעיקר לילד שעטוף ב-<code>memo</code> (
          <Link to="/learn/memo">שיעור 22</Link>). memo משווה props עם{" "}
          <code>===</code>, רואה "פונקציה אחרת" — ומצייר את הילד מחדש. כאילו
          לא שמנו memo בכלל.
        </p>
      </LearnSection>

      <LearnSection title="2. מה useCallback עושה? (משפט אחד)">
        <LearnCallout variant="tip" title="במשפט אחד">
          <code>useCallback</code> אומר ל-React: "תשמור לי את הפונקציה הזאת,
          ובכל render הבא — <strong>תחזיר לי את אותה אחת</strong>, אלא אם
          משהו ב-deps השתנה."
        </LearnCallout>
        <LearnCode
          label="התחביר"
          code={`const onClick = useCallback(() => {
  setSelected(id);
}, []);   // deps ריקים = אותה פונקציה לתמיד

// עכשיו בכל render, onClick הוא *אותו* אובייקט בזיכרון
// → memo של הילד רואה "אותו prop" → מדלג ✓`}
        />
        <LearnCallout variant="info" title="הקשר ל-useMemo">
          זה בדיוק אותו רעיון כמו <Link to="/learn/use-memo">useMemo</Link>,
          רק שבמקום לשמור <strong>תוצאה של חישוב</strong> — שומרים{" "}
          <strong>את הפונקציה עצמה</strong>. למעשה:{" "}
          <code>useCallback(fn, deps)</code> ={" "}
          <code>useMemo(() =&gt; fn, deps)</code>.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="3. תראה את זה בעיניים — דמו חי">
        <div className="learn-demo-box">
          <UseCallbackDemo />
        </div>
        <LearnCallout variant="info" title="תזכורת">
          ב-development, StrictMode מריץ renders פעמיים — אז המספרים יכולים
          לקפוץ בזוגות. תסתכל על ההשוואה בין שני המונים, לא על המספר עצמו.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="4. רגע, מה עם deps?">
        <p>
          כמו ב-useEffect וב-useMemo: כל משתנה מבחוץ שהפונקציה משתמשת בו —
          חייב להופיע ב-deps. אם הוא משתנה, React יוצר פונקציה חדשה (וזה
          נכון! אחרת היא תשתמש בערך ישן):
        </p>
        <LearnCode
          label="deps אמיתיים"
          code={`const onSave = useCallback(() => {
  api.saveMerchant(merchantId, name);   // משתמש ב-2 משתנים מבחוץ
}, [merchantId, name]);                  // → שניהם ב-deps

// טיפ: setState מ-useState תמיד יציב — לא צריך אותו ב-deps.
const onReset = useCallback(() => setCount(0), []);   // תקין ✓`}
        />
      </LearnSection>

      <LearnSection title="5. מתי באמת צריך useCallback?">
        <ul>
          <li>
            <strong>כן</strong> — כשמעבירים פונקציה לילד עטוף ב-
            <code>memo</code>. זה השימוש המרכזי — בלעדיו ה-memo סתם.
          </li>
          <li>
            <strong>כן</strong> — כשהפונקציה נמצאת ב-deps של{" "}
            <code>useEffect</code> (אחרת ה-effect ירוץ בכל render).
          </li>
          <li>
            <strong>לא</strong> — סתם onClick על כפתור רגיל. ליצור פונקציה
            זה זול; useCallback לא "מאיץ" כלום בפני עצמו.
          </li>
        </ul>
        <LearnCallout variant="tip" title="משפט לראיון">
          "useCallback לבד לא חוסך renders — הוא רק שומר reference יציב.
          הוא מקבל ערך כשמישהו משווה את ה-reference הזה: ילד עם memo, או
          deps של effect. לכן הצמד הקבוע הוא memo על הילד + useCallback
          בהורה."
        </LearnCallout>
      </LearnSection>

      <LearnSection title="6. סיכום שלושת הכלים">
        <ul>
          <li>
            <Link to="/learn/memo">memo</Link> — עוטף <strong>ילד</strong>:
            "אל תצייר אותי אם ה-props לא השתנו"
          </li>
          <li>
            <Link to="/learn/use-memo">useMemo</Link> — שומר{" "}
            <strong>תוצאה של חישוב</strong> בין renders
          </li>
          <li>
            <code>useCallback</code> — שומר <strong>פונקציה</strong> בין
            renders (כדי ש-memo של הילד יעבוד)
          </li>
        </ul>
        <p className="mb-0">
          ושלושתם — כלי אופטימיזציה, לא ברירת מחדל. קודם מודדים (React
          DevTools Profiler), אחר כך מייעלים.
        </p>
      </LearnSection>

      <LearnSection title="7. איפה בפרויקט">
        <ul className="learn-files">
          <FileReference
            path="fronted/payplus-wallet/src/pages/learn/UseCallbackLearnPage.tsx"
            description="הדמו החי — memo child עם ובלי useCallback"
          />
          <FileReference
            path="fronted/payplus-wallet/src/pages/learn/MemoLearnPage.tsx"
            description="שיעור memo — הבסיס שהשיעור הזה נשען עליו"
          />
        </ul>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>כל render יוצר פונקציות חדשות בזיכרון → memo של הילד נשבר</li>
          <li>
            <code>useCallback(fn, deps)</code> — מחזיר את אותה פונקציה בין
            renders
          </li>
          <li>שימוש עיקרי: פונקציה שעוברת לילד עם memo, או deps של effect</li>
          <li>useCallback לבד לא חוסך כלום — רק בשילוב עם מי שמשווה reference</li>
          <li>
            <code>useCallback(fn, deps) === useMemo(() =&gt; fn, deps)</code>
          </li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default UseCallbackLearnPage;
