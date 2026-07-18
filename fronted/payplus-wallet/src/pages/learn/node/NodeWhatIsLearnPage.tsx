import { Link } from "react-router-dom";
import LearnCallout from "../../../components/learn/LearnCallout";
import LearnCode from "../../../components/learn/LearnCode";
import LearnSection from "../../../components/learn/LearnSection";
import LearnTopicLayout from "../../../components/learn/LearnTopicLayout";

function NodeWhatIsLearnPage() {
  return (
    <LearnTopicLayout
      slug="node-what-is"
      objectives={[
        "להבין מה Node.js עושה (ולמה זה לא שפת תכנות חדשה)",
        "להבין את ההבדל בין הרצת JS בדפדפן להרצה ב-Node",
        "לדעת להריץ קובץ JavaScript עם Node מהטרמינל",
        "להבין למה Node פופולרי כל כך לבניית שרתים",
      ]}
    >
      <LearnSection title="1. מאפס — מה זה בכלל?">
        <p>
          JavaScript נולדה <strong>בדפדפן</strong> — להזיז כפתורים, לשנות DOM,
          לדבר עם שרת. במשך שנים אי אפשר היה להריץ JS מחוץ לדפדפן.
        </p>
        <p>
          <strong>Node.js</strong> = תוכנה שמתקינים על המחשב / שרת, שמריצה
          JavaScript <em>בלי דפדפן</em>. בזכותה אפשר לכתוב שרתים, סקריפטים,
          כלי CLI ואוטומציות — באותה שפה שכבר מכירים מהפרונט.
        </p>
        <LearnCallout variant="tip" title="במשפט אחד">
          Node.js הוא <strong>runtime</strong> (סביבת הרצה) ל-JavaScript בצד
          השרת — לא שפה חדשה ולא framework.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="2. מה יש בדפדפן שאין ב-Node (ולהפך)">
        <ul>
          <li>
            <strong>בדפדפן:</strong> <code>document</code>, <code>window</code>,
            DOM — אין ב-Node (אין HTML לצייר).
          </li>
          <li>
            <strong>ב-Node:</strong> קבצים (<code>fs</code>), רשת (
            <code>http</code>), תהליך (<code>process</code>), חיבור למסד
            נתונים — אין בדפדפן (מסיבות אבטחה).
          </li>
          <li>
            <strong>בשניהם:</strong> אותה שפת JS (משתנים, פונקציות, promises),
            ואותו מנוע V8 (של Chrome) מתחת למכסה.
          </li>
        </ul>
      </LearnSection>

      <LearnSection title="3. הרצה ראשונה">
        <p>
          אחרי התקנת Node, כל קובץ JavaScript הופך לתוכנית שאפשר להריץ
          מהטרמינל:
        </p>
        <LearnCode
          label="hello.js"
          code={`console.log("שלום מ-Node!");
console.log("גרסת Node:", process.version);`}
        />
        <LearnCode
          label="בטרמינל"
          code={`node hello.js
# שלום מ-Node!
# גרסת Node: v22.x.x`}
        />
        <p>
          שימו לב ל-<code>process</code> — אובייקט גלובלי שקיים רק ב-Node
          ומייצג את התהליך הרץ. בדפדפן הוא לא קיים, בדיוק כמו ש-
          <code>document</code> לא קיים ב-Node.
        </p>
      </LearnSection>

      <LearnSection title="4. איך נראה שרת ב-Node?">
        <p>
          הכוח האמיתי של Node הוא שרתים. הנה שרת HTTP שלם, בלי אף חבילה
          חיצונית:
        </p>
        <LearnCode
          label="server.js — שרת מינימלי"
          code={`import http from "http";

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "hello" }));
});

server.listen(3000, () => {
  console.log("Server on http://localhost:3000");
});`}
        />
        <p>
          עשר שורות — ויש לנו שרת שעונה לכל בקשה. בשיעורים הבאים נבין בדיוק
          מה קורה כאן, ואיך Express מפשט את זה עוד יותר.
        </p>
      </LearnSection>

      <LearnSection title="5. למה Node ל-backend?">
        <ul>
          <li>
            <strong>אותה שפה</strong> כמו הפרונט — צוות אחד, שפה אחת, פחות
            הקשר מנטלי.
          </li>
          <li>
            <strong>מעולה ל-I/O</strong> (רשת, מסדי נתונים, קבצים) — רוב
            עבודת שרת API היא "חכה לתשובה מהמסד", לא חישוב מתמטי כבד. Node
            בנוי בדיוק לזה (שיעור הבא: Event Loop).
          </li>
          <li>
            <strong>אקוסיסטם ענק</strong> — npm הוא מאגר החבילות הגדול
            בעולם: Express, ORMs, ולידציה, אימות — הכל זמין.
          </li>
        </ul>
        <LearnCallout variant="warn" title="מה Node לא">
          Node לא מחליף מסד נתונים, לא מחליף Nginx, ולא אידיאלי לחישובים
          כבדים שרצים שעות (עיבוד וידאו, machine learning) — לזה יש כלים
          מתאימים יותר.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="6. npm — מנהל החבילות">
        <p>
          לצד Node מותקן <strong>npm</strong>. פרויקט Node מוגדר על ידי קובץ{" "}
          <code>package.json</code> שמרכז את התלויות והסקריפטים:
        </p>
        <LearnCode
          label="פקודות בסיס"
          code={`npm init -y          # יוצר package.json
npm install express  # מוריד חבילה ל-node_modules
npm run dev          # מריץ סקריפט מוגדר מ-package.json`}
        />
        <p>
          <code>node_modules</code> היא תיקיית התלויות — כבדה, ולא שומרים
          אותה ב-git. <code>package-lock.json</code> נועל גרסאות מדויקות כדי
          שכל מפתח יקבל בדיוק את אותו קוד.
        </p>
      </LearnSection>

      <LearnSection title="7. לסיכום מהיר">
        <p>
          Node לוקח את השפה שכבר מכירים ופותח איתה עולם חדש: שרתים,
          סקריפטים, כלים. ההבדל המהותי מהדפדפן הוא ה-APIs הזמינים — במקום
          DOM מקבלים קבצים, רשת ותהליכים.
        </p>
        <p className="mt-2 mb-0">
          המשך: <Link to="/learn/node-event-loop">Event Loop</Link> — למה
          Node לא "נתקע" כשמחכים לתשובה מהרשת או מהמסד.
        </p>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>Node.js = runtime ל-JS מחוץ לדפדפן</li>
          <li>אין DOM; יש קבצים, רשת, process</li>
          <li>node file.js מריץ קובץ; npm מנהל חבילות</li>
          <li>מתאים לשרתי API כי רוב הזמן מחכים ל-I/O</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default NodeWhatIsLearnPage;
