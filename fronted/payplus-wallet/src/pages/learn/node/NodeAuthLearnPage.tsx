import { Link } from "react-router-dom";
import LearnCallout from "../../../components/learn/LearnCallout";
import LearnCode from "../../../components/learn/LearnCode";
import LearnSection from "../../../components/learn/LearnSection";
import LearnTopicLayout from "../../../components/learn/LearnTopicLayout";

function NodeAuthLearnPage() {
  return (
    <LearnTopicLayout
      slug="node-auth"
      objectives={[
        "להבין JWT — token חתום בלי session בשרת",
        "לעקוב אחרי הזרימה: login → token → Authorization header",
        "לדעת לכתוב auth middleware שמגן על routes",
        "להבין את ההבדל בין 401 ל-403",
      ]}
    >
      <LearnSection title="1. מאפס — למה API צריך Auth">
        <p>
          כמעט כל API אמיתי מגן על חלק מה-endpoints שלו. לפני שמרשים למשתמש
          לקרוא נתונים אישיים או לבצע פעולה, צריך לדעת <strong>מי</strong> הוא
          — ולוודא שהוא באמת מחובר. זה נקרא <strong>Authentication</strong>{" "}
          (אימות זהות), להבדיל מ-<strong>Authorization</strong> (בדיקת
          הרשאות — מה מותר לו לעשות).
        </p>
        <p>
          הדרך הנפוצה ביותר ב-APIs מודרניים: <strong>JWT</strong> (JSON Web
          Token) — מחרוזת חתומה שהשרת מנפיק ב-login, והלקוח שולח בכל בקשה
          מוגנת. השרת לא שומר session — הכל בתוך ה-token.
        </p>
        <LearnCallout variant="tip" title="במשפט אחד">
          Login מחזיר token → הלקוח שומר (localStorage / memory) → שולח{" "}
          <code>Authorization: Bearer &lt;token&gt;</code> → middleware בודק
          לפני כל route מוגן.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="2. מבנה JWT — שלושה חלקים">
        <p>
          JWT הוא שלוש מחרוזות base64 מופרדות בנקודה:{" "}
          <code>header.payload.signature</code>.
        </p>
        <ul>
          <li>
            <strong>Header</strong> — האלגוריתם (למשל HS256).
          </li>
          <li>
            <strong>Payload</strong> — הנתונים: <code>userId</code>,{" "}
            <code>email</code>, זמן תפוגה (<code>exp</code>). שימו לב: זה{" "}
            <strong>לא מוצפן</strong>, רק מקודד — כל אחד יכול לקרוא.
          </li>
          <li>
            <strong>Signature</strong> — חתימה עם סוד (secret) שרק השרת מכיר.
            בלי הסוד אי אפשר לזייף token תקף.
          </li>
        </ul>
        <LearnCallout variant="warn" title="לא לשים סודות ב-payload">
          ה-payload קריא לכל מי שמחזיק את ה-token. שמים בו מזהים (id, email)
          — לא סיסמאות ולא מידע רגיש.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="3. Register / Login — איך נוצר ה-token">
        <p>
          בהרשמה הסיסמה נשמרת כ-<strong>hash</strong> (bcrypt — נרחיב בשיעור
          האבטחה), לא כטקסט גלוי. ב-login משווים את הסיסמה ל-hash, ואם תקין —
          חותמים token עם <code>jwt.sign</code>.
        </p>
        <LearnCode
          label="auth-service.ts — login גנרי"
          code={`import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function login(email: string, password: string) {
  const user = await usersRepository.findByEmail(email);
  if (!user) throw new Error("Invalid credentials");

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new Error("Invalid credentials");

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { user, token };
}`}
        />
        <LearnCode
          label="POST /api/auth/login — בקשה ותגובה"
          code={`// Request
{ "email": "user@example.com", "password": "secret123" }

// Response
{
  "success": true,
  "user": { "id": 1, "email": "user@example.com" },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}`}
        />
        <p>
          ה-<code>JWT_SECRET</code> מגיע ממשתני סביבה — לעולם לא כתוב בקוד ולא
          נכנס ל-git.
        </p>
      </LearnSection>

      <LearnSection title="4. שליחת ה-token מהלקוח">
        <p>
          כל בקשה ל-route מוגן חייבת לכלול את ה-token ב-header סטנדרטי:
        </p>
        <LearnCode
          label="Authorization header"
          code={`GET /api/orders
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

// ב-fetch
fetch("/api/orders", {
  headers: {
    Authorization: \`Bearer \${token}\`,
  },
});`}
        />
        <p>
          בצד הלקוח שומרים את ה-token אחרי login (memory, localStorage או
          cookie) ומצרפים אותו בשכבת ה-API — פעם אחת, במקום אחד, ולא בכל
          קריאה ידנית.
        </p>
      </LearnSection>

      <LearnSection title="5. requireAuth — middleware שמגן על routes">
        <p>
          Middleware רץ <strong>לפני</strong> ה-handler. הוא קורא את ה-header,
          מפרק את ה-Bearer, מאמת עם <code>jwt.verify</code>, ומצמיד את ה-payload
          ל-<code>req.user</code> — כך שכל handler בהמשך יודע מי המשתמש.
        </p>
        <LearnCode
          label="auth.middleware.ts"
          code={`import jwt from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const token = header.slice("Bearer ".length).trim();
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    (req as any).user = payload;
    next(); // ממשיכים ל-handler
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}`}
        />
        <LearnCallout variant="warn" title="401 vs 403">
          401 Unauthorized = לא מזוהה / token חסר או לא תקף. 403 Forbidden =
          מזוהה, אבל אין לו הרשאה לפעולה (למשל user רגיל שמנסה route של
          admin).
        </LearnCallout>
      </LearnSection>

      <LearnSection title="6. איפה מחילים את ה-middleware">
        <p>
          סדר ה-routes קובע מה פתוח ומה מוגן — routes ציבוריים קודם, ואז
          middleware שמגן על כל השאר:
        </p>
        <LearnCode
          label="סדר routes באפליקציית Express"
          code={`app.use("/api/health", healthRouter);          // פתוח
app.use("/api/auth", authRouter);              // register/login — פתוח
app.use("/api", requireAuth);                  // מכאן והלאה — מוגן
app.use("/api/orders", ordersRouter);
app.use("/api/users", usersRouter);

// או נקודתית, על route בודד:
router.get("/profile", requireAuth, getProfile);`}
        />
        <p>
          אפשר להחיל גלובלית על prefix שלם, או נקודתית על route ספציפי —
          תלוי כמה מה-API מוגן.
        </p>
      </LearnSection>

      <LearnSection title="7. טעויות נפוצות">
        <ul>
          <li>
            להחזיר &quot;user not found&quot; לעומת &quot;wrong password&quot;
            — עדיף הודעה אחידה (&quot;Invalid credentials&quot;) שלא מגלה אילו
            emails קיימים.
          </li>
          <li>
            לשכוח <code>expiresIn</code> — token בלי תפוגה תקף לנצח, גם אחרי
            שהמשתמש &quot;התנתק&quot;.
          </li>
          <li>
            לסמוך על ה-payload בלי <code>jwt.verify</code> — הקידוד קריא לכולם;
            רק החתימה מוכיחה שהשרת הנפיק אותו.
          </li>
          <li>
            לשים JWT_SECRET בקוד או ב-git — תמיד ממשתני סביבה.
          </li>
        </ul>
        <p className="mt-2 mb-0">
          המשך: <Link to="/learn/node-security">אבטחת API</Link> — helmet,
          cors, והגנה על סיסמאות.
        </p>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>JWT = token חתום, stateless — header.payload.signature</li>
          <li>login → jwt.sign → token → Bearer header</li>
          <li>requireAuth = middleware עם jwt.verify לפני ה-handlers</li>
          <li>401 = לא מזוהה, 403 = אין הרשאה</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default NodeAuthLearnPage;
