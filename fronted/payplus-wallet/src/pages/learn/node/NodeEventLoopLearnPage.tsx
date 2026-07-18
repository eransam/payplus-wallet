import { Link } from "react-router-dom";
import LearnCallout from "../../../components/learn/LearnCallout";
import LearnCode from "../../../components/learn/LearnCode";
import LearnSection from "../../../components/learn/LearnSection";
import LearnTopicLayout from "../../../components/learn/LearnTopicLayout";

function NodeEventLoopLearnPage() {
  return (
    <LearnTopicLayout
      slug="node-event-loop"
      objectives={[
        "להבין למה אומרים ש-Node הוא single-threaded",
        "להבין מה קורה כשמחכים לרשת / מסד נתונים / קובץ",
        "להכיר call stack מול callback queue",
        "לדעת למה קוד חוסם (לולאה כבדה) הורג את השרת",
      ]}
    >
      <LearnSection title="1. הבעיה ש-Event Loop פותר">
        <p>
          דמיין שרת שמקבל 1000 בקשות במקביל. אם כל בקשה הייתה{" "}
          <strong>חוסמת</strong> את השרת עד שמסד הנתונים עונה — היית מטפל
          בבקשה אחת בכל רגע. איטי מאוד.
        </p>
        <p>
          Node עובד אחרת: כשמחכים לתשובה מבחוץ, הוא <strong>לא יושב בטל</strong>{" "}
          — הוא ממשיך לטפל בבקשות אחרות. כשהתשובה מגיעה — חוזרים להמשיך את
          הקוד מאותה נקודה.
        </p>
        <LearnCallout variant="tip" title="במשפט אחד">
          Event Loop = המנגנון שמאפשר ל-Node לחכות להרבה דברים במקביל על חוט
          JS אחד, בלי לחסום את כולם.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="2. Single-threaded — מה זה אומר באמת">
        <p>
          <strong>הקוד שלך ב-JS רץ על חוט אחד.</strong> אין שתי שורות JS
          שרצות באמת במקביל באותו תהליך. אבל:
        </p>
        <ul>
          <li>
            פעולות I/O (רשת, דיסק) מתבצעות <em>מאחורי הקלעים</em> (libuv /
            מערכת ההפעלה) — לא על חוט ה-JS.
          </li>
          <li>
            כשהן מסתיימות — ה-callback / ה-promise נכנסים לתור, וה-Event Loop
            מריץ אותם על חוט ה-JS כשהוא פנוי.
          </li>
        </ul>
        <LearnCallout variant="warn" title="המלכודת">
          חישוב כבד סינכרוני (לולאה של מיליארד איטרציות){" "}
          <strong>חוסם את חוט ה-JS</strong> — אף בקשה אחרת לא תטופל עד שהוא
          מסיים. לכן בשרת API לא עושים עיבוד כבד על החוט הראשי.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="3. תמונה מנטלית פשוטה">
        <LearnCode
          label="מה קורה בבקשת API טיפוסית"
          code={`1. מגיעה בקשת HTTP → השרת מריץ את ה-handler שלך
2. אתה שולף נתונים: await db.query("SELECT * FROM users")
3. Node שולח את השאילתה ומשחרר את חוט ה-JS
4. בינתיים — Event Loop מטפל בבקשות אחרות
5. המסד עונה → ההמשך אחרי ה-await רץ
6. שולחים JSON חזרה ללקוח`}
        />
        <p>
          ה-<code>await</code> לא "מקפיא את כל Node" — הוא רק אומר: "תעצור{" "}
          <em>את הפונקציה הזו</em> עד שיש תוצאה, ותן לאחרים לרוץ".
        </p>
      </LearnSection>

      <LearnSection title="4. סדר הרצה — דוגמה שמפתיעה מתחילים">
        <LearnCode
          label="מה יודפס קודם?"
          code={`console.log("A");

setTimeout(() => console.log("B"), 0);

Promise.resolve().then(() => console.log("C"));

console.log("D");

// פלט: A, D, C, B`}
        />
        <ul>
          <li>
            קוד סינכרוני (<code>A</code>, <code>D</code>) רץ קודם — עד הסוף.
          </li>
          <li>
            promises (<code>C</code>) רצים ב-<strong>microtask queue</strong> —
            מיד אחרי שהקוד הסינכרוני נגמר.
          </li>
          <li>
            <code>setTimeout</code> (<code>B</code>) רץ ב-
            <strong>macrotask queue</strong> — רק אחרי כל ה-microtasks.
          </li>
        </ul>
      </LearnSection>

      <LearnSection title="5. איך חוסמים שרת בטעות">
        <LearnCode
          label="דוגמה רעה — חישוב כבד ב-handler"
          code={`app.get("/api/report", (req, res) => {
  let sum = 0;
  for (let i = 0; i < 5_000_000_000; i++) {
    sum += i; // חוסם את חוט ה-JS לשניות
  }
  res.json({ sum });
});
// בזמן הלולאה — כל שאר הבקשות לשרת תקועות!`}
        />
        <p>
          פתרונות מקובלים: לפצל את העבודה לחלקים קטנים, להעביר ל-
          <code>worker_threads</code>, או להוציא לתהליך / שירות נפרד. הכלל:
          חוט ה-JS צריך להיות פנוי לקבל בקשות.
        </p>
      </LearnSection>

      <LearnSection title="6. טעויות נפוצות">
        <ul>
          <li>
            לחשוב ש-<code>await</code> "עוצר את השרת" — הוא עוצר רק את
            הפונקציה הנוכחית.
          </li>
          <li>
            להשתמש בגרסאות סינכרוניות של APIs (כמו{" "}
            <code>fs.readFileSync</code>) בתוך handler של שרת — זה חוסם את
            כולם.
          </li>
          <li>
            להניח ש-<code>setTimeout(fn, 0)</code> רץ מיד — הוא רץ רק אחרי
            שהקוד הסינכרוני וה-microtasks הסתיימו.
          </li>
        </ul>
        <p className="mt-2 mb-0">
          המשך: <Link to="/learn/node-modules">Modules</Link> — איך מחלקים
          קוד לקבצים.
        </p>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>JS שלך על חוט אחד; I/O רץ "בחוץ" וחוזר דרך התור</li>
          <li>await לא חוסם את כל השרת — רק את המשך הפונקציה</li>
          <li>קוד סינכרוני כבד = שרת תקוע</li>
          <li>סדר: סינכרוני → microtasks (promises) → macrotasks (timers)</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default NodeEventLoopLearnPage;
