import { useRef, useState } from "react";
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
  const [items, setItems] = useState([
    { id: 1, name: "סוחר א", active: true },
    { id: 2, name: "סוחר ב", active: false },
    { id: 3, name: "סוחר ג", active: true },
  ]);

  // Derived — לא useState נפרד
  const activeCount = items.filter((i) => i.active).length;
  const inactiveCount = items.length - activeCount;

  return (
    <Stack gap={2}>
      <p className="mb-0 small">
        לחץ על סוחר כדי להפעיל/לכבות. המספרים למטה <strong>מחושבים</strong> —
        אין להם <code>useState</code> משלהם.
      </p>
      <div className="d-flex flex-wrap gap-2">
        {items.map((item) => (
          <Button
            key={item.id}
            type="button"
            size="sm"
            variant={item.active ? "success" : "outline-secondary"}
            onClick={() =>
              setItems((prev) =>
                prev.map((x) =>
                  x.id === item.id ? { ...x, active: !x.active } : x,
                ),
              )
            }
          >
            {item.name} {item.active ? "✓" : "–"}
          </Button>
        ))}
      </div>
      <Alert variant="info" className="mb-0 py-2">
        פעילים: <strong>{activeCount}</strong> · לא פעילים:{" "}
        <strong>{inactiveCount}</strong> · סה״כ: <strong>{items.length}</strong>
      </Alert>
    </Stack>
  );
}

