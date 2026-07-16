import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import LearnCallout from "../../components/learn/LearnCallout";
import LearnCode from "../../components/learn/LearnCode";
import LearnSection from "../../components/learn/LearnSection";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";

function LayoutEffectDemo() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [effectW, setEffectW] = useState(0);
  const [layoutW, setLayoutW] = useState(0);
  const [tick, setTick] = useState(0);

  useLayoutEffect(() => {
    if (boxRef.current) {
      setLayoutW(boxRef.current.getBoundingClientRect().width);
    }
  }, [tick]);

  useEffect(() => {
    if (boxRef.current) {
      setEffectW(boxRef.current.getBoundingClientRect().width);
    }
  }, [tick]);

  return (
    <Stack gap={2}>
      <div
        ref={boxRef}
        style={{
          width: 120 + (tick % 3) * 40,
          padding: "0.75rem",
          background: "var(--eb-primary-light, #ddd)",
          borderRadius: 8,
        }}
      >
        קופסה (רוחב משתנה)
      </div>
      <Button type="button" size="sm" onClick={() => setTick((t) => t + 1)}>
        שנה רוחב + מדוד
      </Button>
      <p className="small mb-0">
        useLayoutEffect מדד: <strong>{layoutW.toFixed(0)}px</strong>
        <br />
        useEffect מדד: <strong>{effectW.toFixed(0)}px</strong>
      </p>
      <p className="small text-muted mb-0">
        שניהם רואים את ה-DOM אחרי העדכון. ההבדל: Layout רץ{" "}
        <em>לפני</em> שהדפדפן מצייר — מונע הבהוב כשמשנים סגנון לפי מדידה.
      </p>
    </Stack>
  );
}

function UseLayoutEffectLearnPage() {
  return (
    <LearnTopicLayout
      slug="use-layout-effect"
      objectives={[
        "להבדיל בין useEffect ל-useLayoutEffect",
        "לדעת מתי Layout Effect נחוץ (מדידת DOM בלי flicker)",
        "לזכור: ברירת מחדל = useEffect",
      ]}
    >
      <LearnSection title="1. הסדר">
        <LearnCode
          label="אחרי commit ל-DOM"
          code={`1. React מעדכן DOM
2. useLayoutEffect  ← לפני paint (סנכרוני)
3. הדפדפן מצייר (paint)
4. useEffect        ← אחרי paint`}
        />
      </LearnSection>

      <LearnSection title="2. מתי מה">
        <ul>
          <li>
            <strong>useEffect</strong> — fetch, subscriptions, רוב הלוגיקה
            (ברירת מחדל)
          </li>
          <li>
            <strong>useLayoutEffect</strong> — מדידת גודל/מיקום ואז עדכון
            style/scroll <em>לפני</em> שהמשתמש רואה frame ביניים
          </li>
        </ul>
        <LearnCallout variant="warn" title="זהירות">
          Layout Effect חוסם את הציור. שימוש יתר = UI איטי. רק כשיש flicker
          אמיתי.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="3. דמו">
        <div className="learn-demo-box">
          <LayoutEffectDemo />
        </div>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>Effect אחרי paint · Layout לפני paint</li>
          <li>Layout = מדידות DOM בלי הבהוב</li>
          <li>ברירת מחדל תמיד useEffect</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default UseLayoutEffectLearnPage;
