import { Link } from "react-router-dom";
import LearnCallout from "../../../components/learn/LearnCallout";
import LearnCode from "../../../components/learn/LearnCode";
import LearnSection from "../../../components/learn/LearnSection";
import LearnTopicLayout from "../../../components/learn/LearnTopicLayout";

function NodeStreamsLearnPage() {
  return (
    <LearnTopicLayout
      slug="node-streams"
      objectives={[
        "להבין stream — נתונים בחלקים (chunks)",
        "להבדיל בין Readable, Writable ו-Transform",
        "לדעת מתי streams שימושיים (קבצים גדולים)",
        "להבין שלא כל API צריך streams",
      ]}
    >
      <LearnSection title="1. מאפס — מה זה Stream">
        <p>
          בדרך כלל קוראים קובץ שלם לזיכרון: <code>fs.readFile</code> → buffer
          אחד גדול. <strong>Stream</strong> = הנתונים זורמים ב
          <strong>חלקים</strong> (chunks) — מעבדים כל chunk ומשחררים, בלי
          לטעון הכל ב-RAM.
        </p>
        <LearnCallout variant="tip" title="דימוי">
          צינור מים: לא ממלאים בריכה ואז שופכים — המים זורמים דרך הצינור ברצף.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="2. סוגים עיקריים ב-Node">
        <ul>
          <li>
            <strong>Readable</strong> — קוראים ממנו (קובץ, HTTP request body,
            stdin).
          </li>
          <li>
            <strong>Writable</strong> — כותבים אליו (קובץ, HTTP response,
            stdout).
          </li>
          <li>
            <strong>Transform</strong> — קוראים, משנים, כותבים (gzip, parse
            CSV שורה-שורה).
          </li>
          <li>
            <strong>Duplex</strong> — שניהם (WebSocket, TCP socket).
          </li>
        </ul>
        <p>
          הרבה מה-API של Node בנוי על streams מתחת למכסה המנוע:{" "}
          <code>req</code> ו-<code>res</code> ב-HTTP הם streams,{" "}
          <code>process.stdout</code> הוא stream, וכך גם sockets.
        </p>
      </LearnSection>

      <LearnSection title="3. דוגמה — קובץ גדול">
        <LearnCode
          label="readFile (לא stream) — בעייתי ל-500MB"
          code={`const data = await fs.promises.readFile("huge.csv"); // 500MB ב-RAM
process(data);`}
        />
        <LearnCode
          label="createReadStream — chunk אחר chunk"
          code={`import fs from "fs";

const stream = fs.createReadStream("huge.csv", { encoding: "utf8" });

stream.on("data", (chunk) => {
  // עיבוד חלק — למשל שורות
});

stream.on("end", () => console.log("done"));
stream.on("error", (err) => console.error(err));`}
        />
        <p>
          הזיכרון נשאר יציב גם על קבצים ענקיים — חשוב ב-import/export של
          נתונים, עיבוד לוגים, והעלאות קבצים.
        </p>
      </LearnSection>

      <LearnSection title="4. pipe ו-pipeline — לחבר streams">
        <LearnCode
          label="העתקת קובץ עם pipe"
          code={`import fs from "fs";

fs.createReadStream("input.txt")
  .pipe(fs.createWriteStream("output.txt"))
  .on("finish", () => console.log("copied"));`}
        />
        <p>
          <code>pipe</code> מעביר נתונים אוטומטית מ-readable ל-writable, כולל
          טיפול ב-backpressure (כשהיעד איטי מהמקור). הגרסה המודרנית והבטוחה
          יותר לשגיאות היא <code>pipeline</code>:
        </p>
        <LearnCode
          label="pipeline — כולל דחיסה באמצע"
          code={`import { pipeline } from "stream/promises";
import fs from "fs";
import zlib from "zlib";

await pipeline(
  fs.createReadStream("input.txt"),
  zlib.createGzip(),               // Transform
  fs.createWriteStream("input.txt.gz")
);`}
        />
      </LearnSection>

      <LearnSection title="5. מתי לא צריך streams">
        <p>
          API טיפוסי של JSON מקבל body קטן ומחזיר תשובות קטנות —{" "}
          <code>req.body</code> ו-<code>res.json()</code> מספיקים לחלוטין.{" "}
          <strong>אין צורך ב-streams</strong> לרוב ה-endpoints.
        </p>
        <ul>
          <li>
            JSON API רגיל → <code>express.json()</code> כבר קורא את ה-stream
            של הבקשה בשבילך.
          </li>
          <li>
            שאילתות DB שמחזירות עשרות-מאות שורות → תוצאה שלמה בזיכרון זה
            בסדר גמור (cursor רק לדוחות ענק).
          </li>
          <li>
            ספריות logging כותבות לקבצים — פנימית הן משתמשות ב-streams, אתה
            לא צריך לנהל את זה ידנית.
          </li>
        </ul>
        <LearnCallout variant="warn" title="מתי כן">
          export CSV של מיליוני שורות, streaming upload/download של קבצים
          גדולים, proxy של תוכן כבד, עיבוד לוגים — שם streams (או ספריות
          שמבוססות עליהם) הם הכלי הנכון.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="6. async iterators (מודרני)">
        <LearnCode
          label="for await...of על readable"
          code={`import { createReadStream } from "fs";
import { createInterface } from "readline";

const rl = createInterface({
  input: createReadStream("lines.txt"),
});

for await (const line of rl) {
  console.log(line);
}`}
        />
        <p>
          תחביר נוח יותר מ-callbacks על <code>data</code> — אותו רעיון של
          chunks, אבל בזרימת קוד רגילה עם <code>try/catch</code> לשגיאות.
        </p>
        <p className="mt-2 mb-0">
          המשך: <Link to="/learn/node-typescript">TypeScript ב-Node</Link> —
          types ל-Express ולמודלים.
        </p>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>Stream = chunks, לא הכל ב-RAM</li>
          <li>Readable / Writable / Transform / Duplex</li>
          <li>pipe / pipeline מחברים streams כולל backpressure</li>
          <li>קבצים גדולים = use case קלאסי</li>
          <li>JSON API קטן — בדרך כלל לא צריך</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default NodeStreamsLearnPage;
