import { useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import FileReference from "../../components/learn/FileReference";
import LearnCallout from "../../components/learn/LearnCallout";
import LearnCode from "../../components/learn/LearnCode";
import LearnSection from "../../components/learn/LearnSection";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";

type Item = { id: number; name: string };

function KeysDemo() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ]);
  const [useIndexKey, setUseIndexKey] = useState(false);

  function prepend() {
    setItems((prev) => [{ id: Date.now(), name: "NEW" }, ...prev]);
  }

  return (
    <Stack gap={2}>
      <Form.Check
        type="switch"
        id="key-mode"
        label={useIndexKey ? "key = index (רע כשמוסיפים בהתחלה)" : "key = id (נכון)"}
        checked={useIndexKey}
        onChange={(e) => setUseIndexKey(e.target.checked)}
      />
      <Button type="button" size="sm" onClick={prepend}>
        הוסף פריט בהתחלה
      </Button>
      <p className="small text-muted mb-0">
        כתוב משהו בשדות, ואז הוסף בהתחלה. עם key=index הטקסט "קופץ" לשורה
        הלא נכונה.
      </p>
      <ul className="list-unstyled mb-0">
        {items.map((item, index) => (
          <li key={useIndexKey ? index : item.id} className="mb-1">
            <Form.Control defaultValue={item.name} size="sm" />
          </li>
        ))}
      </ul>
    </Stack>
  );
}

function ImmutableDemo() {
  const [tags, setTags] = useState(["a", "b"]);
  const [log, setLog] = useState("");

  function badPush() {
    tags.push("x"); // מוטציה!
    setTags(tags); // אותו reference — React עלול לא לרנדר
    setLog("badPush: אותה מערך בזיכרון — לפעמים המסך לא מתעדכן");
  }

  function goodSpread() {
    setTags((prev) => [...prev, "x"]);
    setLog("goodSpread: מערך חדש → React רואה שינוי");
  }

  return (
    <Stack gap={2}>
      <p className="mb-0">
        tags: <code>{JSON.stringify(tags)}</code>
      </p>
      <div className="d-flex gap-2">
        <Button type="button" size="sm" variant="danger" onClick={badPush}>
          שבור: push + setTags(tags)
        </Button>
        <Button type="button" size="sm" variant="success" onClick={goodSpread}>
          נכון: [...prev, "x"]
        </Button>
      </div>
      {log ? <Alert variant="secondary" className="mb-0 py-2 small">{log}</Alert> : null}
    </Stack>
  );
}

function DerivedStateDemo() {
  const [items] = useState([
    { id: 1, active: true },
    { id: 2, active: false },
    { id: 3, active: true },
  ]);

  // נכון — מחושב בכל render, בלי state כפול
  const activeCount = items.filter((i) => i.active).length;

  return (
    <Alert variant="info" className="mb-0">
      מספר פעילים: <strong>{activeCount}</strong> — חושב מ-
      <code>items</code>, בלי <code>useState</code> נפרד ל-count.
    </Alert>
  );
}

function ControlledDemo() {
  const [text, setText] = useState("");

  return (
    <Stack gap={2}>
      <Form.Label className="mb-0">Controlled — value מ-state</Form.Label>
      <Form.Control value={text} onChange={(e) => setText(e.target.value)} />
      <p className="small text-muted mb-0">
        React שולט בערך. אורך: {text.length}
      </p>
      <Form.Label className="mb-0 mt-2">Uncontrolled — defaultValue + ref (רעיון)</Form.Label>
      <Form.Control defaultValue="ברירת מחדל" />
      <p className="small text-muted mb-0">
        הערך חי ב-DOM. קוראים אותו ב-submit עם ref — פחות נפוץ בטפסים שלנו.
      </p>
    </Stack>
  );
}

