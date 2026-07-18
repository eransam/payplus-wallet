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
        "להבין מה זה 'חוט' (thread) במילים פשוטות",
        "להבין את המשל: מלצר אחד שלא עומד ומחכה",
        "לדעת מה באמת קורה כשכותבים await",
        "להבין למה לולאה כבדה תוקעת את כל השרת",
      ]}
    >
      <LearnSection title="1. קודם כל — מה זה 'חוט' (thread)?">
        <p>
          לפני הכל, מושג אחד פשוט: <strong>חוט = עובד אחד שמבצע פקודות אחת
          אחרי השנייה</strong>. הוא לא יכול לעשות שני דברים בו-זמנית — בדיוק
          כמו שאתה לא יכול לקרוא ספר ולכתוב מייל באותה שנייה.
        </p>
        <p>
          ב-Node יש <strong>עובד אחד כזה</strong> שמריץ את הקוד JavaScript
          שלך. אחד. זה מה שמתכוונים כשאומרים "Node הוא single-threaded".
        </p>
        <p>ועכשיו נשאלת השאלה הגדולה:</p>
        <LearnCallout variant="info" title="השאלה שכל השיעור עונה עליה">
          אם יש רק עובד אחד — איך שרת Node מצליח לשרת אלפי משתמשים בו-זמנית?
        </LearnCallout>
      </LearnSection>

      <LearnSection title="2. המשל: מלצר במסעדה">
        <p>
          דמיין מסעדה עם <strong>מלצר אחד בלבד</strong> (זה חוט ה-JS שלנו).
        </p>
        <p>
          <strong>מלצר גרוע</strong> עובד ככה: לוקח הזמנה משולחן 1, הולך
          למטבח, <em>עומד שם ומחכה 10 דקות</em> עד שהמנה מוכנה, מגיש, ורק אז
          ניגש לשולחן 2. עם 10 שולחנות — האחרון יחכה שעות. זו תוכנית{" "}
          <strong>חוסמת</strong> (blocking).
        </p>
        <p>
          <strong>מלצר חכם</strong> עובד אחרת: לוקח הזמנה משולחן 1,{" "}
          <strong>מוסר אותה למטבח וממשיך מיד</strong> לשולחן 2, ואז 3, ואז
          4... כשהמטבח מצלצל בפעמון "מנה מוכנה!" — הוא ניגש, לוקח ומגיש.
          מלצר אחד מצליח לשרת את כל המסעדה.
        </p>
        <p>עכשיו נתרגם למחשבים:</p>
        <ul>
          <li>
            <strong>המלצר</strong> = חוט ה-JS (מריץ את הקוד שלך)
          </li>
          <li>
            <strong>המטבח</strong> = מסד הנתונים, הדיסק, הרשת — כל דבר
            "איטי" שקורה מחוץ ל-Node
          </li>
          <li>
            <strong>הפעמון</strong> = ההודעה "התוצאה מוכנה, אפשר להמשיך"
          </li>
          <li>
            <strong>ה-Event Loop</strong> = הסדר שהמלצר עובד לפיו: "אין לי
            מה לעשות? אבדוק אם צלצל פעמון"
          </li>
        </ul>
        <LearnCallout variant="tip" title="Event Loop במשפט אחד">
          לולאה אינסופית שרצה ברקע ושואלת שוב ושוב: "יש משימה חדשה? יש
          תוצאה שחזרה מהמטבח? אם כן — תריץ את ההמשך שלה".
        </LearnCallout>
      </LearnSection>

      <LearnSection title="3. איך זה נראה בקוד אמיתי">
        <p>ניקח בקשת API פשוטה — משתמש מבקש רשימת מוצרים:</p>
        <LearnCode
          label="handler עם await"
          code={`app.get("/api/products", async (req, res) => {
  console.log("1. התחלתי לטפל בבקשה");

  const products = await db.query("SELECT * FROM products");
  // ה-await = "מסרתי למטבח, תמשיך לשרת אחרים"

  console.log("2. קיבלתי תשובה מהמסד");
  res.json(products);
});`}
        />
        <p>מה קורה שלב אחרי שלב:</p>
        <ol>
          <li>
            הבקשה מגיעה → המלצר (חוט ה-JS) מריץ את השורות עד ה-
            <code>await</code>.
          </li>
          <li>
            ב-<code>await</code>: השאילתה נשלחת למסד הנתונים,{" "}
            <strong>והפונקציה הזו נעצרת</strong>. אבל שים לב —{" "}
            <strong>רק הפונקציה הזו!</strong> המלצר עצמו משוחרר.
          </li>
          <li>
            בזמן שהמסד עובד (נגיד 50ms) — המלצר מטפל בבקשות של משתמשים
            אחרים. הוא לא עומד ומחכה.
          </li>
          <li>
            המסד מחזיר תשובה → "פעמון" → ה-Event Loop מחזיר את המלצר לשורה{" "}
            <code>console.log("2...")</code> וממשיך משם.
          </li>
        </ol>
        <LearnCallout variant="warn" title="הטעות הנפוצה ביותר">
          לחשוב ש-<code>await</code> עוצר את כל השרת. לא!{" "}
          <code>await</code> עוצר <strong>רק את הפונקציה שהוא בתוכה</strong> —
          ומשחרר את החוט לטפל באחרים. זה בדיוק הקסם.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="3.5 שתי נקודות שחשוב לא להתבלבל ביניהן">
        <p>
          כאן מתחילים רוב הבלבולים, אז נחדד שתי אמיתות שנשמעות סותרות אבל
          שתיהן נכונות:
        </p>
        <ul>
          <li>
            <strong>בתוך הפונקציה</strong> — <code>await</code> כן עוצר את
            הפלואו. השורה שאחרי ה-<code>await</code> תרוץ{" "}
            <strong>רק אחרי</strong> שהדאטה חזרה. לכן הדאטה תהיה מלאה, לא
            ריקה.
          </li>
          <li>
            <strong>מחוץ לפונקציה</strong> — בזמן ההמתנה הזו, החוט חופשי
            לטפל ב<strong>בקשות אחרות</strong>. הוא לא עומד בטל.
          </li>
        </ul>
        <LearnCallout variant="tip" title="בשורה אחת">
          <code>await</code> = עצירה <strong>מקומית</strong> (רק לפונקציה
          הזאת) + חופש <strong>גלובלי</strong> (לשאר השרת).
        </LearnCallout>
        <p>
          שאלה שעולה תמיד: "אם המלצר ממשיך הלאה, אולי ה-
          <code>console.log</code> שבשורה הבאה ידפיס דאטה ריקה?" התשובה:{" "}
          <strong>לא</strong>. המלצר לא ממשיך לשורה הבאה של{" "}
          <em>אותה</em> הזמנה — הוא עוזב את כל ההזמנה הזו באמצע והולך
          לשולחנות אחרים, וחוזר לשורה הבאה רק כשהדאטה מוכנה.
        </p>
        <LearnCode
          label="נכון — עם await הדאטה מלאה"
          code={`async function getProducts() {
  const data = await db.query("SELECT * FROM products"); // עוצר כאן
  console.log(data); // רץ רק אחרי שהדאטה חזרה — מלאה!
}`}
        />
        <LearnCode
          label="טעות נפוצה — בלי await מקבלים 'פתק' ולא דאטה"
          code={`async function getProducts() {
  const data = db.query("SELECT * FROM products"); // שכחנו await
  console.log(data); // Promise { <pending> } — לא הדאטה!
}`}
        />
        <p>
          עכשiv הדוגמה שמראה את ה"חופש הגלובלי" — שתי בקשות שמגיעות אחת אחרי
          השנייה. שים לב ש-B לא מחכה ל-A:
        </p>
        <LearnCode
          label="הרץ ב-Console (F12) ותראה את הסדר"
          code={`// מדמה שאילתת DB שלוקחת 2 שניות
function fakeDbQuery() {
  return new Promise((resolve) =>
    setTimeout(() => resolve("הנתונים!"), 2000)
  );
}

async function handleUserA() {
  console.log("A: התחלתי");
  const data = await fakeDbQuery(); // מקפיא את A ל-2 שניות
  console.log("A: קיבלתי", data);
}

async function handleUserB() {
  console.log("B: התחלתי");
}

handleUserA(); // משתמש א'
handleUserB(); // משתמש ב' — מיד אחריו

// פלט:
// A: התחלתי
// B: התחלתי          ← מיד! B לא חיכה ל-A
// A: קיבלתי הנתונים!  ← רק אחרי 2 שניות`}
        />
        <p>
          זה בדיוק שרת אמיתי: A ו-B הם שני משתמשים. בזכות ה-<code>await</code>,
          משתמש B לא נתקע רק כי משתמש A מחכה למסד הנתונים.
        </p>
      </LearnSection>

      <LearnSection title="4. אז מתי כן נתקעים? כשהמלצר עצמו עסוק">
        <p>
          המערכת עובדת מצוין כל עוד הדברים האיטיים קורים <strong>במטבח</strong>{" "}
          (מסד נתונים, רשת, דיסק). אבל מה אם המלצר עצמו מתחיל לקצוץ ירקות?
        </p>
        <LearnCode
          label="קוד שתוקע את כל השרת"
          code={`app.get("/api/report", (req, res) => {
  let sum = 0;
  for (let i = 0; i < 5_000_000_000; i++) {
    sum += i;
  }
  // הלולאה הזו רצה על חוט ה-JS עצמו — אין כאן "מטבח"!
  // 5 שניות שבהן המלצר קוצץ ירקות ולא ניגש לאף שולחן.
  res.json({ sum });
});`}
        />
        <p>
          ההבדל הקריטי: <code>await db.query(...)</code> = העבודה אצל{" "}
          <strong>מישהו אחר</strong> (המסד), החוט פנוי. לולאת חישוב ענקית =
          העבודה על <strong>החוט עצמו</strong> — ובזמן הזה אף בקשה אחרת לא
          מטופלת. משתמש אחד לחץ על "דוח" — וכל שאר המשתמשים תקועים.
        </p>
        <p>
          לכן: חישובים כבדים מוציאים החוצה — ל-<code>worker_threads</code>{" "}
          (עובד נוסף) או לשירות נפרד. את זה נראה בשיעור Scaling.
        </p>
      </LearnSection>

      <LearnSection title="5. שאלת הראיון הקלאסית — מה יודפס?">
        <LearnCode
          label="נסה לנחש לפני שממשיכים"
          code={`console.log("A");

setTimeout(() => console.log("B"), 0);

Promise.resolve().then(() => console.log("C"));

console.log("D");`}
        />
        <p>
          התשובה: <strong>A, D, C, B</strong>. למה?
        </p>
        <ol>
          <li>
            <strong>A ו-D</strong> — קוד רגיל (סינכרוני). המלצר מריץ אותו{" "}
            <strong>עד הסוף</strong> לפני שהוא בודק פעמונים. לכן הם ראשונים.
          </li>
          <li>
            <strong>C</strong> — הבטחה (Promise) שהתוצאה שלה כבר מוכנה. היא
            נכנסת לתור "דחוף" (נקרא microtask) — המלצר בודק אותו{" "}
            <strong>מיד</strong> כשהוא מסיים את הקוד הרגיל.
          </li>
          <li>
            <strong>B</strong> — <code>setTimeout</code> אפילו עם 0 נכנס לתור
            "רגיל" (macrotask) — שנבדק רק <strong>אחרי</strong> שהתור הדחוף
            התרוקן.
          </li>
        </ol>
        <LearnCallout variant="tip" title="כלל זהב לזכור">
          קודם כל הקוד הרגיל עד הסוף → אחר כך כל ה-Promises שמחכים → ורק
          בסוף timers כמו setTimeout. לכן setTimeout(fn, 0) הוא אף פעם לא
          באמת "מיד".
        </LearnCallout>
      </LearnSection>

      <LearnSection title="6. שלוש טעויות שהורגות שרתים בפועל">
        <ul>
          <li>
            <strong>גרסאות Sync של פונקציות</strong> — למשל{" "}
            <code>fs.readFileSync</code> בתוך handler. ה-Sync בשם אומר:
            "המלצר עומד ומחכה". תמיד להעדיף את הגרסה עם await.
          </li>
          <li>
            <strong>JSON.parse על קובץ ענק</strong> — פעולה סינכרונית. על
            מגה-בייטים בודדים זה בסדר; על 500MB — השרת קופא.
          </li>
          <li>
            <strong>לולאת עיבוד ארוכה על מערך ענק</strong> בתוך בקשה — כמו
            בדוגמה למעלה. פתרון: worker / queue / לפצל לחלקים.
          </li>
        </ul>
        <p className="mt-2 mb-0">
          המשך: <Link to="/learn/node-modules">Modules</Link> — איך מחלקים
          קוד לקבצים.
        </p>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>חוט = עובד אחד שעושה דבר אחד בכל רגע. ל-Node יש אחד לקוד שלך</li>
          <li>
            המשל: מלצר חכם — מוסר למטבח (DB/רשת) וממשיך לשרת, חוזר כשמצלצל
            פעמון
          </li>
          <li>await עוצר רק את הפונקציה הנוכחית — לא את השרת</li>
          <li>חישוב כבד על החוט = המלצר קוצץ ירקות = כל השרת תקוע</li>
          <li>סדר הרצה: קוד רגיל → Promises (דחוף) → setTimeout (רגיל)</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default NodeEventLoopLearnPage;
