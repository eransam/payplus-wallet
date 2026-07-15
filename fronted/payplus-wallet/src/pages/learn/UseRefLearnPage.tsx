import {
  FocusDemo,
  StateVsRefDemo,
  TimerRefDemo,
} from "../../components/learn/UseRefDemos";
import FileReference from "../../components/learn/FileReference";
import LearnCallout from "../../components/learn/LearnCallout";
import LearnCode from "../../components/learn/LearnCode";
import LearnSection from "../../components/learn/LearnSection";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";

function UseRefLearnPage() {
  return (
    <LearnTopicLayout
      slug="use-ref"
      objectives={[
        "להבין ש-useRef לא גורם ל-render מחדש",
        "לדעת להשתמש ב-ref ל-DOM (focus)",
        "לקשר בין ref, timers וזליגת זיכרון",
      ]}
    >
      <LearnSection title="1. מה זה useRef?">
        <p>
          <code>useRef</code> נותן <strong>קופסה</strong> (<code>ref.current</code>)
          שנשמרת בין renders — ושינוי בה <strong>לא</strong> מרנדר את המסך מחדש.
        </p>
        <LearnCode
          label="בסיס"
          code={`const box = useRef(0);
box.current = 5; // נשמר, המסך לא מתעדכן לבד`}
        />
        <LearnCallout variant="tip" title="מול useState">
          מסך צריך להתעדכן → <code>useState</code>. רק לזכור ערך / לגעת ב-DOM →{" "}
          <code>useRef</code>.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="2. שימוש 1 — DOM">
        <p>
          מחברים את ה-ref ל־input (המאפיין <code>ref</code>), ואז אפשר לקרוא{" "}
          <code>inputRef.current.focus()</code> כמו ב-JS רגיל על הדפדפן.
        </p>
        <div className="learn-demo-box">
          <FocusDemo />
        </div>
      </LearnSection>

      <LearnSection title="3. שימוש 2 — ערך בלי UI">
        <p>
          לחיצה על +1 ל-state מעדכנת מסך מיד. +1 ל-ref משנה זיכרון — המסך זז רק
          אחרי render אחר.
        </p>
        <div className="learn-demo-box">
          <StateVsRefDemo />
        </div>
      </LearnSection>

      <LearnSection title="4. Timers וזליגת זיכרון">
        <p>
          <strong>זליגת זיכרון</strong> = משהו נשאר חי אחרי שכבר לא צריך אותו
          (למשל interval אחרי יציאה מדף). שומרים את ה-id ב-ref ומנקים ב-cleanup.
        </p>
        <div className="learn-demo-box">
          <TimerRefDemo />
        </div>
        <LearnCallout variant="warn" title="חשוב">
          ה-ref עצמו לא מונע זליגה — ה-<code>clearInterval</code> ב-cleanup כן.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="5. קבצים">
        <ul className="learn-files">
          <FileReference path="src/components/learn/UseRefDemos.tsx" description="3 הדמואים" />
        </ul>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>useRef = קופסה יציבה בלי re-render</li>
          <li>DOM + ערכים פנימיים (timer ids)</li>
          <li>תמיד cleanup ל-timers/listeners</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default UseRefLearnPage;
