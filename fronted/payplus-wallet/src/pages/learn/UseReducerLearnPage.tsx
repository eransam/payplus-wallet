import { useReducer } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import FileReference from "../../components/learn/FileReference";
import LearnCallout from "../../components/learn/LearnCallout";
import LearnCode from "../../components/learn/LearnCode";
import LearnSection from "../../components/learn/LearnSection";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";

type CounterAction = { type: "plus" } | { type: "minus" } | { type: "reset" };

function counterReducer(state: number, action: CounterAction): number {
  if (action.type === "plus") return state + 1;
  if (action.type === "minus") return state - 1;
  if (action.type === "reset") return 0;
  return state;
}

function CounterDemo() {
  const [count, dispatch] = useReducer(counterReducer, 0);

  return (
    <Stack gap={2}>
      <p className="mb-0 fs-4">
        count: <strong>{count}</strong>
      </p>
      <div className="d-flex gap-2 flex-wrap">
        <Button type="button" onClick={() => dispatch({ type: "plus" })}>
          + plus
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => dispatch({ type: "minus" })}
        >
          − minus
        </Button>
        <Button
          type="button"
          variant="outline-secondary"
          onClick={() => dispatch({ type: "reset" })}
        >
          reset
        </Button>
      </div>
      <p className="small text-muted mb-0">
        כל לחיצה עושה <code>dispatch(&#123; type: "..." &#125;)</code> — ה-reducer
        מחשב את המספר החדש.
      </p>
    </Stack>
  );
}

