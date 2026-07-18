import { Link } from "react-router-dom";
import LearnCallout from "../../../components/learn/LearnCallout";
import LearnCode from "../../../components/learn/LearnCode";
import LearnSection from "../../../components/learn/LearnSection";
import LearnTopicLayout from "../../../components/learn/LearnTopicLayout";

function NodeLoggingLearnPage() {
  return (
    <LearnTopicLayout
      slug="node-logging"
      objectives={[
        "להבין למה console.log לא מספיק ב-production",
        "להכיר winston — levels, transports, JSON",
        "לדעת מה לרשום ומה לא (סיסמאות, tokens)",
        "להבין structured logging ולמה JSON",
      ]}
    >
      <LearnSection title="1. למה בכלל לוגים מסודרים">
        <p>
          ב-development אתה רואה את הטרמינל. ב-production — שרת בענן, Docker,
          Kubernetes — אף אחד לא &quot;עומד ליד המסך&quot;. כשבקשה נכשלת ב-3
          בלילה, אתה צריך לדעת <strong>מה</strong> קרה, <strong>מתי</strong>,
          וב<strong>איזה הקשר</strong> — בדיעבד, מתוך קבצים או מערכת לוגים
          מרכזית.
        </p>
        <p>
          <code>console.log</code> לא נשמר לקובץ, לא מסונן לפי רמת חומרה, ואין
          לו מבנה שקל לחפש בו בכלים כמו CloudWatch, ELK או Grafana Loki. לכן
          משתמשים בספריית logging — הנפוצה ביותר ב-Node היא{" "}
          <strong>winston</strong>.
        </p>
        <LearnCallout variant="tip" title="במשפט אחד">
          לוגים = תיעוד runtime — לדבג, לנטר, לחקור תקלות. Structured (JSON) =
          קל לחיפוש ול-alerts.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="2. רמות (levels)">
        <ul>
          <li>
            <strong>error</strong> — משהו נשבר וצריך טיפול (DB לא זמין,
            exception לא צפוי).
          </li>
          <li>
            <strong>warn</strong> — חריג אבל השרת ממשיך (retry הצליח בניסיון
            שני, route לא נמצא).
          </li>
          <li>
            <strong>info</strong> — אירועים רגילים וחשובים (השרת עלה, חיבור
            ל-DB הצליח).
          </li>
          <li>
            <strong>debug</strong> — פירוט טכני לפיתוח (בדרך כלל כבוי
            ב-production).
          </li>
        </ul>
        <p>
          ה-level שמגדירים ב-logger הוא <strong>סף</strong>: אם הוא{" "}
          <code>info</code>, הודעות <code>debug</code> לא ייכתבו בכלל. כך
          שולטים ברעש בלי לשנות קוד — רק config.
        </p>
      </LearnSection>

      <LearnSection title="3. winston — איך זה בנוי">
        <LearnCode
          label="logger.ts — הגדרה טיפוסית"
          code={`import { createLogger, format, transports } from "winston";

const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" }),
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  ],
});

export default logger;`}
        />
        <p>
          <strong>transports</strong> = לאן הלוג הולך: כאן קובץ נפרד ל-errors,
          קובץ מרכזי לכל הרמות, וקונסול צבעוני לפיתוח. אותו{" "}
          <code>logger.error(...)</code> אחד — מגיע לכל היעדים במקביל.
        </p>
      </LearnSection>

      <LearnSection title="4. איך משתמשים בקוד">
        <p>
          מגדירים logger אחד בקובץ מרכזי ומייבאים אותו בכל מקום — לא יוצרים
          logger חדש בכל מודול:
        </p>
        <LearnCode
          label="שימוש יומיומי"
          code={`import logger from "./logger";

logger.info("Server started on port 3000");
logger.info("User registered", { userId: user.id });
logger.warn(\`Route not found: \${req.method} \${req.originalUrl}\`);
logger.error("DB connection failed", { error: err.message });
logger.error(err.message, { stack: err.stack }); // ב-error handler`}
        />
        <LearnCallout variant="warn" title="מה לא לרשום">
          סיסמאות, JWT מלא, מספרי כרטיס אשראי, PII מיותר. אם חייבים להזכיר —
          mask (למשל ארבע ספרות אחרונות בלבד).
        </LearnCallout>
      </LearnSection>

      <LearnSection title="5. Structured logging — למה JSON">
        <p>
          כל שורת לוג היא אובייקט JSON עם שדות קבועים:
        </p>
        <LearnCode
          label="שורת לוג structured"
          code={`{"level":"error","message":"DB connection failed","timestamp":"2026-07-17T10:32:01.412Z","service":"orders-api"}`}
        />
        <p>
          זה מאפשר שאילתות כמו &quot;כל ה-errors של orders-api ב-24 השעות
          האחרונות&quot; ו-alerts אוטומטיים. עם console.log חופשי — כמעט בלתי
          אפשרי בקנה מידה.
        </p>
        <p>
          נהוג להוסיף שדות הקשר: <code>requestId</code> (correlation ID שנוצר
          בתחילת כל בקשה), <code>userId</code>, שם ה-service — כך אפשר לעקוב
          אחרי בקשה אחת לאורך כל הלוגים.
        </p>
      </LearnSection>

      <LearnSection title="6. לוג לכל בקשה — request logging">
        <p>
          דפוס נפוץ: middleware שרושם שורה על כל בקשה נכנסת — method, path,
          status, וזמן תגובה:
        </p>
        <LearnCode
          label="request logger middleware"
          code={`app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    logger.info("request", {
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs: Date.now() - start,
    });
  });
  next();
});`}
        />
        <p>
          יש גם ספריות מוכנות לזה (<code>morgan</code>,{" "}
          <code>express-winston</code>) — אבל שווה להבין שזה בסך הכל middleware
          פשוט.
        </p>
      </LearnSection>

      <LearnSection title="7. טעויות נפוצות">
        <ul>
          <li>
            לרשום הכל ב-<code>info</code> — ואז אי אפשר להבחין בין רעש לתקלה
            אמיתית.
          </li>
          <li>
            לרשום אובייקט שגיאה בלי <code>stack</code> — נשארים עם הודעה בלי
            מקור.
          </li>
          <li>
            console.log &quot;זמני&quot; שנשכח בקוד — עובר דרך אחת:{" "}
            <code>logger.debug</code> שמכובה ב-production.
          </li>
          <li>
            לוגים עם מידע רגיש — נשארים בקבצים ובמערכות צד שלישי הרבה זמן.
          </li>
        </ul>
        <p className="mt-2 mb-0">
          המשך: <Link to="/learn/node-process">Process ו-Graceful Shutdown</Link>{" "}
          — סגירה נקייה של חיבורים.
        </p>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>winston &gt; console.log ב-production</li>
          <li>levels: error, warn, info, debug — level הוא סף</li>
          <li>JSON + timestamp = structured, קל לחיפוש</li>
          <li>logger מרכזי אחד, מיובא בכל מקום</li>
          <li>בלי סיסמאות/tokens בלוגים</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default NodeLoggingLearnPage;