function StatePatternsLearnPage() {
  return (
    <LearnTopicLayout
      slug="state-patterns"
      objectives={[
        "לעדכן state בלי מוטציה (immutable)",
        "לבחור key נכון ברשימות",
        "להימנע מ-derived state מיותר",
        "להבחין בין Controlled ל-Uncontrolled",
      ]}
    >
      <LearnSection title="1. Immutable updates — אל תשנה את המערך במקום">
        <p>
          React משווה לפי reference (בערך). אם עושים <code>arr.push</code> ואותו
          מערך — לפעמים המסך לא מתעדכן.
        </p>
        <LearnCode
          label="שבור מול נכון"
          code={`// ❌ מוטציה
state.items.push(newItem);
setItems(state.items);

// ✅ עותק חדש
setItems((prev) => [...prev, newItem]);
setMerchant({ ...merchant, name: "x" });`}
        />
        <div className="learn-demo-box">
          <ImmutableDemo />
        </div>
      </LearnSection>

      <LearnSection title="2. Keys ברשימה">
        <p>
          <code>key</code> עוזר ל-React לזהות איזו שורה נשארה / זזה / נמחקה.
        </p>
        <ul>
          <li>
            <strong>טוב:</strong> <code>key=&#123;merchant.id&#125;</code> (יציב
            וייחודי)
          </li>
          <li>
            <strong>רע כשהרשימה משתנה:</strong> <code>key=&#123;index&#125;</code>{" "}
            — state של input "קופץ" בין שורות
          </li>
        </ul>
        <div className="learn-demo-box">
          <KeysDemo />
        </div>
        <LearnCallout variant="tip" title="אצלנו">
          ב-<code>MerchantsPage</code> / שורות — <code>key=&#123;m.id&#125;</code>.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="3. Derived state — מתי לא לעשות useState">
        <p>
          אם אפשר <strong>לחשב</strong> מ-props או מ-state קיים — אל תשמור
          עותק ב-state נוסף. אחרת צריך לסנכרן בשני מקומות וזה באג.
        </p>
        <LearnCode
          label="דוגמה"
          code={`// ❌
const [items, setItems] = useState([...]);
const [activeCount, setActiveCount] = useState(0);
// כל פעם שמשנים items שוכחים לעדכן activeCount

// ✅
const activeCount = items.filter((i) => i.active).length;`}
        />
        <div className="learn-demo-box">
          <DerivedStateDemo />
        </div>
      </LearnSection>

      <LearnSection title="4. Controlled vs Uncontrolled">
        <ul>
          <li>
            <strong>Controlled</strong> — <code>value</code> +{" "}
            <code>onChange</code> + state. React = מקור האמת (הטפסים אצלנו).
          </li>
          <li>
            <strong>Uncontrolled</strong> — <code>defaultValue</code> / ref.
            ה-DOM מחזיק את הערך (קובץ, אינטגרציה פשוטה).
          </li>
        </ul>
        <div className="learn-demo-box">
          <ControlledDemo />
        </div>
      </LearnSection>

      <LearnSection title="5. משפטים לראיון">
        <ul>
          <li>
            "אף פעם לא מוטצים state — תמיד עותק חדש (spread / map / filter)."
          </li>
          <li>
            "key יציב לפי id; index רק לרשימה סטטית שלא משתנה."
          </li>
          <li>
            "Derived state = לחשב, לא לשמור כפול."
          </li>
          <li>
            "טפסים מודרניים — controlled (או RHF שמנהל את זה בשבילך)."
          </li>
        </ul>
      </LearnSection>

      <LearnSection title="6. קבצים">
        <ul className="learn-files">
          <FileReference
            path="fronted/payplus-wallet/src/hooks/useMerchants.ts"
            description="עדכונים אופטימיסטיים — תמיד מחזירים מערך/אובייקט חדש"
          />
          <FileReference
            path="fronted/payplus-wallet/src/components/CreateMerchantForm.tsx"
            description="controlled / RHF"
          />
        </ul>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>Immutable = [...prev] / &#123;...obj&#125; — לא push על אותו מערך</li>
          <li>key = id · לא index כשהרשימה זזה</li>
          <li>Derived = חשב · אל תשכפל ל-state</li>
          <li>Controlled = value מ-React · Uncontrolled = DOM</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default StatePatternsLearnPage;
