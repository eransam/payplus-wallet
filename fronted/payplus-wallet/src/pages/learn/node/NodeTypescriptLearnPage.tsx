import { Link } from "react-router-dom";
import LearnCallout from "../../../components/learn/LearnCallout";
import LearnCode from "../../../components/learn/LearnCode";
import LearnSection from "../../../components/learn/LearnSection";
import LearnTopicLayout from "../../../components/learn/LearnTopicLayout";

function NodeTypescriptLearnPage() {
  return (
    <LearnTopicLayout
      slug="node-typescript"
      objectives={[
        "להבין למה TypeScript על backend",
        "להכיר ts-node, tsc וחבילות @types",
        "לדעת לטype Request/Response ב-Express",
        "לבנות מודלים (interfaces) לשכבת ה-domain",
      ]}
    >
      <LearnSection title="1. למה TS ולא JS בשרת">
        <p>
          ב-API יש הרבה &quot;חוזים&quot;: אילו שדות יש ב-body, מה ה-shape של
          אובייקט שחוזר מה-DB, אילו status codes מוחזרים.{" "}
          <strong>TypeScript</strong> תופס טעויות ב-compile time — שדה חסר,
          typo, null לא צפוי — לפני שהקוד בכלל רץ, ובטח לפני deploy.
        </p>
        <p>
          ככל שהפרויקט גדל והקוד עובר בין שכבות (routes → services →
          repositories), ה-types הם התיעוד החי של מה עובר בין השכבות.
        </p>
        <LearnCallout variant="tip" title="במשפט אחד">
          TS = JS + types. ב-backend זה מונע קטגוריה שלמה של באגים במעברים
          בין שכבות — והשגיאות מתגלות בעורך, לא ב-production.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="2. ts-node, tsc והסקריפטים">
        <LearnCode
          label="package.json — סקריפטים טיפוסיים"
          code={`"scripts": {
  "dev": "nodemon --exec ts-node src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js",
  "typecheck": "tsc --noEmit"
}`}
        />
        <ul>
          <li>
            <code>ts-node</code> — מתרגם TS on-the-fly, נוח לפיתוח.
          </li>
          <li>
            <code>tsc</code> — מקמפל ל-JS בתיקיית <code>dist</code>;
            ב-production מריצים את ה-JS המקומפל.
          </li>
          <li>
            <code>tsc --noEmit</code> — בודק types בלי לייצר קבצים — מושלם
            ל-CI.
          </li>
        </ul>
        <p>
          ספריות JS לא מכירות types בעצמן — מתקינים חבילות{" "}
          <code>@types/express</code>, <code>@types/node</code> וכו&apos;
          כ-devDependencies, ו-TS יודע לקרוא את ה-API שלהן.
        </p>
      </LearnSection>

      <LearnSection title="3. Types ל-Express — Request / Response">
        <LearnCode
          label="route handler מטויפס"
          code={`import { Router } from "express";
import type { NextFunction, Request, Response } from "express";

const router = Router();

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as {
        email: string;
        password: string;
      };
      const result = await authService.login(email, password);
      res.json({ success: true, user: result.user, token: result.token });
    } catch (error) {
      next(error);
    }
  }
);`}
        />
        <p>
          <code>Request</code>, <code>Response</code> ו-<code>NextFunction</code>{" "}
          מגיעים מ-<code>@types/express</code>. ה-<code>req.body</code> מוגדר
          כ-<code>any</code> כברירת מחדל — לכן מוסיפים assertion או validation
          (עדיף ספריית ולידציה כמו zod שגם מייצרת את ה-type).
        </p>
      </LearnSection>

      <LearnSection title="4. הרחבת Request — למשל אחרי auth">
        <p>
          אחרי auth middleware יש <code>req.user</code> — אבל TS לא יודע על
          זה ב-<code>Request</code> רגיל. דפוס נפוץ: intersection type על
          ה-type של ה-framework:
        </p>
        <LearnCode
          label="AuthenticatedRequest"
          code={`import type { NextFunction, Request, Response } from "express";

interface TokenPayload {
  userId: number;
  email: string;
}

export type AuthenticatedRequest = Request & {
  user?: TokenPayload;
};

export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  // ... אימות token ...
  req.user = verifyToken(token); // עכשיו TS מכיר את req.user
  next();
}`}
        />
        <p>
          ה-<code>&amp;</code> (intersection) מרכיב type חדש: כל מה שיש
          ב-<code>Request</code>, ובנוסף <code>user</code>.
        </p>
      </LearnSection>

      <LearnSection title="5. שגיאות מטויפסות — class Error מותאם">
        <LearnCode
          label="AppError — שגיאה עם code ו-status"
          code={`export class AppError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = status;
  }
}

// שימוש
throw new AppError("validation_error", "Email is required", 400);

// ב-error handler
if (err instanceof AppError) {
  // TS יודע כאן על err.status ו-err.code
  return res.status(err.status).json({ error: err.code });
}`}
        />
        <p>
          <code>instanceof</code> הוא type guard — בתוך ה-if, TypeScript מצמצם
          את ה-type ומכיר את השדות הנוספים בלי casting.
        </p>
      </LearnSection>

      <LearnSection title="6. מודלים — interfaces לשכבת ה-domain">
        <p>
          את ה-types של ה-domain מרכזים בקבצי מודלים משותפים — לא מפזרים
          הגדרות כפולות בכל route:
        </p>
        <LearnCode
          label="models/user.ts"
          code={`export type UserRole = "admin" | "member" | "guest";

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: Date;
}

// גזירת types במקום שכפול:
export type NewUser = Omit<User, "id" | "createdAt">;
export type PublicUser = Pick<User, "id" | "email" | "fullName">;`}
        />
        <ul>
          <li>
            <strong>Union of literals</strong> (<code>UserRole</code>) —
            מרשימה סגורה של ערכים; typo נתפס מיד.
          </li>
          <li>
            <strong>Utility types</strong> (<code>Omit</code>,{" "}
            <code>Pick</code>, <code>Partial</code>) — גוזרים types ממודל אחד
            במקום להעתיק ולתחזק כפילויות.
          </li>
        </ul>
      </LearnSection>

      <LearnSection title="7. הגדרות מומלצות ב-tsconfig">
        <LearnCode
          label="tsconfig.json — הבסיס"
          code={`{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "noUnusedLocals": true
  },
  "include": ["src"]
}`}
        />
        <LearnCallout variant="warn" title="strict: true — לא מתפשרים">
          בלי strict, TS מפספס את הבאגים הכי שכיחים (null/undefined). מתחילים
          פרויקט חדש תמיד עם strict — להוסיף אותו אחר כך הרבה יותר כואב.
        </LearnCallout>
        <p className="mt-2 mb-0">
          המשך: <Link to="/learn/node-testing">Testing בשרת</Link> — הקטגוריה
          המתקדמת של המסלול.
        </p>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>TS על backend = פחות באגים בין שכבות, תיעוד חי</li>
          <li>ts-node ל-dev, tsc ל-build, --noEmit ל-CI</li>
          <li>Request/Response מ-@types/express + הרחבה עם &amp;</li>
          <li>מודלים משותפים + Omit/Pick במקום שכפול</li>
          <li>strict: true תמיד</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default NodeTypescriptLearnPage;
