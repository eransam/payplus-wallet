import { Link } from "react-router-dom";
import LearnCallout from "../../../components/learn/LearnCallout";
import LearnCode from "../../../components/learn/LearnCode";
import LearnSection from "../../../components/learn/LearnSection";
import LearnTopicLayout from "../../../components/learn/LearnTopicLayout";

function NodeMiddlewareLearnPage() {
  return (
    <LearnTopicLayout
      slug="node-middleware"
      objectives={[
        "להבין מה middleware עושה ומתי קוראים ל-next()",
        "להכיר שרשרת טיפוסית: cors, helmet, json, auth",
        "להבין למה סדר ההרצה קובע תוצאה",
        "לכתוב middleware של אימות שמוסיף req.user",
      ]}
    >
      <LearnSection title="1. מאפס — מה זה middleware?">
        <p>
          Middleware הוא <strong>פונקציה</strong> ש-Express מריץ{" "}
          <em>לפני</em> (או במקום) ה-handler הסופי. היא מקבלת{" "}
          <code>(req, res, next)</code> ויכולה:
        </p>
        <ul>
          <li>לשנות את <code>req</code> (למשל לפרסר JSON ל-<code>req.body</code>)</li>
          <li>לשלוח תשובה ולסיים (<code>res.json(...)</code>)</li>
          <li>להעביר הלאה עם <code>next()</code></li>
          <li>להעביר שגיאה עם <code>next(err)</code></li>
        </ul>
        <LearnCallout variant="tip" title="דימוי">
          כמו תחנות על מסוע: כל בקשה עוברת תחנה אחר תחנה — עד שמגיעה ל-route
          הנכון או נעצרת בשגיאה.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="2. next() — להמשיך או לעצור">
        <LearnCode
          label="middleware פשוט"
          code={`function logRequest(req, res, next) {
  console.log(req.method, req.url);
  next(); // חובה — אחרת הבקשה "תיתקע"
}

app.use(logRequest);`}
        />
        <p>
          בלי <code>next()</code> הלקוח יחכה עד timeout. עם{" "}
          <code>next(error)</code> Express קופץ ישר ל-error middleware (זה
          עם 4 הפרמטרים).
        </p>
      </LearnSection>

      <LearnSection title="3. שרשרת טיפוסית באפליקציה אמיתית">
        <LearnCode
          label="סדר ההרצה (מלמעלה למטה)"
          code={`app.use(cors());              // 1 — CORS headers
app.use(helmet());              // 2 — headers של אבטחה
app.use(express.json());        // 3 — req.body = אובייקט
app.use(express.urlencoded());  // 4 — טפסים

app.use("/api/auth", authRouter);            // ציבורי
app.use("/api", requireAuth, protectedRouter); // 5 — דורש token

app.use((_req, res) => res.status(404).json({ error: "Not found" }));
app.use(errorHandler);          // 6 — תמיד אחרון`}
        />
        <ul>
          <li>
            <strong>cors</strong> — מאפשר לפרונט שרץ על origin אחר לקרוא
            ל-API.
          </li>
          <li>
            <strong>helmet</strong> — מוסיף headers של אבטחה לכל תשובה.
          </li>
          <li>
            <strong>express.json</strong> — קורא body כ-JSON; בלי זה{" "}
            <code>req.body</code> יהיה <code>undefined</code>.
          </li>
          <li>
            <strong>requireAuth</strong> — רק על ה-prefix המוגן (לא על auth
            / health).
          </li>
        </ul>
      </LearnSection>

      <LearnSection title="4. requireAuth — middleware שמגן">
        <LearnCode
          label="auth middleware (רעיון)"
          code={`export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required" });
  }
  const token = header.slice("Bearer ".length).trim();
  try {
    req.user = verifyToken(token); // מפענח את ה-JWT
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}`}
        />
        <p>
          אם ה-token תקין — <code>req.user</code> מתמלא והבקשה ממשיכה
          ל-handler, שכבר יודע מי המשתמש. אם לא — הבקשה נעצרת עם 401 ואף
          route מוגן לא רץ.
        </p>
      </LearnSection>

      <LearnSection title="5. למה הסדר חשוב">
        <LearnCallout variant="warn" title="טעות נפוצה">
          לשים את ה-error handler <em>לפני</em> ה-routes — אז שגיאות מה-routes
          לא יגיעו אליו. הוא חייב להיות <strong>אחרי</strong> כל ה-routes
          (וגם אחרי ה-404).
        </LearnCallout>
        <ul>
          <li>
            <code>express.json</code> חייב לרוץ לפני route שקורא{" "}
            <code>req.body</code>.
          </li>
          <li>
            middleware של אימות שמים רק על prefix שצריך הגנה — routes של
            login / register נשארים ציבוריים.
          </li>
          <li>
            middleware ספציפי ל-route:{" "}
            <code>router.post("/x", myMw, handler)</code> — רץ רק על path
            אחד.
          </li>
        </ul>
      </LearnSection>

      <LearnSection title="6. error middleware — התחנה האחרונה">
        <p>
          חשוב להבין: <strong>לא מספיק לכתוב את הפונקציה</strong> — צריך גם
          לרשום אותה ב-app, כמו כל middleware. שני שלבים:
        </p>
        <LearnCode
          label="שלב 1 — כותבים את הפונקציה (קובץ נפרד)"
          code={`// middleware/error-handler.ts
export function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.status ?? 500;
  res.status(status).json({
    error: { message: err.message ?? "Internal server error" },
  });
}`}
        />
        <LearnCode
          label="שלב 2 — רושמים אותה בקובץ הראשי, אחרונה"
          code={`const app = express();

app.use(express.json());
app.use("/api/users", usersRouter);   // כל ה-routes

app.use(errorHandler);                // ← כאן! תמיד אחרי הכל
app.listen(3000);`}
        />
        <LearnCallout variant="info" title="איך Express יודע שזו פונקציית שגיאות?">
          לפי <strong>מספר הפרמטרים</strong>. Express סופר: 3 פרמטרים{" "}
          <code>(req, res, next)</code> = middleware רגיל; 4 פרמטרים{" "}
          <code>(err, req, res, next)</code> = error handler. זה כל הקסם —
          אין שום רישום מיוחד מעבר ל-<code>app.use</code> הרגיל.
        </LearnCallout>
        <p>ואיך שגיאה בכלל מגיעה אליה? דרך <code>next(err)</code>:</p>
        <LearnCode
          label="הדרך של שגיאה אל ה-error handler"
          code={`router.get("/", async (req, res, next) => {
  try {
    const users = await userService.getAll();
    res.json(users);
  } catch (err) {
    next(err); // ← "יש שגיאה!" — Express מדלג על כל השאר
               //    וקופץ ישר ל-errorHandler
  }
});`}
        />
        <p>
          למה היא חייבת להיות <strong>אחרונה</strong>? כי Express עובר על
          ה-middleware לפי סדר הרישום, ו-<code>next(err)</code> מחפש את
          ה-error handler הבא <strong>מהנקודה הנוכחית והלאה</strong>. אם
          רשמת אותה לפני ה-routes — שגיאות מהם פשוט לא ימצאו אותה.
        </p>
        <p>
          התוצאה: מקום <strong>אחד מרכזי</strong> לכל השגיאות באפליקציה —
          לוג אחיד, תשובת JSON אחידה, ואין צורך לכתוב טיפול שגיאות בכל
          route מחדש.
        </p>
        <p className="mt-2 mb-0">
          המשך:{" "}
          <Link to="/learn/node-architecture">ארכיטקטורת שכבות</Link> — אחרי
          שהבקשה עברה middleware, מי מטפל בלוגיקה?
        </p>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>middleware = (req, res, next) לפני handler</li>
          <li>next() ממשיך; next(err) לשגיאות</li>
          <li>cors → helmet → json → routes → 404 → error handler</li>
          <li>middleware של אימות מוסיף req.user ומחזיר 401 כשאין token</li>
          <li>סדר קובע — json לפני body, errors בסוף</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default NodeMiddlewareLearnPage;