function UseReducerLearnPage() {
  return (
    <LearnTopicLayout
      slug="use-reducer"
      objectives={[
        "להבין ש-useReducer הוא של React (לא Redux)",
        "להשוות ל-useState בשפה פשוטה",
        "לדעת מה זה state, action, reducer, dispatch",
        "לדעת מתי useState מספיק ומתי useReducer עוזר",
      ]}
    >
      <LearnSection title="1. מאפס — מה זה?">
        <p>
          <strong>useReducer</strong> = עוד דרך של React לנהל state בקומפוננטה,
          כמו <code>useState</code>, רק בתחביר אחר.
        </p>
        <LearnCallout variant="warn" title="לא Redux">
          השם מבלבל כי גם ב-Redux יש "reducer". אבל{" "}
          <code>useReducer</code> מגיע מ-<strong>React עצמו</strong>. Redux =
          ספרייה נפרדת ל-store גלובלי (יש אצלנו שיעור Redux נפרד).
        </LearnCallout>
      </LearnSection>

      <LearnSection title="2. מה שאתה כבר מכיר: useState">
        <LearnCode
          label="מונה עם useState"
          code={`const [count, setCount] = useState(0);

setCount(count + 1);  // כפתור +
setCount(count - 1);  // כפתור −`}
        />
        <p>
          אתה אומר ל-React <strong>ישירות</strong>: "שים את המספר החדש".
        </p>
      </LearnSection>

      <LearnSection title="3. אותו דבר עם useReducer — 3 חלקים">
        <h3 className="learn-section__subtitle">א׳ — חוקים (ה-reducer)</h3>
        <p>
          זו פונקציה רגילה. היא לא רצה לבד — React קורא לה כשעושים{" "}
          <code>dispatch</code>.
        </p>
        <LearnCode
          label="reducer = טבלת חוקים"
          code={`function reducer(state, action) {
  // state  = המספר הנוכחי (למשל 5)
  // action = מה רוצים לעשות (למשל { type: "plus" })

  if (action.type === "plus") return state + 1;
  if (action.type === "minus") return state - 1;
  return state; // לא מכיר → אל תשנה
}`}
        />

        <h3 className="learn-section__subtitle">ב׳ — חיבור ל-React</h3>
        <LearnCode
          label="כמעט כמו useState"
          code={`const [count, dispatch] = useReducer(reducer, 0);
//     ↑       ↑                    ↑        ↑
//   הערך   במקום setCount      החוקים   התחלה`}
        />
        <p>
          אותו רעיון: ערך על המסך + פונקציה שמשנה אותו. רק שבמקום{" "}
          <code>setCount</code> יש <code>dispatch</code>.
        </p>
        <LearnCode
          label="השוואת שמות"
          code={`useState:    const [count, setCount]  = useState(0);
useReducer:  const [count, dispatch]  = useReducer(reducer, 0);`}
        />

        <h3 className="learn-section__subtitle">ג׳ — מה קורה בלחיצה</h3>
        <LearnCode
          label="dispatch"
          code={`dispatch({ type: "plus" });`}
        />
        <p>React עושה מאחורי הקלעים:</p>
        <LearnCode
          label="הסיפור"
          code={`1. לוקח count נוכחי (למשל 0)
2. לוקח את מה ששלחת: { type: "plus" }
3. קורא: reducer(0, { type: "plus" })
4. ה-reducer מחזיר 1
5. count נהיה 1 → המסך מתעדכן`}
        />
        <LearnCode
          label="בקיצור"
          code={`dispatch({ type: "plus" })
    ↓
reducer(0, { type: "plus" })  →  1
    ↓
count = 1`}
        />
      </LearnSection>

      <LearnSection title="4. השוואה בשורה אחת">
        <LearnCode
          label="אותה תוצאה"
          code={`// useState — אתה מחשב את הערך החדש:
setCount(count + 1);

// useReducer — אתה רק אומר "plus", ה-reducer מחשב:
dispatch({ type: "plus" });`}
        />
        <p>
          <code>&#123; type: "plus" &#125;</code> זה אובייקט JS רגיל — לא קסם.
          אפשר לקרוא גם <code>type: "הוסף"</code> אם תרצה.
        </p>
      </LearnSection>

      <LearnSection title="5. אנלוגיה">
        <ul>
          <li>
            <strong>useState</strong> = אתה מחליט: "שים 5 במגירה"
          </li>
          <li>
            <strong>useReducer</strong> = אתה אומר לקופאי "פלוס אחד" — והקופאי
            (ה-reducer) מעדכן לפי החוקים
          </li>
        </ul>
        <table className="table table-sm w-auto">
          <thead>
            <tr>
              <th>מילה</th>
              <th>משמעות</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>state</code>
              </td>
              <td>הערך הנוכחי (כמו count)</td>
            </tr>
            <tr>
              <td>
                <code>action</code>
              </td>
              <td>הודעה: מה קרה (&#123; type: "plus" &#125;)</td>
            </tr>
            <tr>
              <td>
                <code>reducer</code>
              </td>
              <td>חוקים: state ישן + action → state חדש</td>
            </tr>
            <tr>
              <td>
                <code>dispatch</code>
              </td>
              <td>לשלוח action (במקום setCount)</td>
            </tr>
          </tbody>
        </table>
      </LearnSection>

      <LearnSection title="6. דמו חי">
        <div className="learn-demo-box">
          <CounterDemo />
        </div>
      </LearnSection>

      <LearnSection title="7. מתי משתמשים?">
        <ul>
          <li>
            <strong>רוב הזמן</strong> — <code>useState</code> מספיק (גם אצלנו
            בפרויקט)
          </li>
          <li>
            <strong>useReducer</strong> — כשיש הרבה פעולות על אותו state
            (טופס מורכב, wizard, הרבה מעברים) ורצים לרכז את הלוגיקה במקום אחד
          </li>
        </ul>
        <LearnCallout variant="tip" title="משפט לראיון">
          "useReducer הוא hook של React לניהול state מורכב בקומפוננטה —
          אותו דפוס action/reducer כמו Redux, בלי store גלובלי."
        </LearnCallout>
      </LearnSection>

      <LearnSection title="8. קשר ל-Redux (רק כדי לא להתבלבל)">
        <LearnCode
          label="דומה אבל לא אותו דבר"
          code={`useReducer  →  React, בתוך קומפוננטה
Redux       →  ספרייה, store לכל האפליקציה

שניהם:  action → reducer → state חדש
רק היקף שונה.`}
        />
        <p>
          שיעור Redux אצלנו: <Link to="/learn/redux">Redux Toolkit</Link>.
        </p>
      </LearnSection>

      <LearnSection title="9. קבצים">
        <ul className="learn-files">
          <FileReference
            path="fronted/payplus-wallet/src/pages/learn/UseReducerLearnPage.tsx"
            description="השיעור + הדמו החי"
          />
          <FileReference
            path="fronted/payplus-wallet/src/store/slices/uiSlice.ts"
            description="Redux — דפוס דומה, היקף גלובלי"
          />
        </ul>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>
            <code>useReducer</code> ≈ <code>useState</code> עם תחביר אחר
          </li>
          <li>
            <code>dispatch(מה_קרה)</code> → reducer מחזיר state חדש
          </li>
          <li>לא חובה ליום־יום — useState מספיק ברוב המקרים</li>
          <li>לא Redux — רק אותו רעיון בקטן</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default UseReducerLearnPage;
