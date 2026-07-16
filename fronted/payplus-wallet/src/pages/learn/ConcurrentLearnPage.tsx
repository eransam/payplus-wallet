import { useDeferredValue, useMemo, useState, useTransition } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import LearnCallout from "../../components/learn/LearnCallout";
import LearnCode from "../../components/learn/LearnCode";
import LearnSection from "../../components/learn/LearnSection";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";

const BIG = Array.from({ length: 4000 }, (_, i) => `Item ${i}`);

function filterSlow(list: string[], q: string) {
  const needle = q.toLowerCase();
  // לולאה כבדה בכוונה
  let result = list.filter((x) => x.toLowerCase().includes(needle));
  for (let i = 0; i < 50_000; i++) {
    // busy work
    void i;
  }
  return result.slice(0, 40);
}

function TransitionDemo() {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [isPending, startTrans] = useTransition();

  const results = useMemo(() => filterSlow(BIG, query), [query]);

  return (
    <Stack gap={2}>
      <Form.Control
        value={input}
        onChange={(e) => {
          const v = e.target.value;
          setInput(v); // דחוף — הקלט מיד
          startTrans(() => {
            setQuery(v); // לא דחוף — הסינון הכבד
          });
        }}
        placeholder="חפש (הקלדה נשארת חלקה)"
      />
      {isPending ? <span className="small text-muted">מסנן...</span> : null}
      <ul className="small mb-0" style={{ maxHeight: 160, overflow: "auto" }}>
        {results.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
    </Stack>
  );
}

function DeferredDemo() {
  const [input, setInput] = useState("");
  const deferred = useDeferredValue(input);
  const results = useMemo(() => filterSlow(BIG, deferred), [deferred]);

  return (
    <Stack gap={2}>
      <Form.Control
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="useDeferredValue"
      />
      <p className="small text-muted mb-0">
        input: {input} · deferred: {deferred}
        {input !== deferred ? " (מסנן עם ערך ישן יותר)" : ""}
      </p>
      <ul className="small mb-0" style={{ maxHeight: 120, overflow: "auto" }}>
        {results.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
    </Stack>
  );
}

function ConcurrentLearnPage() {
  return (
    <LearnTopicLayout
      slug="concurrent"
      objectives={[
        "להבין עדכון דחוף מול לא-דחוף ב-React 18",
        "להשתמש ב-useTransition / startTransition",
        "להכיר useDeferredValue",
      ]}
    >
      <LearnSection title="1. הרעיון">
        <p>
          לפעמים עדכון state גורם לרינדור כבד והקלדה "נתקעת". Concurrent
          מאפשר לסמן חלק מהעבודה כ<strong>לא דחופה</strong>.
        </p>
        <LearnCode
          label="startTransition"
          code={`setInput(value);           // דחוף
startTransition(() => {
  setHeavyResults(value);  // יכול לחכות
});`}
        />
      </LearnSection>

      <LearnSection title="2. useTransition — דמו">
        <div className="learn-demo-box">
          <TransitionDemo />
        </div>
        <LearnCallout variant="info" title="isPending">
          אפשר להציג spinner עדין בזמן שהסינון הכבד רץ.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="3. useDeferredValue">
        <p>
          דוחה את <em>הערך</em> שמשמש לחישוב כבד, בלי לעטוף את{" "}
          <code>setState</code> ב-transition.
        </p>
        <div className="learn-demo-box">
          <DeferredDemo />
        </div>
      </LearnSection>

      <LearnSection title="4. מתי לא">
        <ul>
          <li>לא לכל setState קטן</li>
          <li>לא תחליף ל-memo / virtualization ברשימות ענקיות באמת</li>
          <li>כן — חיפוש, טאבים כבדים, UI שמרגיש תקוע</li>
        </ul>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>דחוף = הקלדה/קליק · לא דחוף = רינדור כבד</li>
          <li>
            <code>useTransition</code> / <code>startTransition</code>
          </li>
          <li>
            <code>useDeferredValue</code> = ערך שמאחר קצת
          </li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default ConcurrentLearnPage;
