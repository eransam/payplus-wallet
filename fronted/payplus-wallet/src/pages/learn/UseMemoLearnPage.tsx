import { useMemo, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { Link } from "react-router-dom";
import FileReference from "../../components/learn/FileReference";
import LearnCallout from "../../components/learn/LearnCallout";
import LearnCode from "../../components/learn/LearnCode";
import LearnSection from "../../components/learn/LearnSection";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";

/** חישוב כבד בכוונה — פיבונאצ'י רקורסיבי איטי */
function slowFib(x: number): number {
  if (x <= 1) return x;
  return slowFib(x - 1) + slowFib(x - 2);
}

function WithoutUseMemoDemo() {
  const n = 30;
  const [text, setText] = useState("");

  // בלי useMemo — החישוב הכבד רץ בכל render,
  // כולל render שקרה רק בגלל הקלדה בשדה הטקסט!
  const start = performance.now();
  const result = slowFib(n);
  const ms = (performance.now() - start).toFixed(1);

  return (
    <Stack gap={2}>
      <p className="mb-0 small">
        fib({n}) = <strong>{result}</strong>{" "}
        <span className="badge bg-danger">החישוב לקח {ms}ms</span>
      </p>
      <Form.Label className="mb-0 small">
        עכשיו תקליד כאן משהו — ותרגיש שהמקלדת "נתקעת":
      </Form.Label>
      <Form.Control
        size="sm"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="תקליד מהר..."
      />
      <p className="mb-0 small text-muted">
        כל אות שאתה מקליד = render = החישוב הכבד רץ שוב מאפס, למרות ש-n לא
        השתנה בכלל.
      </p>
    </Stack>
  );
}

function WithUseMemoDemo() {
  const [n, setN] = useState(28);
  const [text, setText] = useState("");
  const computeRuns = useRef(0);

  // עם useMemo — החישוב רץ רק כש-n משתנה.
  // הקלדה בטקסט גורמת ל-render, אבל React מחזיר את התוצאה השמורה.
  const result = useMemo(() => {
    computeRuns.current += 1;
    return slowFib(n);
  }, [n]);

  return (
    <Stack gap={2}>
      <Form.Label className="mb-0 small">n (שנה כדי לחשב מחדש):</Form.Label>
      <Form.Range
        min={20}
        max={33}
        value={n}
        onChange={(e) => setN(Number(e.target.value))}
      />
      <p className="mb-0 small">
        fib({n}) = <strong>{result}</strong>{" "}
        <span className="badge bg-success">
          החישוב רץ {computeRuns.current} פעמים
        </span>
      </p>
      <Form.Control
        size="sm"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="תקליד — המונה הירוק לא זז"
      />
      <p className="mb-0 small text-muted">
        הקלדה עושה render, אבל המונה הירוק לא עולה — useMemo מחזיר את התוצאה
        מהזיכרון. רק הזזת הסליידר (שינוי n) מריצה חישוב.
      </p>
    </Stack>
  );
}

function UseMemoLearnPage() {
  return (
    <LearnTopicLayout
      slug="use-memo"
      objectives={[
        "להבין את הבעיה: חישוב כבד שרץ שוב בכל render בלי סיבה",
        "להבין מה useMemo עושה — במשפט אחד",
        "להרגיש את ההבדל בידיים — הקלדה תקועה מול הקלדה חלקה",
        "לדעת מתי לא להשתמש (רוב הזמן!)",
      ]}
    >
      <LearnSection title="1. הבעיה — במילים פשוטות">
        <p>
          נזכיר מהשיעור הקודם: render = React מריץ את הפונקציה של הקומפוננטה.
          זה אומר ש<strong>כל שורת קוד בגוף הפונקציה רצה שוב</strong> בכל
          render.
        </p>
        <LearnCode
          label="הבעיה"
          code={`function Page() {
  const [search, setSearch] = useState("");

  // החישוב הזה רץ מחדש בכל render —
  // גם כשהמשתמש סתם מקליד בשדה חיפוש אחר לגמרי:
  const report = buildHeavyReport(transactions); // 200ms 😱

  return <input value={search} onChange={...} />;
}`}
        />
        <p>
          אם החישוב זול (חיבור, סינון של 20 פריטים) — לא אכפת לנו. אבל אם הוא
          לוקח עשרות מילישניות — <strong>כל הקלדה תרגיש תקועה</strong>.
        </p>
      </LearnSection>

      <LearnSection title="2. מה useMemo עושה? (משפט אחד)">
        <LearnCallout variant="tip" title="במשפט אחד">
          <code>useMemo</code> אומר ל-React: "תריץ את החישוב הזה{" "}
          <strong>פעם אחת ותשמור את התוצאה</strong>. בכל render הבא — תחזיר
          את מה ששמרת, אלא אם משהו ברשימת התלויות השתנה."
        </LearnCallout>
        <LearnCode
          label="התחביר"
          code={`const report = useMemo(
  () => buildHeavyReport(transactions), // 1. החישוב (פונקציה)
  [transactions]                        // 2. התלויות (deps)
);

// transactions לא השתנה? → מקבלים את התוצאה השמורה, בלי לחשב.
// transactions השתנה?    → מחשבים מחדש ושומרים את החדש.`}
        />
        <p>
          תחשוב על זה כמו פתק על המקרר: "כבר חישבתי את זה, התשובה היא X".
          כל עוד המצרכים (התלויות) לא השתנו — לא מבשלים מחדש.
        </p>
      </LearnSection>

      <LearnSection title="3. תרגיש את זה בידיים — בלי useMemo">
        <p>
          כאן יש חישוב כבד בכוונה (פיבונאצ'י איטי) <strong>בלי</strong>{" "}
          useMemo. תקליד בשדה הטקסט ותרגיש איך כל אות נתקעת:
        </p>
        <div className="learn-demo-box">
          <WithoutUseMemoDemo />
        </div>
      </LearnSection>

      <LearnSection title="4. ועכשיו עם useMemo">
        <p>
          אותו חישוב בדיוק, עטוף ב-useMemo עם התלות <code>[n]</code>. תקליד —
          חלק. תזיז את הסליידר — רק אז מחשבים:
        </p>
        <div className="learn-demo-box">
          <WithUseMemoDemo />
        </div>
      </LearnSection>

      <LearnSection title="5. שימוש שני: reference יציב לאובייקט">
        <p>
          חוץ מחישובים כבדים, יש ל-useMemo עוד תפקיד: כשמעבירים{" "}
          <strong>אובייקט</strong> לילד עטוף ב-<code>memo</code> (מהשיעור
          הקודם):
        </p>
        <LearnCode
          label="בלי useMemo — memo של הילד נשבר"
          code={`// בכל render נוצר אובייקט *חדש* בזיכרון:
const options = { currency: "ILS", locale: "he" };
<MemoChild options={options} />  // memo רואה "prop חדש" בכל פעם

// עם useMemo — אותו אובייקט בדיוק בין renders:
const options = useMemo(
  () => ({ currency: "ILS", locale: "he" }),
  []
);
<MemoChild options={options} />  // memo עובד ✓`}
        />
      </LearnSection>

      <LearnSection title="6. מתי לא להשתמש?">
        <ul>
          <li>
            <strong>חישוב זול</strong> — <code>a + b</code>, סינון רשימה
            קטנה, בניית מחרוזת. useMemo עצמו עולה (שמירת זיכרון + השוואת
            deps), אז עטיפה של דברים זולים רק מסבכת.
          </li>
          <li>
            <strong>"ליתר ביטחון"</strong> — לא. קודם מרגישים/מודדים בעיה,
            אחר כך מייעלים.
          </li>
        </ul>
        <LearnCallout variant="warn" title="כלל אצבע">
          useMemo שווה כשיש: חישוב שבאמת כבד, או אובייקט שחייב reference
          יציב בשביל memo child או בשביל deps של useEffect.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="7. איפה בפרויקט">
        <ul className="learn-files">
          <FileReference
            path="fronted/payplus-wallet/src/pages/learn/UseMemoLearnPage.tsx"
            description="שני הדמואים של הדף הזה — עם ובלי useMemo"
          />
          <FileReference
            path="fronted/payplus-wallet/src/hooks/useMerchants.ts"
            description="נתוני שרת — React Query כבר עושה שם cache, לא צריך useMemo"
          />
        </ul>
        <p className="mt-2 mb-0">
          המשך: <Link to="/learn/use-callback">useCallback</Link> — אותו
          רעיון בדיוק, אבל לפונקציות.
        </p>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>כל הקוד בגוף הקומפוננטה רץ שוב בכל render</li>
          <li>
            <code>useMemo(fn, deps)</code> — שומר את התוצאה, מחשב מחדש רק
            כש-deps משתנים
          </li>
          <li>שימוש 1: חישוב כבד באמת</li>
          <li>שימוש 2: reference יציב לאובייקט (בשביל memo child)</li>
          <li>לא עוטפים חישובים זולים — useMemo עצמו עולה</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default UseMemoLearnPage;
