import { Link } from "react-router-dom";
import LearnCallout from "../../../components/learn/LearnCallout";
import LearnCode from "../../../components/learn/LearnCode";
import LearnSection from "../../../components/learn/LearnSection";
import LearnTopicLayout from "../../../components/learn/LearnTopicLayout";

function NodeScalingLearnPage() {
  return (
    <LearnTopicLayout
      slug="node-scaling"
      objectives={[
        "להבין את הגבול של תהליך Node יחיד",
        "להכיר cluster — ניצול כל הליבות במכונה",
        "להבין scaling אופקי עם load balancer",
        "לדעת למה stateless הוא תנאי לגדילה",
      ]}
    >
      <LearnSection title="1. הגבול של Node יחיד">
        <p>
          תהליך Node אחד מריץ JS על <strong>ליבה אחת</strong> של המעבד. אם
          למכונה יש 8 ליבות — 7 מהן יושבות בטלות. ובנוסף: אם התהליך קורס,
          השירות כולו נופל.
        </p>
        <p>שני כיוונים לגדול:</p>
        <ul>
          <li>
            <strong>אנכי (scale up)</strong> — מכונה חזקה יותר. פשוט, אבל יש
            תקרה ויקר.
          </li>
          <li>
            <strong>אופקי (scale out)</strong> — עוד עותקים של השרת. כמעט בלי
            תקרה — וזה הכיוון המקצועי.
          </li>
        </ul>
      </LearnSection>

      <LearnSection title="2. cluster — כל הליבות באותה מכונה">
        <p>
          לפני הקוד — בוא נבין את הרעיון עם דימוי. חשוב על המעבד של המחשב
          כעל <strong>מטבח עם 8 תחנות עבודה</strong> (8 ליבות). Node רגיל =
          טבח אחד שעובד בתחנה אחת. שאר 7 התחנות? ריקות. חבל.
        </p>
        <p>
          הפתרון המתבקש: <strong>להעסיק 8 טבחים</strong> — כלומר להריץ 8
          עותקים של השרת שלנו, אחד על כל ליבה. וזה בדיוק מה שמודול{" "}
          <code>cluster</code> עושה.
        </p>
        <p>אבל רגע, יש בעיה. איך זה עובד עם הפורט?</p>
        <LearnCallout variant="warn" title="הבעיה">
          שרת מאזין לפורט אחד, למשל 3000. אי אפשר ששני תהליכים "יתפסו" את
          אותו פורט — השני יקבל שגיאה (port already in use). אז איך 8
          עותקים יענו לאותו פורט 3000?
        </LearnCallout>
        <p>
          הפתרון של cluster: תהליך אחד הוא <strong>המנהל</strong> (primary) —
          הוא לא מטפל בבקשות בעצמו. הוא <strong>יולד</strong> (fork) את
          העותקים העובדים (workers), ורק הוא מחזיק את פורט 3000. כשמגיעה
          בקשה — המנהל מעביר אותה לאחד העובדים הפנויים. כלפי חוץ זה נראה
          כמו שרת אחד; בפנים — 8 שרתים עובדים.
        </p>
        <LearnCode
          label="התמונה"
          code={`                        ┌─ Worker 1 (ליבה 1)
בקשות → Primary (3000) ─┼─ Worker 2 (ליבה 2)
        "המנהל"          ┼─ Worker 3 (ליבה 3)
                        └─ ... עד 8`}
        />
        <p>
          עכשיו הקוד. שים לב לטריק: <strong>אותו קובץ רץ 9 פעמים</strong>{" "}
          (מנהל + 8 עובדים), וה-<code>if</code> קובע מי אני הפעם:
        </p>
        <LearnCode
          label="cluster בסיסי — שורה אחר שורה"
          code={`import cluster from "node:cluster";
import os from "node:os";

if (cluster.isPrimary) {
  // ===== אני המנהל =====
  const cpus = os.cpus().length;      // כמה ליבות יש? (למשל 8)

  for (let i = 0; i < cpus; i++) {
    cluster.fork();                    // תוליד עובד — עוד תהליך
  }                                    // שמריץ את *אותו קובץ* מההתחלה

  // עובד קרס? תוליד חדש במקומו — השירות לא נופל
  cluster.on("exit", () => {
    cluster.fork();
  });

} else {
  // ===== אני עובד (אחד מה-8) =====
  // הקוד הזה רץ אצל כל עובד בנפרד:
  startServer(); // Express רגיל עם app.listen(3000)
}`}
        />
        <p>
          מה קורה כשהקובץ רץ: בפעם הראשונה <code>cluster.isPrimary</code>{" "}
          הוא true → נכנסים לענף המנהל → 8 קריאות <code>fork()</code> יוצרות
          8 תהליכים חדשים שמריצים את אותו קובץ — אבל אצלם{" "}
          <code>isPrimary</code> הוא false → הם נכנסים לענף השני ומרימים את
          השרת. ה-<code>app.listen(3000)</code> אצל worker לא באמת תופס את
          הפורט — cluster מנתב את זה דרך המנהל.
        </p>
        <p>
          בונוס גדול: <strong>עמידות</strong>. עובד אחד קרס בגלל באג? המנהל
          שם לב (<code>on("exit")</code>) ומיד מוליד עובד חדש. המשתמשים בקושי
          מרגישים — 7 העובדים האחרים ממשיכים לענות.
        </p>
        <LearnCallout variant="info" title="בפועל — לא כותבים את זה ידנית">
          היום משתמשים ב-<strong>PM2</strong> — כלי שעושה את כל זה בפקודה
          אחת: <code>pm2 start app.js -i max</code> ("תריץ עותק לכל ליבה").
          או מריצים כמה containers של Docker. אבל העיקרון מתחת זהה — וזה מה
          ששואלים בראיון.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="3. Load Balancer — עוד מכונות">
        <p>
          כשמכונה אחת לא מספיקה: שמים <strong>Load Balancer</strong> (למשל
          Nginx, AWS ALB) מקדימה, והוא מפזר בקשות בין כמה שרתים:
        </p>
        <LearnCode
          label="התמונה"
          code={`                    ┌── Server A (Node)
Client → LB (443) ──┼── Server B (Node)
                    └── Server C (Node)

- שרת נופל? ה-LB מפסיק לשלוח אליו (health checks)
- עומס עולה? מוסיפים Server D (auto-scaling)`}
        />
      </LearnSection>

      <LearnSection title="4. התנאי הקריטי: Stateless">
        <p>
          כדי ששלושה שרתים יוכלו לענות לאותו משתמש — אסור לשמור מצב{" "}
          <strong>בזיכרון של שרת ספציפי</strong>:
        </p>
        <ul>
          <li>
            <strong>רע:</strong> session בזיכרון — הבקשה הבאה תגיע לשרת אחר
            שלא מכיר את המשתמש.
          </li>
          <li>
            <strong>טוב:</strong> JWT (המצב אצל הלקוח) או session ב-Redis
            (מצב משותף לכולם).
          </li>
          <li>
            <strong>רע:</strong> קבצים שנשמרים על הדיסק המקומי.
          </li>
          <li>
            <strong>טוב:</strong> S3 / storage משותף.
          </li>
        </ul>
        <LearnCallout variant="tip" title="משפט לראיון">
          "כדי לעשות scale out, השרת חייב להיות stateless — כל מצב משותף
          יוצא החוצה: DB, Redis, S3. אז כל בקשה יכולה להיענות על ידי כל
          שרת."
        </LearnCallout>
      </LearnSection>

      <LearnSection title="5. ומה עם חישובים כבדים? worker_threads">
        <p>
          זוכר שקוד סינכרוני כבד חוסם את ה-Event Loop? כשחייבים חישוב כבד
          (עיבוד תמונה, הצפנה כבדה) — מריצים אותו ב-
          <code>worker_threads</code>: חוט נפרד שלא חוסם את הבקשות:
        </p>
        <LearnCode
          label="worker_threads בקצרה"
          code={`import { Worker } from "node:worker_threads";

function heavyTaskAsync(data: unknown) {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./heavy-task.js", { workerData: data });
    worker.on("message", resolve); // התוצאה חוזרת
    worker.on("error", reject);
  });
}
// ה-Event Loop נשאר פנוי לבקשות אחרות`}
        />
        <p>
          חלופה נפוצה: <strong>job queue</strong> (BullMQ + Redis) — העבודה
          הכבדה נכנסת לתור, worker נפרד מעבד אותה ברקע.
        </p>
      </LearnSection>

      <LearnSection title="6. צ'ק-ליסט ביצועים לפני שמוסיפים שרתים">
        <ol>
          <li>מדדו קודם! (autocannon / k6) — איפה באמת צוואר הבקבוק?</li>
          <li>לרוב הבעיה ב-DB — אינדקסים, שאילתות N+1, connection pool.</li>
          <li>cache (Redis) לקריאות חוזרות.</li>
          <li>gzip / compression לתשובות גדולות.</li>
          <li>רק אז — cluster / עוד שרתים.</li>
        </ol>
        <p className="mt-2 mb-0">
          המשך: <Link to="/learn/node-interview-qa">שאלות ותשובות לראיון</Link>{" "}
          — חזרה מרוכזת על כל הקורס.
        </p>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>Node אחד = ליבה אחת; cluster/PM2 = כל הליבות</li>
          <li>scale out = עוד שרתים מאחורי Load Balancer</li>
          <li>תנאי: stateless — מצב משותף ב-DB/Redis/S3, לא בזיכרון</li>
          <li>חישוב כבד → worker_threads או job queue</li>
          <li>לפני הכל: למדוד. לרוב צוואר הבקבוק ב-DB</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default NodeScalingLearnPage;
