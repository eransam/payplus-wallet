import { memo, useCallback, useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import FileReference from "../../components/learn/FileReference";
import LearnCallout from "../../components/learn/LearnCallout";
import LearnCode from "../../components/learn/LearnCode";
import LearnSection from "../../components/learn/LearnSection";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";

type RowProps = {
  label: string;
  onSelect: (label: string) => void;
};

/** בלי memo — כל render של ההורה → גם הילד רץ */
function PlainRow({ label, onSelect }: RowProps) {
  console.log("PlainRow render:", label);
  return (
    <button type="button" className="btn btn-sm btn-outline-secondary me-1" onClick={() => onSelect(label)}>
      {label}
    </button>
  );
}

/** עם memo — רץ שוב רק אם props השתנו */
const MemoRow = memo(function MemoRow({ label, onSelect }: RowProps) {
  console.log("MemoRow render:", label);
  return (
    <button type="button" className="btn btn-sm btn-outline-primary me-1" onClick={() => onSelect(label)}>
      {label}
    </button>
  );
});

function MemoDemo() {
  const [parentTick, setParentTick] = useState(0);
  const [selected, setSelected] = useState("");

  // בלי useCallback — פונקציה חדשה בכל render → memo לא עוזר
  const onSelectUnstable = (label: string) => setSelected(label);

  // עם useCallback — אותה פונקציה בין renders (אם deps לא השתנו)
  const onSelectStable = useCallback((label: string) => {
    setSelected(label);
  }, []);

  return (
    <Stack gap={2}>
      <p className="mb-0 small text-muted">
        לחץ "Re-render הורה" ופתח Console. תראה ש-PlainRow רץ שוב; MemoRow עם
        callback יציב — לא.
      </p>
      <Button type="button" size="sm" onClick={() => setParentTick((t) => t + 1)}>
        Re-render הורה (tick={parentTick})
      </Button>
      <div>
        <span className="small me-2">Plain:</span>
        <PlainRow label="A" onSelect={onSelectUnstable} />
        <PlainRow label="B" onSelect={onSelectUnstable} />
      </div>
      <div>
        <span className="small me-2">Memo + useCallback:</span>
        <MemoRow label="A" onSelect={onSelectStable} />
        <MemoRow label="B" onSelect={onSelectStable} />
      </div>
      <p className="mb-0 small">נבחר: {selected || "—"}</p>
    </Stack>
  );
}

function UseMemoDemo() {
  const [n, setN] = useState(20);
  const [tick, setTick] = useState(0);

  const fib = useMemo(() => {
    console.log("useMemo: מחשב fib");
    function f(x: number): number {
      if (x <= 1) return x;
      return f(x - 1) + f(x - 2);
    }
    return f(n);
  }, [n]);

  return (
    <Stack gap={2}>
      <Form.Label className="mb-0">n לחישוב Fibonacci (כבד בכוונה)</Form.Label>
      <Form.Range min={10} max={35} value={n} onChange={(e) => setN(Number(e.target.value))} />
      <p className="mb-0">
        fib({n}) = <strong>{fib}</strong>
      </p>
      <Button type="button" size="sm" variant="secondary" onClick={() => setTick((t) => t + 1)}>
        Re-render בלי לשנות n (tick={tick})
      </Button>
      <p className="small text-muted mb-0">
        ב-Console: "מחשב fib" מופיע רק כש-n משתנה — לא בכל re-render של ההורה.
      </p>
    </Stack>
  );
}

function PerformanceLearnPage() {
  return (
    <LearnTopicLayout
      slug="performance"
      objectives={[
        "להבין מתי React.memo חוסך re-render של ילד",
        "להבין למה useCallback חשוב יחד עם memo",
        "להבין מתי useMemo שווה ומתי לא",
        "לדעת משפט סניור: לא מממים הכל כברירת מחדל",
      ]}
    >
      <LearnSection title="1. הבעיה בקצרה">
        <p>
          כשהורה עושה re-render — גם הילדים רצים שוב (גם בלי props חדשים).
          בדרך כלל זה בסדר. כשיש ילד כבד / רשימה ארוכה — לפעמים רוצים לדלג.
        </p>
      </LearnSection>

      <LearnSection title="2. React.memo — לדלג על ילד">
        <LearnCode
          label="רעיון"
          code={`const MerchantRow = memo(function MerchantRow({ merchant }) {
  return <tr>...</tr>;
});
// רץ שוב רק אם merchant (או props אחרים) השתנו`}
        />
        <p>
          <code>memo</code> משווה props בצורה שטחית (shallow). אם מעבירים
          אובייקט/פונקציה <em>חדשים</em> בכל render — ה-memo לא עוזר.
        </p>
      </LearnSection>

      <LearnSection title="3. useCallback — פונקציה יציבה">
        <LearnCode
          label="למה צריך"
          code={`// כל render של Parent → onSelect חדש בזיכרון
const onSelect = (id) => setSelected(id);

// יציב בין renders (deps ריקים):
const onSelect = useCallback((id) => setSelected(id), []);`}
        />
        <p>
          בלי <code>useCallback</code>, ילד עטוף ב-<code>memo</code> עדיין
          יתרנדר — כי ה-prop של הפונקציה "השתנה".
        </p>
        <div className="learn-demo-box">
          <MemoDemo />
        </div>
      </LearnSection>

      <LearnSection title="4. useMemo — לזכור תוצאת חישוב">
        <LearnCode
          label="רעיון"
          code={`const filtered = useMemo(
  () => merchants.filter((m) => m.name.includes(q)),
  [merchants, q]
);`}
        />
        <div className="learn-demo-box">
          <UseMemoDemo />
        </div>
        <LearnCallout variant="warn" title="אל תעטוף כל חישוב">
          <code>useMemo</code> עצמו עולה. שווה לחישוב כבד / רשימות גדולות /
          כשצריך reference יציב לאובייקט שמועבר ל-memo child.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="5. משפט לראיון">
        <LearnCallout variant="tip" title="תשובת סניור">
          "memo / useMemo / useCallback הם כלי אופטימיזציה. מודדים קודם
          (Profiler), לא עוטפים את כל האפליקציה. useCallback בעיקר כשמוסרים
          callback לילד מממו. React Compiler מפחית את הצורך הידני."
        </LearnCallout>
      </LearnSection>

      <LearnSection title="6. קשר לפרויקט">
        <ul className="learn-files">
          <FileReference
            path="fronted/payplus-wallet/src/components/MerchantRow.tsx"
            description="שורת טבלה — מועמד טבעי ל-memo אם הרשימה כבדה"
          />
          <FileReference
            path="fronted/payplus-wallet/src/App.tsx"
            description="code splitting — אופטימיזציית טעינה (לא memo)"
          />
          <FileReference
            path="fronted/payplus-wallet/src/pages/learn/ReactInternalsLearnPage.tsx"
            description="מנוע React — מתי re-render קורה בכלל"
          />
        </ul>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>
            <code>memo</code> — דלג על ילד אם props לא השתנו
          </li>
          <li>
            <code>useCallback</code> — אותה פונקציה בין renders (לחבר ל-memo)
          </li>
          <li>
            <code>useMemo</code> — זכור תוצאה כבדה לפי deps
          </li>
          <li>לא כברירת מחדל — רק כשיש עלות אמיתית</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default PerformanceLearnPage;
