import { Link } from "react-router-dom";
import LearnCallout from "../../../components/learn/LearnCallout";
import LearnCode from "../../../components/learn/LearnCode";
import LearnSection from "../../../components/learn/LearnSection";
import LearnTopicLayout from "../../../components/learn/LearnTopicLayout";

function NodeProcessLearnPage() {
  return (
    <LearnTopicLayout
      slug="node-process"
      objectives={[
        "להכיר את האובייקט process — env, pid, exit",
        "להבין signals — SIGTERM, SIGINT",
        "ללמוד graceful shutdown: סגירה נקייה של שרת וחיבורים",
        "לדעת למה זה קריטי ב-deploy וב-scale",
      ]}
    >
      <LearnSection title="1. process — התהליך של Node">
        <p>
          כשמריצים <code>node app.js</code>, מערכת ההפעלה מפעילה{" "}
          <strong>process</strong> אחד של Node. האובייקט הגלובלי{" "}
          <code>process</code> הוא הממשק של הקוד שלך אל התהליך הזה: משתני
          סביבה, arguments, קודי יציאה, ו-signals.
        </p>
        <LearnCode
          label="דוגמאות בסיסיות"
          code={`process.env.NODE_ENV   // "development" | "production"
process.env.PORT       // משתנה סביבה
process.pid            // מזהה התהליך במערכת ההפעלה
process.argv           // arguments משורת הפקודה
process.exit(1)        // יציאה מיידית עם קוד שגיאה
process.exit(0)        // יציאה תקינה`}
        />
        <LearnCallout variant="warn" title="process.exit קוטע הכל">
          <code>process.exit()</code> לא מחכה לכלום — לא ל-callbacks, לא
          לכתיבות לוג שבדרך. משתמשים בו רק אחרי שסיימתם לסגור הכל בצורה
          מסודרת.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="2. process.env — config וסודות">
        <p>
          סודות (JWT secret, DB URL, API keys) לא נכתבים בקוד — הם מגיעים
          ממשתני סביבה: קובץ <strong>.env</strong> מקומי בפיתוח (נטען עם{" "}
          <code>dotenv</code>), ומשתני סביבה אמיתיים בשרת production.
        </p>
        <LearnCode
          label="ריכוז הקריאה ל-env בקובץ config אחד"
          code={`import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  isProduction: process.env.NODE_ENV === "production",
  databaseUrl: process.env.DATABASE_URL!,
};`}
        />
        <LearnCallout variant="tip" title="דפוס מומלץ">
          קובץ config אחד קורא מ-process.env ומאמת ערכים — שאר הקוד מייבא את
          ה-config ולא נוגע ב-env ישירות בכל מקום. טעות בשם משתנה מתגלה במקום
          אחד.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="3. Signals — למה השרת &quot;נכבה&quot;">
        <p>
          ב-production, ה-orchestrator (Docker, Kubernetes, systemd) לא הורג
          את התהליך מיד. קודם הוא שולח <strong>SIGTERM</strong> —
          &quot;בבקשה סיים בעדינות&quot; — ורק אחרי grace period (למשל 30
          שניות) שולח SIGKILL שאי אפשר לתפוס. Ctrl+C בטרמינל שולח{" "}
          <strong>SIGINT</strong>.
        </p>
        <p>
          בלי handler ל-signals, Node עלול להיעצר באמצע טיפול בבקשה: connection
          pool פתוח, כתיבות ל-DB באמצע, לקוחות שמקבלים connection reset.
        </p>
        <LearnCode
          label="האזנה ל-signals"
          code={`process.on("SIGTERM", () => {
  console.log("Received SIGTERM");
});

process.on("SIGINT", () => {
  console.log("Received SIGINT (Ctrl+C)");
});`}
        />
      </LearnSection>

      <LearnSection title="4. Graceful Shutdown — הדפוס המלא">
        <p>
          הסדר הנכון לסגירה:
        </p>
        <ol>
          <li>
            מפסיקים לקבל בקשות חדשות (<code>server.close()</code>).
          </li>
          <li>מחכים שהבקשות הפעילות יסתיימו (או timeout).</li>
          <li>סוגרים חיבורים חיצוניים — DB pool, Redis, message queue.</li>
          <li>
            <code>process.exit(0)</code>.
          </li>
        </ol>
        <LearnCode
          label="graceful shutdown באפליקציית Express"
          code={`import express from "express";

const app = express();
const server = app.listen(3000, () => {
  console.log("API listening on port 3000");
});

async function shutdown(signal: string) {
  console.log(\`Received \${signal}, shutting down...\`);

  server.close(async () => {
    try {
      await db.end();        // סגירת connection pool
      await cache.quit();    // סגירת client של cache
      console.log("Connections closed");
      process.exit(0);
    } catch (err) {
      console.error("Shutdown error:", err);
      process.exit(1);
    }
  });

  // אם משהו נתקע — יציאה כפויה אחרי 10 שניות
  setTimeout(() => process.exit(1), 10000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));`}
        />
        <p>
          שימו לב ל-<code>.unref()</code> על ה-timeout: הוא אומר ל-Node לא
          להחזיק את התהליך חי רק בגלל ה-timer — אם הכל נסגר קודם, התהליך יוצא
          מיד.
        </p>
      </LearnSection>

      <LearnSection title="5. למה זה קריטי ב-deploy">
        <ul>
          <li>
            <strong>Rolling deploy:</strong> instance ישן מקבל SIGTERM בזמן
            שהחדש עולה — בקשות באמצע צריכות להסתיים, לא להיחתך.
          </li>
          <li>
            <strong>Connection pool:</strong> <code>pool.end()</code> משחרר
            חיבורים ל-DB — בלי זה נשארים חיבורים &quot;יתומים&quot; עד
            שה-DB מנקה אותם בעצמו.
          </li>
          <li>
            <strong>עבודה באמצע:</strong> כתיבה חצי-גמורה או הודעה שנקראה
            מ-queue ולא אושרה — graceful shutdown נותן לזה להסתיים.
          </li>
          <li>
            <strong>Autoscaling:</strong> ב-scale down מכבים instances כל
            הזמן — התהליך הזה חייב להיות בטוח ושגרתי.
          </li>
        </ul>
      </LearnSection>

      <LearnSection title="6. שגיאות לא תפוסות — הרשת האחרונה">
        <p>
          שני אירועים ברמת ה-process תופסים שגיאות שאף אחד לא טיפל בהן:
        </p>
        <LearnCode
          label="uncaughtException / unhandledRejection"
          code={`process.on("uncaughtException", (err) => {
  logger.error("Uncaught exception", { stack: err.stack });
  process.exit(1); // המצב לא אמין — יוצאים ונותנים ל-orchestrator להרים מחדש
});

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled rejection", { reason });
  process.exit(1);
});`}
        />
        <LearnCallout variant="warn" title="לרשום ולצאת — לא להמשיך">
          אחרי uncaughtException מצב התהליך לא ידוע. הדפוס המקובל: לרשום ללוג
          ולצאת עם קוד 1 — ה-orchestrator (או process manager כמו PM2) ירים
          instance נקי.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="7. טעויות נפוצות">
        <ul>
          <li>
            בלי handlers ל-SIGTERM בכלל — כל deploy חותך בקשות באמצע.
          </li>
          <li>
            <code>process.exit(0)</code> מיד עם קבלת ה-signal — בלי לחכות
            לבקשות פעילות; זה בדיוק מה שרצינו למנוע.
          </li>
          <li>
            בלי force-exit timeout — בקשה תקועה יכולה למנוע יציאה לנצח,
            עד שה-SIGKILL מגיע.
          </li>
          <li>
            לתפוס uncaughtException ולהמשיך לרוץ — התהליך במצב לא ידוע.
          </li>
        </ul>
        <p className="mt-2 mb-0">
          המשך: <Link to="/learn/node-streams">Streams</Link> — קריאה/כתיבה
          בחלקים.
        </p>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>process.env = config וסודות, מרוכז בקובץ config אחד</li>
          <li>SIGTERM/SIGINT = בקשה לסגור בעדינות</li>
          <li>graceful = server.close → סגירת חיבורים → exit(0)</li>
          <li>timeout כפוי + unref כרשת ביטחון</li>
          <li>uncaughtException → לרשום ולצאת, לא להמשיך</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default NodeProcessLearnPage;
