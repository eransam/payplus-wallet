import { Link } from "react-router-dom";
import LearnCallout from "../../../components/learn/LearnCallout";
import LearnCode from "../../../components/learn/LearnCode";
import LearnSection from "../../../components/learn/LearnSection";
import LearnTopicLayout from "../../../components/learn/LearnTopicLayout";

function NodeSecurityLearnPage() {
  return (
    <LearnTopicLayout
      slug="node-security"
      objectives={[
        "להכיר helmet ו-cors — מה כל אחד עושה",
        "להבין למה סיסמאות נשמרות רק כ-hash (bcrypt)",
        "לדעת לא לחשוף stack traces ב-production",
        "להכיר rate limiting והגבלת גודל body",
      ]}
    >
      <LearnSection title="1. מאפס — אבטחת API זה שכבות">
        <p>
          Express לא &quot;מאובטח מעצמו&quot;. שרת production צריך כמה שכבות
          הגנה: headers נכונים, CORS מוגדר, סיסמאות שלא נשמרות בגלוי, ותגובות
          שגיאה שלא חושפות פרטים פנימיים לתוקף.
        </p>
        <p>
          החדשות הטובות: רוב השכבות האלו הן middleware — שורה-שתיים בהגדרת
          האפליקציה, ומרגע זה הן רצות על כל בקשה.
        </p>
        <LearnCallout variant="tip" title="עקרון מנחה">
          Defense in depth — אף שכבה לא מספיקה לבד. auth לא מחליף CORS, CORS
          לא מחליף validation, ואף אחד מהם לא מחליף hashing לסיסמאות.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="2. helmet — headers של הגנה">
        <p>
          <code>helmet</code> מגדיר HTTP headers שמקשים על התקפות נפוצות (XSS,
          clickjacking, MIME sniffing). זה middleware — רץ על כל בקשה:
        </p>
        <LearnCode
          label="שימוש בסיסי"
          code={`import express from "express";
import helmet from "helmet";

const app = express();
app.use(helmet());

// אפשר לכוונן חלקים ספציפיים:
app.use(
  helmet({
    contentSecurityPolicy: false, // למשל אם כלי docs צריך inline scripts
  })
);`}
        />
        <p>
          בין ה-headers שהוא מוסיף: <code>X-Content-Type-Options: nosniff</code>
          , <code>X-Frame-Options</code> (נגד clickjacking), והסרת{" "}
          <code>X-Powered-By</code> שמסגיר שמדובר ב-Express.
        </p>
      </LearnSection>

      <LearnSection title="3. cors — מי רשאי לקרוא מהדפדפן">
        <p>
          דפדפן חוסם בקשות cross-origin (מ-domain אחר) אלא אם השרת מאשר
          במפורש. <code>cors()</code> מוסיף את ה-headers שמאפשרים לאפליקציית
          frontend שרצה על domain אחר לדבר עם ה-API.
        </p>
        <LearnCode
          label="בסיסי ומוגבל"
          code={`import cors from "cors";

app.use(cors()); // development — פתוח לכל origin

// production — מגבילים לדומיין המוכר:
app.use(cors({ origin: "https://app.example.com" }));

// כמה origins:
app.use(cors({
  origin: ["https://app.example.com", "https://admin.example.com"],
}));`}
        />
        <p>
          חשוב להבין: CORS רלוונטי רק ל<strong>דפדפן</strong>. Postman, curl,
          או שרת-לשרת לא מוגבלים ב-CORS — לכן CORS הוא לא מנגנון אבטחה בפני
          עצמו, ועדיין צריך auth.
        </p>
      </LearnSection>

      <LearnSection title="4. bcrypt — סיסמאות לא בטקסט גלוי">
        <p>
          אם ה-DB נפרץ, hash לא ניתן להפיכה חזרה לסיסמה (בניגוד ל-plain text
          או להצפנה הפיכה). <code>bcrypt</code> גם מוסיף salt אקראי וגם איטי
          בכוונה (salt rounds) — מה שמאט מאוד brute force.
        </p>
        <LearnCode
          label="hash בהרשמה, compare בהתחברות"
          code={`import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

// register
const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
await usersRepository.create({ email, passwordHash });

// login
const ok = await bcrypt.compare(password, user.passwordHash);
if (!ok) throw new Error("Invalid credentials");`}
        />
        <LearnCallout variant="warn" title="לעולם לא">
          לא לשמור סיסמה בלוג. לא לשלוח סיסמה ב-query string. סודות (JWT
          secret, סיסמת DB, API keys) רק במשתני סביבה — לא בקוד ולא ב-git.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="5. שגיאות — אל תחשוף stack ב-production">
        <p>
          stack trace מגלה נתיבי קבצים, גרסאות ספריות, ולוגיקה פנימית — מתנה
          לתוקף. ב-development הוא עוזר לדבג; ב-production מחזירים הודעה
          גנרית, ואת הפרטים המלאים כותבים ללוג בלבד.
        </p>
        <LearnCode
          label="error handler — dev מול production"
          code={`const isDevelopment = process.env.NODE_ENV !== "production";

app.use((err, req, res, next) => {
  logger.error(err.message, { stack: err.stack }); // תמיד ללוג

  res.status(500).json({
    error: {
      code: "internal_error",
      message: isDevelopment ? err.message : "Internal server error",
      ...(isDevelopment && err.stack ? { stack: err.stack } : {}),
    },
  });
});`}
        />
        <p>
          המפתחים רואים הכל בלוגים — הלקוח (והתוקף) רואים רק הודעה כללית.
        </p>
      </LearnSection>

      <LearnSection title="6. הגבלות — body size ו-rate limiting">
        <p>
          עוד שתי שכבות זולות שמגינות מפני שימוש לרעה:
        </p>
        <LearnCode
          label="הגבלת גודל ו-rate limit"
          code={`import rateLimit from "express-rate-limit";

// body ענק = צריכת זיכרון = DoS פשוט
app.use(express.json({ limit: "1mb" }));

// הגבלת קצב — למשל על login, נגד brute force
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 דקות
  max: 10,                  // 10 ניסיונות לחלון
});
app.use("/api/auth/login", loginLimiter);`}
        />
        <ul>
          <li>
            <code>express.json({`{ limit }`})</code> — דוחה body גדול מדי לפני
            שהוא נטען לזיכרון.
          </li>
          <li>
            rate limiting — קריטי במיוחד על endpoints של auth.
          </li>
          <li>
            routes לא קיימים → להחזיר 404 JSON מסודר, לא עמוד HTML default של
            Express שמסגיר את ה-framework.
          </li>
        </ul>
      </LearnSection>

      <LearnSection title="7. צ'קליסט מהיר ל-production">
        <ul>
          <li><code>helmet()</code> מופעל.</li>
          <li>CORS מוגבל ל-origins מוכרים.</li>
          <li>סיסמאות רק כ-bcrypt hash.</li>
          <li>סודות רק במשתני סביבה.</li>
          <li>stack traces לא מוחזרים ללקוח.</li>
          <li>body limit + rate limiting על auth.</li>
          <li>validation על כל input שמגיע מהמשתמש.</li>
        </ul>
        <p className="mt-2 mb-0">
          המשך: <Link to="/learn/node-logging">Logging</Link> — winston ולוגים
          מסודרים.
        </p>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>helmet = headers הגנה, מוסתר X-Powered-By</li>
          <li>cors = מי מהדפדפן יכול לקרוא — לא מנגנון auth</li>
          <li>bcrypt = hash + salt לסיסמאות, איטי בכוונה</li>
          <li>production: בלי stack ללקוח, כן ללוג</li>
          <li>body limit + rate limit = הגנת DoS/brute force</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default NodeSecurityLearnPage;
