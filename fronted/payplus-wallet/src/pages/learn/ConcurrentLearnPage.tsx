import { useDeferredValue, useMemo, useState, useTransition } from "react";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";
import { Link } from "react-router-dom";
import FileReference from "../../components/learn/FileReference";
import LearnCallout from "../../components/learn/LearnCallout";
import LearnCode from "../../components/learn/LearnCode";
import LearnSection from "../../components/learn/LearnSection";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";

/** רשימה גדולה בכוונה — כדי שהסינון ירגיש כבד */
const BIG = Array.from({ length: 4000 }, (_, i) => `Item ${i}`);

/** סינון איטי בכוונה — מוסיפים עבודה מיותרת כדי לדמות חישוב כבד */
function filterSlow(list: string[], q: string) {
  const needle = q.toLowerCase();
  const result = list.filter((x) => x.toLowerCase().includes(needle));
  // busy work — מאיט את הסינון בכוונה כדי שנרגיש את הבעיה
  for (let i = 0; i < 2_000_000; i++) {
    void i;
  }
  return result.slice(0, 40);
}

/** דמו "הבעיה" — הכל במכה אחת, ההקלדה נתקעת */
function LaggyDemo() {
  const [input, setInput] = useState("");
  const results = useMemo(() => filterSlow(BIG, input), [input]);

  return (
    <Stack gap={2}>
      <Form.Control
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="תקליד מהר — תרגיש קפיצות"
      />
      <p className="small text-muted mb-0">
        כל אות מפעילה סינון כבד <strong>מיד</strong>, וזה חוסם את המסך —
        האותיות מופיעות בעיכוב.
      </p>
      <ul className="small mb-0" style={{ maxHeight: 140, overflow: "auto" }}>
        {results.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
    </Stack>
  );
}

/** דמו הפתרון עם useTransition */
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
          setInput(v); // דחוף — התיבה מתעדכנת מיד
          startTrans(() => {
            setQuery(v); // לא דחוף — הסינון הכבד יכול לחכות
          });
        }}
        placeholder="תקליד מהר — עכשיו חלק"
      />
      {isPending ? (
        <span className="small text-muted">מסנן ברקע...</span>
      ) : (
        <span className="small text-success">מעודכן</span>
      )}
      <ul className="small mb-0" style={{ maxHeight: 140, overflow: "auto" }}>
        {results.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
    </Stack>
  );
}

