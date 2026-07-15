import { useEffect, useRef, useState } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Stack from "react-bootstrap/Stack";

/** דמו 1: גישה ל-DOM — פוקוס על input */
export function FocusDemo() {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Stack gap={2}>
      <Form.Control ref={inputRef} type="text" placeholder="לחץ על הכפתור → פוקוס לכאן" />
      <Button type="button" onClick={() => inputRef.current?.focus()}>
        שים פוקוס בשדה
      </Button>
      <p className="text-muted small mb-0">
        <code>inputRef.current</code> מצביע על אלמנט ה-DOM האמיתי.
      </p>
    </Stack>
  );
}

/** דמו 2: state מול ref — מה מעדכן את המסך */
export function StateVsRefDemo() {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const [, forceRender] = useState(0);

  function bumpState() {
    setCount((c) => c + 1);
  }

  function bumpRef() {
    countRef.current += 1;
  }

  function showRefOnScreen() {
    // רק כדי לראות את ערך ה-ref — render יזום
    forceRender((n) => n + 1);
  }

  return (
    <Stack gap={2}>
      <Alert variant="secondary" className="mb-0">
        <div>
          <strong>useState count:</strong> {count}
        </div>
        <div>
          <strong>useRef countRef.current:</strong> {countRef.current}
        </div>
      </Alert>
      <Stack direction="horizontal" gap={2} className="flex-wrap">
        <Button type="button" onClick={bumpState}>
          +1 ל-state
        </Button>
        <Button type="button" variant="outline-primary" onClick={bumpRef}>
          +1 ל-ref
        </Button>
        <Button type="button" variant="outline-secondary" onClick={showRefOnScreen}>
          רענן תצוגה (כדי לראות את ה-ref)
        </Button>
      </Stack>
      <p className="text-muted small mb-0">
        +1 ל-state מעדכן מסך מיד. +1 ל-ref משנה ערך בזיכרון — המסך לא זז עד
        render אחר.
      </p>
    </Stack>
  );
}

/** דמו 3: timer ב-ref + cleanup (מונע זליגה) */
export function TimerRefDemo() {
  const [ticks, setTicks] = useState(0);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  function start() {
    if (intervalRef.current !== null) {
      return;
    }
    setRunning(true);
    intervalRef.current = window.setInterval(() => {
      setTicks((t) => t + 1);
    }, 500);
  }

  function stop() {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setRunning(false);
  }

  function reset() {
    stop();
    setTicks(0);
  }

  return (
    <Stack gap={2}>
      <Alert variant={running ? "success" : "light"} className="mb-0">
        ticks: <strong>{ticks}</strong> {running ? "(רץ)" : "(עצור)"}
      </Alert>
      <Stack direction="horizontal" gap={2} className="flex-wrap">
        <Button type="button" onClick={start} disabled={running}>
          התחל
        </Button>
        <Button type="button" variant="outline-danger" onClick={stop} disabled={!running}>
          עצור
        </Button>
        <Button type="button" variant="outline-secondary" onClick={reset}>
          איפוס
        </Button>
      </Stack>
      <p className="text-muted small mb-0">
        ה-id של האינטרוול נשמר ב-<code>intervalRef</code>. ב-cleanup של{" "}
        <code>useEffect</code> וגם ב-Stop — מנקים אותו (מונע זליגת זיכרון).
      </p>
    </Stack>
  );
}