function ControlledDemo() {
  const [text, setText] = useState("");
  const uncontrolledRef = useRef<HTMLInputElement>(null);
  const [uncontrolledRead, setUncontrolledRead] = useState("");

  return (
    <Stack gap={3}>
      <div>
        <p className="fw-semibold mb-1">א) Controlled — React שולט</p>
        <p className="small text-muted mb-2">
          כל אות שאתה מקליד → נשמרת ב-<code>useState</code> → React שם אותה
          חזרה בשדה. לכן אפשר להציג את האורך / לבדוק שגיאות בזמן אמת.
        </p>
        <Form.Control
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="הקלד כאן..."
        />
        <p className="small mb-0 mt-1">
          מה שיש ב-state עכשיו: <strong>&quot;{text}&quot;</strong> (אורך{" "}
          {text.length})
        </p>
      </div>

      <div>
        <p className="fw-semibold mb-1">ב) Uncontrolled — הדפדפן שולט</p>
        <p className="small text-muted mb-2">
          השדה מתנהג כמו HTML רגיל. React לא עוקב אחרי כל אות. רק כשלוחצים
          &quot;קרא ערך&quot; — שואלים את ה-DOM דרך <code>ref</code>.
        </p>
        <Form.Control
          ref={uncontrolledRef}
          defaultValue=""
          placeholder="הקלד כאן (בלי state)..."
        />
        <Button
          type="button"
          size="sm"
          className="mt-2"
          onClick={() =>
            setUncontrolledRead(uncontrolledRef.current?.value ?? "")
          }
        >
          קרא ערך מה-DOM
        </Button>
        <p className="small mb-0 mt-1">
          מה שקראנו עכשיו: <strong>&quot;{uncontrolledRead || "—"}&quot;</strong>
        </p>
      </div>
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

      <LearnSection title="3. Derived state — מתי לא לעשות useState (מאפס)">
        <p>
          <strong>Derived</strong> = ערך שאפשר <em>לחשב</em> ממשהו שכבר יש
          לך. לא צריך לשמור אותו ב-<code>useState</code> נוסף.
        </p>

        <h3 className="learn-section__subtitle">דוגמה מהחיים</h3>
        <p>
          יש לך רשימת סוחרים. אתה רוצה להציג: &quot;יש 3 פעילים&quot;.
        </p>
        <LearnCode
          label="❌ מיותר ומסוכן"
          code={`const [merchants, setMerchants] = useState([...]);
const [activeCount, setActiveCount] = useState(0);

// כל פעם שמוסיפים/מוחקים סוחר — חייבים לזכור גם:
setMerchants(...);
setActiveCount(...); // שוכחים? → המספר על המסך שגוי`}
        />
        <LearnCode
          label="✅ נכון — פשוט לחשב"
          code={`const [merchants, setMerchants] = useState([...]);

// אין state נפרד — מחשבים בכל render:
const activeCount = merchants.filter((m) => m.status === "active").length;

<p>יש {activeCount} פעילים</p>`}
        />
        <p>
          כש-<code>merchants</code> משתנה → הקומפוננטה מתרנדרת →{" "}
          <code>activeCount</code> מחושב מחדש אוטומטית. אין מה לסנכרן.
        </p>

        <LearnCallout variant="info" title="אנלוגיה">
          יש לך תאריך לידה במסמך. גיל = חישוב מהתאריך. לא שומרים &quot;גיל&quot;
          במסמך נפרד — כי אז כל יום הולדת צריך לעדכן שני מקומות.
        </LearnCallout>

        <h3 className="learn-section__subtitle">מתי כן useState?</h3>
        <ul>
          <li>
            מידע שהמשתמש הזין / בחר (טקסט בשדה, טאב פתוח, מודל פתוח)
          </li>
          <li>
            מידע שבא מהשרת ושומרים אחרי fetch (או React Query במקומו)
          </li>
        </ul>
        <p>
          מתי <strong>לא</strong>: סיכומים, סינון פשוט, &quot;האם הרשימה
          ריקה&quot;, שם מלא מ-first+last — כל מה שנובע מנתונים שכבר יש.
        </p>

        <div className="learn-demo-box">
          <DerivedStateDemo />
        </div>
      </LearnSection>

      <LearnSection title="4. Controlled vs Uncontrolled — מאפס">
        <p>
          השאלה פשוטה: <strong>מי מחזיק את מה שכתוב בשדה הקלט?</strong>
        </p>

        <h3 className="learn-section__subtitle">Controlled = React מחזיק</h3>
        <p>
          יש <code>useState</code>. כל פעם שמקלידים אות — קוראים ל-
          <code>setText</code> — ו-React מרנדר שוב עם{" "}
          <code>value=&#123;text&#125;</code>.
        </p>
        <LearnCode
          label="Controlled"
          code={`const [text, setText] = useState("");

<input
  value={text}                          // מה שמוצג = מה שב-state
  onChange={(e) => setText(e.target.value)}  // כל אות → מעדכן state
/>

// עכשיו text תמיד יודע מה כתוב בשדה
// אפשר: if (text.length < 2) showError(...)`}
        />
        <LearnCallout variant="info" title="אנלוגיה">
          כמו מחברת שאתה מעתיק אליה כל מילה מיד. תמיד אפשר לפתוח את המחברת
          ולדעת בדיוק מה כתוב.
        </LearnCallout>

        <h3 className="learn-section__subtitle">Uncontrolled = הדפדפן מחזיק</h3>
        <p>
          בלי <code>value</code> מ-state. השדה עובד כמו HTML רגיל — המשתמש
          מקליד, והערך "חי" בתוך ה-input בדפדפן. React לא יודע מה כתוב עד
          ששואלים במפורש (למשל עם <code>ref</code> בלחיצת Submit).
        </p>
        <LearnCode
          label="Uncontrolled"
          code={`const inputRef = useRef(null);

<input ref={inputRef} defaultValue="" />
//                                    ↑ רק ערך התחלתי, לא מעקב שוטף

function onSubmit() {
  const text = inputRef.current.value; // שואלים את ה-DOM רק עכשיו
}`}
        />
        <LearnCallout variant="info" title="אנלוגיה">
          כמו פתק על השולחן — אתה לא מעתיק כל אות. רק בסוף מרים את הפתק
          וקורא מה כתוב.
        </LearnCallout>

        <div className="learn-demo-box">
          <ControlledDemo />
        </div>

        <h3 className="learn-section__subtitle">מה משתמשים אצלנו?</h3>
        <p>
          כמעט תמיד <strong>Controlled</strong> (או react-hook-form שעושה את
          זה בשבילך) — כי צריך validation, להציג שגיאות, ולשלוח לשרת את מה
          שב-state.
        </p>
        <p>
          Uncontrolled שימושי בעיקר ל-<code>type=&quot;file&quot;</code> או
          כשמשלבים ספרייה ישנה שלא עובדת עם value מ-React.
        </p>
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
            "Controlled = value מ-state + onChange. Uncontrolled = defaultValue
            / ref — קוראים מה-DOM ב-submit."
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
          <li>
            Derived = חשב מ-state קיים (מספר פעילים וכו') · אל תשמור כפול ב-
            useState
          </li>
          <li>
            Controlled = React מחזיק את הטקסט ב-state · Uncontrolled = שואלים
            את ה-DOM בסוף עם ref
          </li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default StatePatternsLearnPage;