/** דמו useDeferredValue */
function DeferredDemo() {
  const [input, setInput] = useState("");
  const deferred = useDeferredValue(input);
  const results = useMemo(() => filterSlow(BIG, deferred), [deferred]);
  const isStale = input !== deferred;

  return (
    <Stack gap={2}>
      <Form.Control
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="תקליד מהר — הרשימה מדביקה אחר כך"
      />
      <p className="small text-muted mb-0">
        תיבה: <strong>{input || "—"}</strong> · הרשימה מסננת לפי:{" "}
        <strong>{deferred || "—"}</strong>
        {isStale ? " (עוד רגע מדביקה)" : ""}
      </p>
      <ul
        className="small mb-0"
        style={{ maxHeight: 140, overflow: "auto", opacity: isStale ? 0.5 : 1 }}
      >
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
        "להבין למה הקלדה 'נתקעת' כשיש חישוב כבד על המסך",
        "להבין את הרעיון: לא כל עדכון חייב לקרות מיד",
        "להשתמש ב-useTransition כדי לסמן עדכון כ'יכול לחכות'",
        "להבין מתי useDeferredValue נוח יותר",
      ]}
    >
      <LearnSection title="1. קודם — הבעיה שזה בא לפתור">
        <p>
          ל-React יש חוט (thread) אחד. כשהוא עסוק בעבודה כבדה — לצייר רשימה
          של 4000 פריטים, לסנן, לחשב — הוא <strong>לא יכול לעשות שום דבר
          אחר באותו רגע</strong>. כולל להראות את האות שהרגע הקלדת.
        </p>
        <p>
          התוצאה: אתה מקליד מהר, ובמקום שהאותיות יופיעו מיד — הן קופצות
          בעיכוב, כי React "תפוס" בסינון. תרגיש את זה כאן:
        </p>
        <div className="learn-demo-box">
          <LaggyDemo />
        </div>
        <LearnCallout variant="warn" title="שים לב">
          התיבה והרשימה מתעדכנות <strong>ביחד</strong>, וזאת הבעיה — האות
          שלך מחכה שהסינון הכבד יסתיים.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="2. הרעיון של Concurrent — לא הכל דחוף באותה מידה">
        <p>
          שים לב שיש כאן שני עדכונים שונים לגמרי בחשיבותם:
        </p>
        <ul>
          <li>
            <strong>דחוף:</strong> שהאות שהקלדתי תופיע בתיבה מיד. משתמש חייב
            להרגיש שהמקלדת מגיבה.
          </li>
          <li>
            <strong>יכול לחכות:</strong> שהרשימה למטה תסונן. אם היא תתעדכן
            50ms אחרי — אף אחד לא ישים לב.
          </li>
        </ul>
        <LearnCallout variant="tip" title="הרעיון במשפט אחד">
          Concurrent נותן לך דרך <strong>לסמן חלק מהעדכונים כ"לא דחופים"</strong>
          . React יעדכן קודם את הדחוף (האות), ורק כשיהיה לו רגע פנוי — יעשה
          את הכבד (הסינון). ואם בינתיים הקלדת עוד אות — הוא <strong>יזרוק
          את הסינון הישן</strong> ויתחיל מחדש.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="3. useTransition — הכלי הראשי">
        <p>
          <code>useTransition</code> נותן לך שני דברים: פונקציה{" "}
          <code>startTransition</code> שבתוכה עוטפים את העדכון{" "}
          <strong>הלא-דחוף</strong>, ודגל <code>isPending</code> שאומר "יש
          עדכון כבד שרץ ברקע עכשיו".
        </p>
        <LearnCode
          label="התבנית"
          code={`const [isPending, startTransition] = useTransition();

function onChange(e) {
  const value = e.target.value;

  setInput(value);            // דחוף — התיבה מיד

  startTransition(() => {
    setQuery(value);          // לא דחוף — מפעיל את הסינון הכבד
  });
}`}
        />
        <p>
          שים לב: יש כאן <strong>שני state נפרדים</strong>. <code>input</code>{" "}
          זה מה שרואים בתיבה (מתעדכן מיד), <code>query</code> זה מה שמזין את
          הסינון הכבד (מתעדכן "כשאפשר"). זה הטריק — מפרידים בין מה שהעין
          רואה למה שכבד לחשב.
        </p>
        <div className="learn-demo-box">
          <TransitionDemo />
        </div>
        <LearnCallout variant="info" title="isPending">
          כשהסינון רץ ברקע רואים "מסנן ברקע...". זה מאפשר לך להראות ספינר
          עדין בלי להקפיא את התיבה. תקליד מהר ותרגיש — האותיות חלקות עכשיו.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="4. useDeferredValue — אותו רעיון, פחות קוד">
        <p>
          לפעמים אין לך שני state — יש לך ערך אחד (מה שהוקלד), ואתה רק רוצה
          שהחישוב הכבד <strong>יתבסס על גרסה קצת מאוחרת</strong> שלו.
          במקום לעטוף setState, אתה עוטף את <em>הערך</em>:
        </p>
        <LearnCode
          label="השוואה"
          code={`// עם useTransition: מנהלים 2 state ידנית
const [input, setInput] = useState("");
const [query, setQuery] = useState("");

// עם useDeferredValue: state אחד, React דוחה את ה"עותק" לחישוב
const [input, setInput] = useState("");
const deferred = useDeferredValue(input);   // מפגר קצת אחרי input
const results = filterSlow(BIG, deferred);   // מסנן לפי הגרסה המאוחרת`}
        />
        <p>
          <code>deferred</code> תמיד "רודף" אחרי <code>input</code>: כשמקלידים
          מהר הוא נשאר מעט מאחור, וכשעוצרים הוא מדביק. הרשימה מסננת לפיו —
          אז ההקלדה נשארת חלקה.
        </p>
        <div className="learn-demo-box">
          <DeferredDemo />
        </div>
        <LearnCallout variant="tip" title="מתי מה?">
          <code>useTransition</code> — כשאתה מפעיל את העדכון (יש לך את
          ה-setState ביד). <code>useDeferredValue</code> — כשקיבלת ערך מבחוץ
          (prop / state) ורק רוצה שהחישוב הכבד יפגר אחריו.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="5. מתי כן ומתי לא">
        <ul>
          <li>
            <strong>כן</strong> — חיפוש/סינון על הרבה פריטים, מעבר בין טאבים
            כבדים, UI שמרגיש תקוע בזמן הקלדה.
          </li>
          <li>
            <strong>לא</strong> — לכל <code>setState</code> קטן. אם אין עבודה
            כבדה, זה לא עושה כלום (רק מסבך).
          </li>
          <li>
            <strong>לא תחליף</strong> ל-
            <Link to="/learn/memo">memo</Link> או ל-virtualization ברשימות
            ענקיות באמת — אלה פותרים בעיה אחרת (כמות הציור), Concurrent פותר
            <em> מתי</em> לצייר.
          </li>
        </ul>
      </LearnSection>

      <LearnSection title="6. איפה בפרויקט">
        <ul className="learn-files">
          <FileReference
            path="fronted/payplus-wallet/src/pages/learn/ConcurrentLearnPage.tsx"
            description="שלושת הדמואים של הדף — laggy, transition, deferred"
          />
          <FileReference
            path="fronted/payplus-wallet/src/pages/TransactionsPage.tsx"
            description="דף עם רשימה/סינון — מועמד טבעי אם יגדל מאוד"
          />
        </ul>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>ל-React חוט אחד — עבודה כבדה חוסמת את הקלט (הקלדה נתקעת)</li>
          <li>Concurrent = לסמן חלק מהעדכונים כ"לא דחופים" שיכולים לחכות</li>
          <li>
            <code>useTransition</code> — עוטפים setState כבד ב-
            <code>startTransition</code>; <code>isPending</code> = רץ ברקע
          </li>
          <li>
            <code>useDeferredValue</code> — דוחים <em>ערך</em> שמזין חישוב כבד
          </li>
          <li>רק כשיש עבודה כבדה אמיתית — לא ברירת מחדל</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default ConcurrentLearnPage;
