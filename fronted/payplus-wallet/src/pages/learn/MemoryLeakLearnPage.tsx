import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import FileReference from "../../components/learn/FileReference";
import LearnCallout from "../../components/learn/LearnCallout";
import LearnCode from "../../components/learn/LearnCode";
import LearnSection from "../../components/learn/LearnSection";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";

/** דמו: interval בלי cleanup — ממשיך אחרי "יציאה" מדומה */
function LeakDemo() {
  const [inside, setInside] = useState(true);
  const [ticks, setTicks] = useState(0);
  const [log, setLog] = useState<string[]>([]);

  function pushLog(msg: string) {
    setLog((prev) => [`${new Date().toLocaleTimeString()} — ${msg}`, ...prev].slice(0, 6));
  }

  return (
    <Stack gap={3}>
      <div className="d-flex gap-2 flex-wrap">
        <Button
          type="button"
          variant={inside ? "outline-danger" : "success"}
          onClick={() => {
            setInside((v) => !v);
            pushLog(inside ? "יצאנו מהדף (unmount מדומה)" : "חזרנו לדף (mount)");
          }}
        >
          {inside ? "צא מהדף (unmount)" : "חזור לדף (mount)"}
        </Button>
      </div>

      {inside ? (
        <LeakyChild
          onTick={() => {
            setTicks((t) => t + 1);
            pushLog("tick מ-interval (אם רואים אחרי יציאה = זליגה)");
          }}
        />
      ) : (
        <Alert variant="secondary" className="mb-0">
          הקומפוננטה לא מורכבת. אם עדיין מתווספים ticks — יש זליגה.
        </Alert>
      )}

      <p className="mb-0">
        מונה ticks: <strong>{ticks}</strong>
      </p>
      <ul className="small text-muted mb-0">
        {log.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
    </Stack>
  );
}

function LeakyChild({ onTick }: { onTick: () => void }) {
  const onTickRef = useRef(onTick);
  onTickRef.current = onTick;

  useEffect(() => {
    // בכוונה בלי clearInterval — להדגים זליגה
    const id = window.setInterval(() => {
      onTickRef.current();
    }, 1000);
    return () => {
      // אם תמחק את השורה הבאה — הזליגה תמשיך אחרי unmount
      window.clearInterval(id);
    };
  }, []);

  return (
    <Alert variant="info" className="mb-0">
      קומפוננטה חיה — interval רץ. ב-cleanup יש <code>clearInterval</code> (הגרסה
      הנכונה). כדי לראות זליגה אמיתית תסיר זמנית את ה-cleanup בקוד הדמו.
    </Alert>
  );
}

/** דמו: גרסה עם באג — בלי cleanup */
function LeakBrokenDemo() {
  const [inside, setInside] = useState(true);
  const [ticks, setTicks] = useState(0);

  return (
    <Stack gap={2}>
      <Button type="button" variant="warning" onClick={() => setInside((v) => !v)}>
        {inside ? "Unmount (בלי cleanup בדמו השבור)" : "Mount שוב"}
      </Button>
      <p className="small text-muted mb-0">
        אחרי Unmount — אם המונה ממשיך לעלות, זה זליגה + setState על קומפוננטה מתה.
      </p>
      <p className="mb-0">
        ticks: <strong>{ticks}</strong>
      </p>
      {inside ? <BrokenInterval onTick={() => setTicks((t) => t + 1)} /> : null}
    </Stack>
  );
}

function BrokenInterval({ onTick }: { onTick: () => void }) {
  const onTickRef = useRef(onTick);
  onTickRef.current = onTick;

  useEffect(() => {
    const id = window.setInterval(() => {
      onTickRef.current();
    }, 1000);
    // אין return cleanup בכוונה
    void id;
  }, []);

  return <Alert variant="danger" className="mb-0">Interval בלי cleanup פעיל</Alert>;
}

function MemoryLeakLearnPage() {
  return (
    <LearnTopicLayout
      slug="memory-leaks"
      objectives={[
        "להגדיר מהי זליגת זיכרון ב-React ובדפדפן",
        "לזהות מקורות נפוצים: timers, listeners, subscriptions, fetch",
        "לכתוב cleanup נכון ב-useEffect",
        "להבין את הקשר ל-Strict Mode ול-setState אחרי unmount",
      ]}
    >
      <LearnSection title="1. מה זה זליגת זיכרון? (בפשטות)">
        <p>
          <strong>זליגת זיכרון (Memory Leak)</strong> = משהו נשאר{" "}
          <em>חי בזיכרון</em> אחרי שכבר לא צריכים אותו — והאפליקציה לא משחררת
          אותו.
        </p>
        <p>ב-React זה לרוב נשמע כך:</p>
        <ul>
          <li>יצאת מדף → הקומפוננטה אמורה להיעלם (unmount)</li>
          <li>
            אבל <code>setInterval</code> / listener / subscription ממשיכים
            לרוץ
          </li>
          <li>
            לפעמים גם מנסים <code>setState</code> על קומפוננטה שכבר לא קיימת
            (אזהרות / באגים)
          </li>
        </ul>
        <LearnCallout variant="info" title="אנלוגיה">
          כמו לצאת מהבית ולהשאיר ברז פתוח + רדיו דולק. אתה כבר לא בבית —
          אבל המשאבים עדיין רצים.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="2. למה זה קורה ב-React?">
        <p>
          React <strong>לא מכבה אוטומטית</strong> timers ו-listeners שאתה
          פתחת. הוא רק מפרק את הקומפוננטה מהעץ. מה שפתחת ב-
          <code>useEffect</code> — אתה חייב לסגור ב-<strong>cleanup</strong>.
        </p>
        <LearnCode
          label="התבנית הנכונה"
          code={`useEffect(() => {
  // setup — מה שפותחים
  const id = setInterval(() => { ... }, 1000);
  window.addEventListener("resize", onResize);

  return () => {
    // cleanup — מה שסוגרים (חובה!)
    clearInterval(id);
    window.removeEventListener("resize", onResize);
  };
}, []);`}
        />
        <p>
          ה-cleanup רץ כשהקומפוננטה עושה unmount, ולפני ש-effect רץ שוב (כש-
          deps משתנים). ב-Strict Mode (dev) הוא גם רץ באמצע כדי לבדוק שכתבת
          cleanup טוב.
        </p>
      </LearnSection>

      <LearnSection title="3. מקורות הזליגה הנפוצים ביותר">
        <h3 className="learn-section__subtitle">3.1 Timers</h3>
        <LearnCode
          label="שבור"
          code={`useEffect(() => {
  setInterval(() => setCount((c) => c + 1), 1000);
  // אין clearInterval → ממשיך אחרי יציאה מהדף
}, []);`}
        />
        <LearnCode
          label="מתוקן"
          code={`useEffect(() => {
  const id = setInterval(() => setCount((c) => c + 1), 1000);
  return () => clearInterval(id);
}, []);`}
        />

        <h3 className="learn-section__subtitle">3.2 Event listeners</h3>
        <LearnCode
          label="window / document"
          code={`useEffect(() => {
  const onScroll = () => { ... };
  window.addEventListener("scroll", onScroll);
  return () => window.removeEventListener("scroll", onScroll);
}, []);`}
        />

        <h3 className="learn-section__subtitle">3.3 Fetch בלי ביטול</h3>
        <p>
          הבקשה יכולה לחזור אחרי שיצאת מהדף → <code>setState</code> על
          קומפוננטה מתה. פתרון: <code>AbortController</code>.
        </p>
        <LearnCode
          label="דפוס נכון"
          code={`useEffect(() => {
  const ac = new AbortController();

  fetch("/api/merchants", { signal: ac.signal })
    .then((r) => r.json())
    .then((data) => setMerchants(data))
    .catch((err) => {
      if (err.name === "AbortError") return; // יציאה מהדף — לא שגיאה
      setError(err);
    });

  return () => ac.abort();
}, []);`}
        />
        <LearnCallout variant="tip" title="אצלנו">
          עם <strong>React Query</strong> הביטול/cache מנוהלים יותר טוב —
          עדיין חשוב לא לכתוב fetch ידני בלי abort כשכן כותבים.
        </LearnCallout>

        <h3 className="learn-section__subtitle">3.4 Subscriptions</h3>
        <p>
          WebSocket, Redux store.subscribe ישן, observers — תמיד{" "}
          <code>unsubscribe</code> ב-cleanup.
        </p>

        <h3 className="learn-section__subtitle">3.5 Closures ששומרות DOM / אובייקטים גדולים</h3>
        <p>
          פחות נפוץ ליום־יום, אבל: אל תשמור במשתנה גלובלי / מערך סטטי הפניות
          לקומפוננטות או לאלמנטי DOM אחרי unmount.
        </p>
      </LearnSection>

      <LearnSection title="4. דמו חי — Mount / Unmount">
        <p>
          לחץ Unmount. בגרסה <strong>התקינה</strong> המונה אמור להפסיק. בגרסה{" "}
          <strong>השבורה</strong> — ממשיך (זליגה).
        </p>
        <p className="fw-semibold mb-2">גרסה תקינה (עם clearInterval ב-cleanup)</p>
        <div className="learn-demo-box">
          <LeakDemo />
        </div>
        <p className="fw-semibold mb-2 mt-3">
          גרסה שבורה (בלי cleanup) — זהירות, מריץ interval
        </p>
        <div className="learn-demo-box">
          <LeakBrokenDemo />
        </div>
        <LearnCallout variant="warn" title="אחרי הניסוי">
          אם ניסית את הדמו השבור — לחץ Mount שוב או רענן את הדף כדי לא
          להשאיר intervals ברקע.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="5. setState אחרי unmount — למה מזהירים">
        <p>
          אם timer/fetch קוראים ל-<code>setState</code> אחרי שהקומפוננטה
          ירדה מהעץ:
        </p>
        <ul>
          <li>בגרסאות ישנות — אזהרה בקונסול</li>
          <li>
            תמיד = עבודה מיותרת + סימן שיש resource שלא נוקה
          </li>
        </ul>
        <p>
          הפתרון הוא לא "לדחוף if (mounted)" בכל מקום כברירת מחדל — אלא{" "}
          <strong>לבטל את המקור</strong> (clear / abort / unsubscribe). דגל{" "}
          <code>let cancelled = false</code> ב-cleanup הוא גיבוי סביר ל-fetch
          ישן.
        </p>
        <LearnCode
          label="דפוס cancelled (גיבוי)"
          code={`useEffect(() => {
  let cancelled = false;
  load().then((data) => {
    if (!cancelled) setData(data);
  });
  return () => {
    cancelled = true;
  };
}, []);`}
        />
      </LearnSection>

      <LearnSection title="6. Strict Mode וזליגות">
        <p>
          ב-dev, Strict Mode מריץ effect → cleanup → effect שוב. אם שכחת
          cleanup, תראה כפילויות מוזרות (שני intervals). זה <em>עוזר</em>{" "}
          לגלות זליגות מוקדם.
        </p>
        <LearnCallout variant="info" title="משפט לראיון">
          "זליגת זיכרון ב-SPA קורה כשמשאירים timers/listeners/subscriptions
          אחרי unmount. ב-React מנקים ב-cleanup של useEffect. Strict Mode
          ב-dev מדגיש cleanup חסר."
        </LearnCallout>
      </LearnSection>

      <LearnSection title="7. איך תופסים זליגה בפועל">
        <ol>
          <li>
            Chrome DevTools → <strong>Memory</strong> / Performance —
            heap snapshot לפני/אחרי ניווט
          </li>
          <li>
            קונסול: האם logs ממשיכים אחרי יציאה מדף?
          </li>
          <li>
            React DevTools: האם הקומפוננטה באמת unmounted?
          </li>
          <li>
            קוד: חפש <code>setInterval</code>, <code>addEventListener</code>,{" "}
            <code>subscribe</code> בלי <code>return () =&gt;</code>
          </li>
        </ol>
      </LearnSection>

      <LearnSection title="8. קשר ל-useRef">
        <p>
          <code>useRef</code> שומר id של interval בלי לגרום ל-re-render — אבל{" "}
          <strong>לא מחליף cleanup</strong>. עדיין חייבים{" "}
          <code>clearInterval</code>.
        </p>
        <p>
          פירוט על ref: שיעור <Link to="/learn/use-ref">useRef</Link>.
        </p>
      </LearnSection>

      <LearnSection title="9. צ׳קליסט סניור">
        <ul>
          <li>כל <code>setInterval</code> / <code>setTimeout</code> → clear</li>
          <li>כל <code>addEventListener</code> → remove</li>
          <li>כל fetch ארוך → AbortController</li>
          <li>כל subscribe → unsubscribe</li>
          <li>לא לשמור refs ל-DOM במשתנים גלובליים</li>
          <li>לבדוק אחרי ניווט בין דפים שהרעש בקונסול נעצר</li>
        </ul>
      </LearnSection>

      <LearnSection title="10. קבצים רלוונטיים">
        <ul className="learn-files">
          <FileReference
            path="fronted/payplus-wallet/src/main.tsx"
            description="Strict Mode — חושף cleanup חסר ב-dev"
          />
          <FileReference
            path="fronted/payplus-wallet/src/pages/learn/UseRefLearnPage.tsx"
            description="קשר בין ref ל-timers"
          />
          <FileReference
            path="fronted/payplus-wallet/src/hooks/useMerchants.ts"
            description="React Query — פחות fetch ידני / פחות זליגות קלאסיות"
          />
        </ul>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>
            זליגה = resource חי אחרי שכבר לא צריך אותו
          </li>
          <li>
            ב-React: פותחים ב-effect → סוגרים ב-<strong>cleanup</strong>
          </li>
          <li>
            נפוץ: interval, listener, fetch, websocket
          </li>
          <li>
            Abort / clear / unsubscribe — לא רק "if mounted"
          </li>
          <li>
            Strict Mode ב-dev עוזר לתפוס את זה מוקדם
          </li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default MemoryLeakLearnPage;
