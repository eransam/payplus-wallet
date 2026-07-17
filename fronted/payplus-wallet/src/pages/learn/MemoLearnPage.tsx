import { memo, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import { Link } from "react-router-dom";
import FileReference from "../../components/learn/FileReference";
import LearnCallout from "../../components/learn/LearnCallout";
import LearnCode from "../../components/learn/LearnCode";
import LearnSection from "../../components/learn/LearnSection";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";

/**
 * ילד רגיל — בלי memo.
 * בכל פעם שההורה מצטייר מחדש, גם הוא מצטייר מחדש,
 * למרות שה-prop שלו (name) לא השתנה בכלל.
 */
function PlainChild({ name }: { name: string }) {
  const renders = useRef(0);
  renders.current += 1;

  return (
    <div className="border rounded p-2 mb-2 bg-white">
      <strong>ילד רגיל</strong> (name="{name}") — צויר{" "}
      <span className="badge bg-danger">{renders.current}</span> פעמים
    </div>
  );
}

/**
 * אותו ילד בדיוק, עטוף ב-memo.
 * React בודק: ה-props השתנו? לא? אז מדלגים על הציור.
 */
const MemoChild = memo(function MemoChild({ name }: { name: string }) {
  const renders = useRef(0);
  renders.current += 1;

  return (
    <div className="border rounded p-2 mb-2 bg-white">
      <strong>ילד עם memo</strong> (name="{name}") — צויר{" "}
      <span className="badge bg-success">{renders.current}</span> פעמים
    </div>
  );
});

function MemoDemo() {
  const [count, setCount] = useState(0);

  return (
    <Stack gap={2}>
      <p className="mb-0 small text-muted">
        הכפתור משנה state <strong>של ההורה בלבד</strong>. שני הילדים מקבלים
        בדיוק את אותו prop (name="דני") שלא משתנה אף פעם. עכשיו תלחץ כמה
        פעמים ותסתכל על המונים.
      </p>
      <Button type="button" size="sm" onClick={() => setCount((c) => c + 1)}>
        שנה state של ההורה (לחצת {count} פעמים)
      </Button>
      <PlainChild name="דני" />
      <MemoChild name="דני" />
      <p className="mb-0 small text-muted">
        המונה האדום עולה בכל לחיצה — ציור מיותר. הירוק נשאר תקוע — memo חסם
        אותו כי ה-props לא השתנו.
      </p>
    </Stack>
  );
}

function MemoLearnPage() {
  return (
    <LearnTopicLayout
      slug="memo"
      objectives={[
        "להבין מה זה בכלל re-render ולמה ילד מצטייר כשההורה מצטייר",
        "להבין מה memo עושה — במשפט אחד",
        "לראות את ההבדל בעיניים, עם מונה על המסך",
        "לדעת מתי memo לא עובד (וזה מוביל ל-useCallback)",
      ]}
    >
      <LearnSection title="1. רגע, מה זה בכלל render?">
        <p>
          קומפוננטה ב-React היא פונקציה. <strong>render = React מריץ את
          הפונקציה</strong> כדי לדעת מה לצייר על המסך. זהו. כל פעם שאתה רואה
          "הקומפוננטה רינדרה" — הכוונה היא "הפונקציה רצה עוד פעם".
        </p>
        <p>
          מתי React מריץ אותה? כש-<code>state</code> שלה משתנה, או —{" "}
          <strong>כשההורה שלה רץ</strong>.
        </p>
      </LearnSection>

      <LearnSection title="2. הכלל שמפתיע מתחילים">
        <LearnCallout variant="info" title="הכלל">
          כשהורה עושה render — <strong>כל הילדים שלו רצים גם</strong>, אפילו
          אם ה-props שלהם לא השתנו בכלל.
        </LearnCallout>
        <LearnCode
          label="דוגמה"
          code={`function Parent() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(count + 1)}>+</button>
      <Child name="דני" />  {/* name לא משתנה אף פעם... */}
    </>
  );
}
// ...ובכל זאת Child רץ מחדש בכל לחיצה!`}
        />
        <p>
          למה React עושה ככה? כי זה זול. להריץ פונקציה זה מהיר, ו-React ממילא
          משווה בסוף מול ה-DOM ומעדכן רק מה שבאמת השתנה. ברוב המקרים —{" "}
          <strong>זה בסדר גמור ולא צריך לגעת בזה</strong>.
        </p>
      </LearnSection>

      <LearnSection title="3. אז מה זה memo? (משפט אחד)">
        <LearnCallout variant="tip" title="במשפט אחד">
          <code>memo</code> אומר ל-React: "לפני שאתה מריץ את הילד הזה שוב —
          תבדוק אם ה-props שלו השתנו. לא השתנו? <strong>דלג עליו</strong>."
        </LearnCallout>
        <LearnCode
          label="איך עוטפים"
          code={`import { memo } from "react";

const Child = memo(function Child({ name }: { name: string }) {
  return <div>שלום {name}</div>;
});

// זהו. שום דבר אחר לא משתנה — משתמשים ב-<Child /> כרגיל.`}
        />
      </LearnSection>

      <LearnSection title="4. תראה את זה בעיניים — דמו חי">
        <div className="learn-demo-box">
          <MemoDemo />
        </div>
        <LearnCallout variant="info" title="למה המונים קופצים בהתחלה?">
          בפיתוח, <code>StrictMode</code> מריץ כל render פעמיים בכוונה (כדי
          לתפוס באגים). אל תתקע על המספר המדויק — מה שחשוב זה{" "}
          <strong>ההשוואה</strong>: האדום עולה בכל לחיצה, הירוק לא.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="5. מתי memo נשבר?">
        <p>
          <code>memo</code> משווה props בהשוואה <strong>שטחית</strong>{" "}
          (shallow) — בדיוק כמו <code>===</code>. עם טקסט ומספרים זה עובד
          מצוין: <code>"דני" === "דני"</code> זה true.
        </p>
        <p>
          אבל אובייקטים ופונקציות זה סיפור אחר — כל render יוצר{" "}
          <strong>עותק חדש בזיכרון</strong>:
        </p>
        <LearnCode
          label="כאן memo מפסיק לעבוד"
          code={`function Parent() {
  // בכל render של Parent נוצרת פונקציה *חדשה* בזיכרון:
  const onClick = () => console.log("קליק");

  // memo משווה: הפונקציה הישנה === החדשה? לא!
  // אז מבחינתו "ה-props השתנו" → הילד רץ שוב. memo לא עזר.
  return <MemoChild onClick={onClick} />;
}`}
        />
        <LearnCallout variant="warn" title="וזו בדיוק הבעיה שהשיעור הבא-הבא פותר">
          כדי להעביר פונקציה לילד עם memo בלי לשבור אותו — צריך{" "}
          <Link to="/learn/use-callback">useCallback</Link> (שיעור 24). לפני
          זה, בשיעור הבא: <Link to="/learn/use-memo">useMemo</Link> — איך
          לזכור תוצאה של חישוב כבד.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="6. מתי כן ומתי לא?">
        <ul>
          <li>
            <strong>כן</strong> — ילד "כבד" (טבלה גדולה, גרף) שההורה שלו
            מתרנדר הרבה (הקלדה, טיימר).
          </li>
          <li>
            <strong>כן</strong> — שורה ברשימה ארוכה, כשרק שורה אחת משתנה.
          </li>
          <li>
            <strong>לא</strong> — לעטוף כל קומפוננטה "ליתר ביטחון". ההשוואה
            של memo גם עולה משהו, ובקומפוננטות קטנות זה סתם רעש.
          </li>
        </ul>
        <LearnCallout variant="tip" title="משפט לראיון">
          "memo זה כלי אופטימיזציה, לא ברירת מחדל. קודם מודדים ב-Profiler,
          ורק אם ילד כבד מתרנדר סתם — עוטפים."
        </LearnCallout>
      </LearnSection>

      <LearnSection title="7. איפה בפרויקט">
        <ul className="learn-files">
          <FileReference
            path="fronted/payplus-wallet/src/pages/learn/MemoLearnPage.tsx"
            description="הדמו החי של הדף הזה — PlainChild מול MemoChild"
          />
          <FileReference
            path="fronted/payplus-wallet/src/pages/learn/ReactInternalsLearnPage.tsx"
            description="מנוע React — מתי בכלל קורה re-render"
          />
        </ul>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>render = React מריץ את הפונקציה של הקומפוננטה</li>
          <li>הורה מתרנדר → כל הילדים מתרנדרים, גם בלי props חדשים</li>
          <li>
            <code>memo(Child)</code> — "אם ה-props לא השתנו, דלג על הילד"
          </li>
          <li>ההשוואה שטחית — פונקציה/אובייקט חדשים בכל render שוברים אותה</li>
          <li>לא עוטפים הכל — רק ילדים כבדים שמתרנדרים סתם</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default MemoLearnPage;
