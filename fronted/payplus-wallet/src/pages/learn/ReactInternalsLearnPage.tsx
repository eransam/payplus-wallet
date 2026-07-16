import FileReference from "../../components/learn/FileReference";
import LearnCallout from "../../components/learn/LearnCallout";
import LearnCode from "../../components/learn/LearnCode";
import LearnSection from "../../components/learn/LearnSection";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";

function ReactInternalsLearnPage() {
  return (
    <LearnTopicLayout
      slug="react-internals"
      objectives={[
        "להסביר מה זה render ב-React (ולמה זה לא בהכרח שינוי DOM)",
        "לדעת כמה פעמים קומפוננטה רצה ב-mount — כולל Strict Mode",
        "להבין מתי קורה re-render ומה זה Reconciliation",
        "להכיר Concurrent, Suspense, Context pitfalls, Portals",
        "לדעת לומר בקצרה מושגי מפתח ולענות בראיון סניור",
      ]}
    >
      <LearnSection title="1. המודל המנטלי — React לא 'מרנדר את המסך'">
        <p>
          קומפוננטה ב-React היא <strong>פונקציה</strong>. כל פעם ש-React
          קורא לה — זה נקרא <strong>render</strong> (במובן של React).
        </p>
        <LearnCode
          label="Render = קריאה לפונקציה"
          code={`function MerchantsPage() {
  console.log("render"); // כל פעם שהפונקציה רצה
  const [x, setX] = useState(0);
  return <div>{x}</div>;
}`}
        />
        <ul>
          <li>
            <strong>Render</strong> = React מריץ את הפונקציה → מקבל עץ JSX
            (תיאור של UI)
          </li>
          <li>
            <strong>Commit / update DOM</strong> = React משווה למה שהיה, ומעדכן
            ב-DOM <em>רק מה שהשתנה</em>
          </li>
        </ul>
        <LearnCallout variant="tip" title="משפט לראיון">
          "Render ב-React זה חישוב UI (JSX), לא בהכרח כתיבה ל-DOM. הכתיבה
          ל-DOM קורה בשלב ה-commit אחרי reconciliation."
        </LearnCallout>
      </LearnSection>

      <LearnSection title="2. כמה פעמים זה רץ בהתחלה? (Mount)">
        <p>
          בטעינה ראשונה של עמוד: React עושה <strong>mount</strong> — יוצר את
          העץ בפעם הראשונה.
        </p>
        <LearnCode
          label="בפרודקשן (בלי כפילויות)"
          code={`1. createRoot(...).render(<App />)
2. App() רצה פעם אחת (mount)
3. הילדים רצים לפי העץ
4. useEffect רצים אחרי שהמסך נצבע (paint)`}
        />
        <p>
          <strong>אבל אצלנו יש Strict Mode</strong> ב-
          <code>main.tsx</code>:
        </p>
        <LearnCode
          label="main.tsx"
          code={`createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);`}
        />
        <p>
          ב-<strong>development בלבד</strong>, Strict Mode מריץ במכוון חלק
          מהדברים <strong>פעמיים</strong> (mount → unmount מדומה → mount שוב)
          כדי לחשוף באגים: effects בלי cleanup, state לא טהור, וכו'.
        </p>
        <LearnCallout variant="warn" title="למה רואים console.log פעמיים?">
          אם שמת <code>console.log</code> בגוף הקומפוננטה או ב-
          <code>useEffect</code> בלי deps — ב-dev עם Strict Mode זה נפוץ
          לראות <strong>פעמיים</strong>. בפרודקשן build זה פעם אחת. זה לא
          באג שלך — זו התנהגות מכוונת.
        </LearnCallout>
        <LearnCode
          label="תשובה קצרה לראיון"
          code={`ש: כמה פעמים קומפוננטה מתרנדרת בטעינה?
ת: בדרך כלל פעם אחת ב-mount.
    ב-React 18 + Strict Mode ב-dev — עשוי להיראות פעמיים
    כדי לעזור למצוא side effects לא בטוחים.
    בפרודקשן — פעם אחת.`}
        />
      </LearnSection>

      <LearnSection title="3. מתי קורה Re-render?">
        <p>אחרי ה-mount, הפונקציה רצה שוב כש:</p>
        <ol>
          <li>
            <strong>setState / useReducer</strong> באותה קומפוננטה
          </li>
          <li>
            <strong>Props חדשים מההורה</strong> (ההורה עצמו עשה re-render)
          </li>
          <li>
            <strong>Context</strong> שהיא צורכת השתנה (
            <code>useContext</code>)
          </li>
          <li>
            (Redux) ה-selector שלה החזיר ערך חדש → גם גורם ל-re-render
          </li>
        </ol>
        <LearnCallout variant="info" title="מה לא גורם ל-re-render לבד">
          שינוי משתנה רגיל / <code>useRef.current</code> / מוטציה של אובייקט
          בלי <code>setState</code> — React לא יודע שמשהו השתנה, המסך לא
          מתעדכן.
        </LearnCallout>
        <LearnCode
          label="הורה מרנדר → ילדים רצים שוב"
          code={`function Parent() {
  const [n, setN] = useState(0);
  return (
    <>
      <button onClick={() => setN(n + 1)}>+1</button>
      <Child />           {/* גם Child() ירוץ שוב */}
    </>
  );
}

// גם אם Child לא מקבל props!
// (אלא אם עטפת ב-React.memo וה-props לא השתנו)`}
        />
      </LearnSection>

      <LearnSection title="4. Reconciliation — איך React מחליט מה לשנות ב-DOM">
        <p>
          בכל render React מקבל עץ JSX חדש. הוא משווה לעץ הקודם (
          <strong>diff / reconcile</strong>) ומעדכן ב-DOM מינימום שינויים.
        </p>
        <LearnCode
          label="הרעיון"
          code={`Render 1:  <h1>שלום</h1>
Render 2:  <h1>היי</h1>
→ React לא מוחק את כל העמוד — רק מעדכן את הטקסט בתוך h1`}
        />
        <p>
          כללים חשובים בראיון:
        </p>
        <ul>
          <li>
            השוואה לפי <strong>מיקום בעץ + סוג האלמנט</strong> (
            <code>div</code> מול <code>span</code> = החלפה מלאה)
          </li>
          <li>
            ברשימות: <strong>key</strong> יציב עוזר ל-React לזהות איזו שורה
            נשארה / זזה / נמחקה
          </li>
          <li>
            <code>key={`{index}`}</code> ברשימה שמשתנה = באגים נפוצים
            (state "קופץ" בין שורות)
          </li>
        </ul>
        <LearnCode
          label="אצלנו — key נכון"
          code={`{merchants.map((m) => (
  <MerchantRow key={m.id} merchant={m} />
))}`}
        />
      </LearnSection>

      <LearnSection title="5. Fiber — ברמה שסניור צריך">
        <p>
          מאחורי הקלעים React משתמש ב-<strong>Fiber</strong> — ייצוג פנימי של
          כל צומת בעץ, שמאפשר:
        </p>
        <ul>
          <li>
            לעצור / להמשיך עבודת render (interruptible) — UI נשאר רספונסיבי
          </li>
          <li>
            לתעדף עדכונים (למשל הקלדה חשובה יותר מרינדור כבד ברקע)
          </li>
          <li>
            לשמור קשר בין renders (hooks "זוכרים" state לפי סדר הקריאות)
          </li>
        </ul>
        <LearnCallout variant="tip" title="משפט לראיון (בלי להעמיק יותר מדי)">
          "Fiber הוא מודל הפנימי של עץ הקומפוננטות ב-React 16+. הוא מאפשר
          reconciliation הדרגתי ותעדוף עבודה. כמפתחים אנחנו לא נוגעים ב-Fiber
          ישירות — אבל בגללו יש Concurrent features כמו{" "}
          <code>startTransition</code> / <code>useDeferredValue</code>."
        </LearnCallout>
      </LearnSection>

      <LearnSection title="6. Batching — כמה setState, render אחד">
        <p>
          ב-React 18, עדכוני state באירוע (וגם ב-promises / timeouts) בדרך כלל{" "}
          <strong>נארזים יחד</strong> — render אחד בסוף, לא אחד לכל{" "}
          <code>setState</code>.
        </p>
        <LearnCode
          label="דוגמה"
          code={`function onClick() {
  setA(1);
  setB(2);
  setC(3);
  // React 18: בדרך כלל render אחד, לא שלושה
}`}
        />
        <p>
          לכן לא מפחדים מכמה <code>setState</code> באותו handler — זה תקין
          ומצופה.
        </p>
      </LearnSection>

      <LearnSection title="7. סדר החיים — Render מול Effect">
        <LearnCode
          label="סדר בטעינה"
          code={`1. Render   — הפונקציה רצה, JSX מחושב  (סנכרוני)
2. Commit   — עדכון DOM
3. Paint    — הדפדפן מצייר
4. useEffect — רץ אחרי paint (אסינכרוני יחסית ל-UI)

// useLayoutEffect — אחרי DOM, לפני paint (נדיר; למדידות DOM)`}
        />
        <p>
          לכן: <strong>אל תשים side effects בגוף הקומפוננטה</strong> (fetch,
          timers) — רק ב-<code>useEffect</code> / event handlers. גוף הפונקציה
          צריך להיות <strong>טהור</strong> ככל האפשר (אותם props/state → אותו
          JSX).
        </p>
        <LearnCallout variant="warn" title="תלות ב-useEffect">
          <code>useEffect(() =&gt; {"{}"}, [])</code> = פעם אחרי mount
          (וב-Strict Mode dev — פעמיים עם cleanup באמצע). שכחת deps = באגים /
          אזהרות ESLint.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="8. למה Hooks חייבים באותו סדר?">
        <p>
          React שומר state של hooks ב<strong>מערך פנימי לפי סדר הקריאות</strong>
          . לכן אסור:
        </p>
        <LearnCode
          label="אסור"
          code={`if (x) {
  useState(0); // ❌ hook מותנה — סדר משתנה בין renders
}`}
        />
        <p>
          לכן הכלל: Hooks רק בראש הקומפוננטה, לא בתוך if/loops. זה לא "גחמה"
          — זה איך Fiber מקשר בין render ל-render.
        </p>
      </LearnSection>

      <LearnSection title="9. Controlled vs Uncontrolled (בקצרה)">
        <ul>
          <li>
            <strong>Controlled</strong> — הערך מ-<code>useState</code>,{" "}
            <code>onChange</code> מעדכן state (הטפסים אצלנו)
          </li>
          <li>
            <strong>Uncontrolled</strong> — הערך חי ב-DOM, קוראים עם{" "}
            <code>ref</code> (למשל קובץ / אינטגרציה ישנה)
          </li>
        </ul>
        <p>
          סניור יודע מתי כל אחד מתאים — ברוב האפליקציות Controlled +
          validation.
        </p>
      </LearnSection>

      <LearnSection title="10. ביצועים — מתי באמת צריך memo?">
        <p>
          Re-render הוא זול בדרך כלל. מייעלים כשיש <strong>בעיה מדידה</strong>:
        </p>
        <ul>
          <li>
            <code>React.memo</code> — מדלג על render של ילד אם props לא
            השתנו
          </li>
          <li>
            <code>useMemo</code> — זוכר תוצאת חישוב כבד
          </li>
          <li>
            <code>useCallback</code> — זוכר פונקציה (בעיקר כשמוסרים ל-
            <code>memo</code> child)
          </li>
          <li>
            Code splitting (<code>lazy</code>) — פחות JS בטעינה ראשונה (יש
            אצלנו ב-<code>App.tsx</code>)
          </li>
        </ul>
        <LearnCallout variant="tip" title="תשובת סניור">
          "לא עוטפים הכל ב-memo כברירת מחדל. קודם מוצאים bottleneck, אחר כך
          מממים. React Compiler (בפרויקטים חדשים) מפחית את הצורך הידני."
        </LearnCallout>
      </LearnSection>

      <LearnSection title="11. Concurrent — startTransition ו-useDeferredValue">
        <p>
          ב-React 18 אפשר לסמן עדכון כ-<strong>לא דחוף</strong>. UI דחוף
          (הקלדה, לחיצה) נשאר מהיר; רינדור כבד יכול "לחכות".
        </p>
        <LearnCode
          label="startTransition"
          code={`import { startTransition, useState } from "react";

const [input, setInput] = useState("");
const [results, setResults] = useState([]);

function onChange(e) {
  const value = e.target.value;
  setInput(value); // דחוף — הקלט מתעדכן מיד

  startTransition(() => {
    setResults(filterHugeList(value)); // לא דחוף — אפשר לדחות
  });
}`}
        />
        <LearnCode
          label="useDeferredValue"
          code={`const deferredQuery = useDeferredValue(query);
// מראים query מיד ב-input
// מסננים רשימה לפי deferredQuery (מתעדכן קצת אחרי)`}
        />
        <LearnCallout variant="info" title="מתי משתמשים">
          חיפוש על רשימה גדולה, טאב שמחליף תוכן כבד, כל מקום שבו הקלדה
          "נתקעת" בגלל רינדור. לא לכל <code>setState</code>.
        </LearnCallout>
        <p>
          <code>useTransition</code> מחזיר גם{" "}
          <code>isPending</code> — להציג spinner עדין בזמן העדכון הכבד.
        </p>
      </LearnSection>

      <LearnSection title="12. Suspense — מעבר ל-lazy">
        <p>
          אצלנו <code>Suspense</code> עוטף דפים עם <code>lazy()</code> —
          מציג fallback בזמן טעינת JS.
        </p>
        <p>סניור יודע גם את הכיוון הרחב יותר:</p>
        <ul>
          <li>
            <strong>Code splitting</strong> — מה שיש ב-<code>App.tsx</code>
          </li>
          <li>
            <strong>Suspense לנתונים</strong> — קומפוננטה "תולה" בזמן טעינה;
            ההורה מציג fallback (בדרך כלל עם ספרייה / framework שתומך)
          </li>
          <li>
            React Query / frameworks (Next) לעיתים משתמשים בדפוסים דומים
          </li>
        </ul>
        <LearnCode
          label="אצלנו היום"
          code={`<Suspense fallback={<Spinner />}>
  <Routes>...</Routes>
</Suspense>`}
        />
      </LearnSection>

      <LearnSection title="13. Context — מלכודת re-render">
        <p>
          כשערך ה-Provider משתנה — <strong>כל</strong> מי שעושה{" "}
          <code>useContext</code> על אותו Context מתרנדר מחדש, גם אם השתמש
          רק בשדה אחד.
        </p>
        <LearnCode
          label="בעיה נפוצה"
          code={`// value חדש בכל render של ההורה = צרכנים רצים שוב
<AuthContext.Provider value={{ user, login, logout }}>`}
        />
        <LearnCode
          label="כיווני פתרון"
          code={`// 1) לפצל Context (UserContext / AuthActionsContext)
// 2) useMemo על ה-value
// 3) לא לשים ב-Context דברים שמשתנים כל הזמן (עדיף React Query)
// 4) Redux/Zustand ל-UI state גלובלי כשיש הרבה צרכנים`}
        />
        <LearnCallout variant="tip" title="אצלנו">
          Auth ב-Context — הגיוני (משתנה לעיתים רחוקות). רשימת merchants —
          ב-React Query, לא ב-Context.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="14. Portals — לרנדר מחוץ להורה ב-DOM">
        <p>
          <code>createPortal(child, domNode)</code> מרנדר ילדים תחת אלמנט
          DOM אחר (למשל <code>document.body</code>), אבל{" "}
          <strong>עדיין בתוך עץ React</strong> (context, events לפי React).
        </p>
        <p>
          שימוש קלאסי: <strong>Modal / Toast / Tooltip</strong> — בלי בעיות
          <code>overflow: hidden</code> של ההורה.
        </p>
        <LearnCode
          label="רעיון"
          code={`import { createPortal } from "react-dom";

return createPortal(
  <div className="modal">...</div>,
  document.body
);`}
        />
      </LearnSection>

      <LearnSection title="15. אירועים ב-React (Synthetic events)">
        <p>
          React לא שם listener על כל כפתור בנפרד כמו שנדמה — יש{" "}
          <strong>delegation</strong> ברמת השורש (בגרסאות מודרניות). אתה
          כותב <code>onClick</code> ב-JSX; React מנהל מאחורי הקלעים.
        </p>
        <ul>
          <li>
            שמות: <code>onClick</code>, <code>onChange</code> (camelCase)
          </li>
          <li>
            ב-React 17+ האירועים מחוברים ל-root של האפליקציה, לא ל-
            <code>document</code>
          </li>
          <li>
            <code>e.preventDefault()</code> / <code>e.stopPropagation()</code>{" "}
            עובדים כמו ב-DOM
          </li>
        </ul>
        <LearnCallout variant="info" title="משפט לראיון">
          "React משתמש במערכת אירועים משלו מעל ה-DOM — כותבים handlers ב-JSX,
          והספרייה ממפה אותם ביעילות."
        </LearnCallout>
      </LearnSection>

      <LearnSection title="16. Refs מתקדמים — forwardRef ו-imperative handle">
        <p>
          לפעמים ההורה צריך גישה ל-DOM של הילד (פוקוס, scroll). מעבירים ref עם{" "}
          <code>forwardRef</code>.
        </p>
        <LearnCode
          label="רעיון"
          code={`const Input = forwardRef(function Input(props, ref) {
  return <input ref={ref} {...props} />;
});

// ההורה:
const ref = useRef(null);
<Input ref={ref} />;
ref.current?.focus();`}
        />
        <p>
          <code>useImperativeHandle</code> — חושפים API מצומצם להורה (לא את
          כל ה-DOM) — נדיר, אבל שואלים בראיונות סניור.
        </p>
      </LearnSection>

      <LearnSection title="17. Hydration ו-RSC (כללי — אם נוגעים ב-Next)">
        <ul>
          <li>
            <strong>Hydration</strong> — ב-SSR: השרת שולח HTML, React בצד
            לקוח "נצמד" אליו ומוסיף אינטראקטיביות. חוסר התאמה בין HTML ל-
            render בלקוח = hydration warnings.
          </li>
          <li>
            <strong>RSC (React Server Components)</strong> — קומפוננטות שרצות
            בשרת בלי JS ללקוח; מתאים ל-Next.js App Router.
          </li>
        </ul>
        <LearnCallout variant="warn" title="בפרויקט שלנו">
          Vite SPA — אין SSR/RSC כרגע. לדעת את המושגים לראיון; ליישם כשהתפקיד
          על Next.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="18. React Compiler (כיוון מודרני)">
        <p>
          הכלי של React שממסד אוטומטית חלקים מהקומפוננטה — מפחית צורך ידני ב-
          <code>useMemo</code> / <code>useCallback</code> /{" "}
          <code>memo</code>.
        </p>
        <p>
          משפט לראיון: "אני יודע מתי memo ידני עוזר; בפרויקטים עם Compiler
          נשענים עליו יותר וכותבים קוד פשוט יותר."
        </p>
      </LearnSection>

      <LearnSection title="19. טעויות קלאסיות שסניור לא עושה">
        <ul>
          <li>
            מוטציה של state: <code>arr.push(x); setArr(arr)</code> — במקום{" "}
            <code>setArr([...arr, x])</code>
          </li>
          <li>
            <code>key=&#123;index&#125;</code> ברשימה שמשתנה (הוספה/מחיקה/מיון)
          </li>
          <li>
            Derived state מיותר — לשמור ב-state משהו שאפשר לחשב מ-props
          </li>
          <li>
            fetch בגוף הקומפוננטה / בלי abort
          </li>
          <li>
            Context ענק לכל האפליקציה עם ערך שמשתנה כל רגע
          </li>
          <li>
            memo על הכל "בשביל ביצועים" בלי מדידה
          </li>
          <li>
            לשכוח cleanup → זליגת זיכרון (יש שיעור נפרד)
          </li>
        </ul>
      </LearnSection>

      <LearnSection title="20. דברים שכדאי לדעת על React (משפט לכל רעיון)">
        <p>
          רשימה לסניור: כל שורה = מושג + משפט שמסביר אותו. כדאי לדעת לומר
          אותם בראיון בשפה שלך.
        </p>
        <ul>
          <li>
            <strong>JSX</strong> — תחביר שנראה כמו HTML, אבל בסוף זה קריאות
            ל-<code>React.createElement</code> / JS רגיל.
          </li>
          <li>
            <strong>קומפוננטה</strong> — פונקציה שמחזירה תיאור UI; React
            מחליט מתי להריץ אותה שוב.
          </li>
          <li>
            <strong>Render</strong> — הרצת הפונקציה וחישוב JSX, לא בהכרח
            כתיבה ל-DOM.
          </li>
          <li>
            <strong>Commit</strong> — השלב שבו React באמת מעדכן את ה-DOM אחרי
            ההשוואה.
          </li>
          <li>
            <strong>Re-render</strong> — הפונקציה רצה שוב כי state / props /
            context השתנו.
          </li>
          <li>
            <strong>State</strong> — זיכרון פנימי של הקומפוננטה; שינוי דרך
            setState מתזמן עדכון UI.
          </li>
          <li>
            <strong>Props</strong> — קלט מההורה; הילד לא אמור לשנות אותם
            ישירות.
          </li>
          <li>
            <strong>One-way data flow</strong> — נתונים זורמים מלמעלה למטה
            (הורה → ילד); שינויים עולים דרך callbacks.
          </li>
          <li>
            <strong>Reconciliation</strong> — React משווה עץ ישן לחדש ומעדכן
            רק מה שבאמת השתנה.
          </li>
          <li>
            <strong>Virtual DOM / Fiber</strong> — ייצוג פנימי של ה-UI
            בזיכרון שמאפשר diff חכם ותעדוף עבודה.
          </li>
          <li>
            <strong>Keys</strong> — מזהה יציב לפריט ברשימה, כדי ש-React לא
            יבלבל בין שורות כשהרשימה משתנה.
          </li>
          <li>
            <strong>Batching</strong> — כמה עדכוני state באותו תור נארזים
            ל-render אחד בדרך כלל.
          </li>
          <li>
            <strong>Strict Mode</strong> — מצב dev שמכפיל mount/effects כדי
            לחשוף באגים (לא רץ כפול בפרודקשן).
          </li>
          <li>
            <strong>Side effect</strong> — כל דבר שנוגע מחוץ לחישוב UI נקי
            (fetch, timer, DOM) — שייך ל-effect או ל-handler.
          </li>
          <li>
            <strong>useEffect</strong> — מריץ קוד אחרי שהמסך נצבע; תמיד לחשוב
            על cleanup.
          </li>
          <li>
            <strong>Cleanup</strong> — פונקציית return מ-effect שמבטלת timers
            / listeners / abort — מונעת זליגות.
          </li>
          <li>
            <strong>Rules of Hooks</strong> — hooks תמיד באותו סדר בראש
            הקומפוננטה, לא בתוך if.
          </li>
          <li>
            <strong>Controlled input</strong> — ערך השדה מגיע מ-state; React
            הוא מקור האמת.
          </li>
          <li>
            <strong>Lifting state up</strong> — מעבירים state להורה משותף
            כששני ילדים צריכים את אותו נתון.
          </li>
          <li>
            <strong>Composition</strong> — בונים UI מחלקים קטנים (
            <code>children</code>, עטיפות) במקום inheritance.
          </li>
          <li>
            <strong>Context</strong> — דרך להעביר ערך עמוק בעץ בלי prop
            drilling; כל שינוי מרנדר צרכנים.
          </li>
          <li>
            <strong>Server state vs UI state</strong> — נתוני שרת (React
            Query) מול מצב מקומי של מסך (useState / Redux UI).
          </li>
          <li>
            <strong>Memoization</strong> —{" "}
            <code>memo</code> / <code>useMemo</code> / <code>useCallback</code>{" "}
            חוסכים עבודה כשיש עלות אמיתית, לא כברירת מחדל לכל שורה.
          </li>
          <li>
            <strong>Code splitting</strong> — טוענים קוד של דף רק כשנכנסים
            אליו (<code>lazy</code> + <code>Suspense</code>).
          </li>
          <li>
            <strong>Error Boundary</strong> — תופס קריסות ב-render של ילדים
            ומציג UI חלופי במקום מסך לבן.
          </li>
          <li>
            <strong>Concurrent features</strong> —{" "}
            <code>startTransition</code> / <code>useDeferredValue</code>{" "}
            מסמנים עדכון כלא-דחוף כדי לשמור על תחושת UI חלקה.
          </li>
          <li>
            <strong>Immutable updates</strong> — לא מוטצים מערך/אובייקט
            במקום; יוצרים עותק חדש כדי ש-React יזהה שינוי.
          </li>
          <li>
            <strong>Derived state</strong> — אם אפשר לחשב מ-props/state
            קיימים, עדיף לא לשמור עותק כפול ב-state נוסף.
          </li>
          <li>
            <strong>Key remount trick</strong> — שינוי <code>key</code> על
            קומפוננטה מאפס את ה-state שלה (mount מחדש) — כלי חזק כשצריך
            reset.
          </li>
        </ul>
        <LearnCallout variant="tip" title="איך להשתמש בזה בראיון">
          אל תשנן מילה באנגלית בלבד — תגיד את המשפט בעברית/אנגלית במילים
          שלך. אם שואלים "מה זה reconciliation?" → המשפט מהרשימה + דוגמה
          קצרה מהפרויקט (רשימת merchants עם <code>key=&#123;id&#125;</code>).
        </LearnCallout>
      </LearnSection>

      <LearnSection title="21. שאלות ראיון נפוצות — תשובות מוכנות">
        <ol>
          <li>
            <strong>מה ההבדל בין state ל-props?</strong>
            <br />
            Props מבחוץ (הורה), לקריאה. State פנימי, משתנה עם setState וגורם
            ל-re-render.
          </li>
          <li>
            <strong>למה key ברשימה?</strong>
            <br />
            כדי ש-Reconciliation יזהה זהות של פריטים בין renders — במיוחד
            כשמוסיפים/מוחקים/ממיינים.
          </li>
          <li>
            <strong>מה קורה ב-setState?</strong>
            <br />
            מתזמן re-render (לרוב ב-batch). ב-render הבא הפונקציה רצה עם
            state חדש → diff → commit ל-DOM אם צריך.
          </li>
          <li>
            <strong>Virtual DOM?</strong>
            <br />
            תיאור UI בזיכרון (JSX/Fiber). React משווה ומשנה DOM אמיתי
            מינימלית — לא "מחליף את כל העמוד כל פעם".
          </li>
          <li>
            <strong>מה ההבדל בין useEffect ל-useLayoutEffect?</strong>
            <br />
            Effect אחרי paint (רוב המקרים). LayoutEffect לפני paint — כשצריך
            למדוד/לסנכרן DOM בלי הבהוב.
          </li>
          <li>
            <strong>למה fetch ב-useEffect ולא בגוף?</strong>
            <br />
            גוף הקומפוננטה חייב להיות טהור ועלול לרוץ פעמיים (Strict Mode).
            Side effects שייכים ל-effects / handlers.
          </li>
          <li>
            <strong>מה זה startTransition?</strong>
            <br />
            מסמן עדכון state כלא-דחוף כדי שהקלדה/קליקים יישארו חלקים בזמן
            רינדור כבד.
          </li>
          <li>
            <strong>מה הבעיה ב-Context גדול?</strong>
            <br />
            כל שינוי ב-value מרנדר את כל הצרכנים — מפצלים / מממים / שמים
            server state ב-Query.
          </li>
          <li>
            <strong>מה זה Portal?</strong>
            <br />
            רינדור ל-DOM node אחר (למשל body) בלי לצאת מעץ React — למודלים.
          </li>
        </ol>
      </LearnSection>

      <LearnSection title="22. איפה זה בפרויקט שלנו">
        <ul className="learn-files">
          <FileReference
            path="fronted/payplus-wallet/src/main.tsx"
            description="createRoot + StrictMode — למה לפעמים כפול ב-dev"
          />
          <FileReference
            path="fronted/payplus-wallet/src/App.tsx"
            description="lazy/Suspense — פחות עבודה בטעינה ראשונה"
          />
          <FileReference
            path="fronted/payplus-wallet/src/hooks/useMerchants.ts"
            description="server state ב-React Query — פחות useState ידני"
          />
          <FileReference
            path="fronted/payplus-wallet/src/components/MerchantRow.tsx"
            description="ילד ברשימה — key מההורה"
          />
        </ul>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>
            <strong>Render</strong> = קריאה לפונקציה → JSX · לא תמיד שינוי DOM
          </li>
          <li>
            <strong>Mount</strong> ≈ פעם אחת · ב-dev+StrictMode עשוי להיראות
            פעמיים
          </li>
          <li>
            Re-render: state / props / context (ולפעמים Redux selector)
          </li>
          <li>
            <strong>Reconcile</strong> = diff → עדכון מינימלי ·{" "}
            <strong>key</strong> חשוב ברשימות
          </li>
          <li>
            <strong>Batching</strong> = כמה setState → לרוב render אחד
          </li>
          <li>
            Effects אחרי paint · Hooks בסדר קבוע · memo רק כשצריך
          </li>
          <li>
            סעיף 20 = מילון משפטים · סעיפים 11–19 = עומק נוסף לראיון
          </li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default ReactInternalsLearnPage;
