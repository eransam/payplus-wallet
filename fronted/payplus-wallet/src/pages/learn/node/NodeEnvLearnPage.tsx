import { Link } from "react-router-dom";
import LearnCallout from "../../../components/learn/LearnCallout";
import LearnCode from "../../../components/learn/LearnCode";
import LearnSection from "../../../components/learn/LearnSection";
import LearnTopicLayout from "../../../components/learn/LearnTopicLayout";

function NodeEnvLearnPage() {
  return (
    <LearnTopicLayout
      slug="node-env"
      objectives={[
        "להבין process.env ו-dotenv",
        "לדעת מה NODE_ENV משנה (development vs production)",
        "להבין למה סודות לא נכנסים ל-git",
        "להכיר את דפוס קובץ ה-config המרכזי",
      ]}
    >
      <LearnSection title="1. מאפס — למה לא hardcode בקוד?">
        <p>
          כתובת מסד הנתונים, JWT secret, פורט — <strong>משתנים</strong> בין
          מחשב מקומי, staging ו-production. אם כותבים אותם ישירות בקוד:
        </p>
        <ul>
          <li>סודות נחשפים ב-git — כל מי שרואה את הריפו רואה את הסיסמה</li>
          <li>צריך deploy חדש לכל שינוי פורט או כתובת</li>
          <li>אי אפשר לתת לכל מפתח מסד נתונים משלו</li>
        </ul>
        <p>
          הפתרון: <strong>משתני סביבה</strong> (environment variables) —
          הגדרות שחיות מחוץ לקוד ונטענות בזמן הרצה דרך{" "}
          <code>process.env</code>.
        </p>
      </LearnSection>

      <LearnSection title="2. dotenv — קובץ .env מקומי">
        <p>
          בפיתוח מקומי לא נוח להגדיר משתני סביבה ידנית בכל טרמינל. חבילת{" "}
          <code>dotenv</code> קוראת קובץ <code>.env</code> משורש הפרויקט
          ומזריקה את הערכים ל-<code>process.env</code>.
        </p>
        <LearnCode
          label="השורות הראשונות של נקודת הכניסה"
          code={`import dotenv from "dotenv";
dotenv.config(); // קורא .env מהשורש → process.env

// עכשיו זמינים:
process.env.DATABASE_URL
process.env.JWT_SECRET
process.env.NODE_ENV`}
        />
        <LearnCode
          label=".env (דוגמה)"
          code={`PORT=3000
DATABASE_URL=postgresql://dev:dev@localhost:5432/myapp
JWT_SECRET=local-dev-secret
NODE_ENV=development`}
        />
        <p>
          <code>.env</code> נמצא ב-<code>.gitignore</code> — כל מפתח מחזיק
          ערכים משלו. נהוג לשמור בריפו קובץ <code>.env.example</code> עם שמות
          המשתנים בלבד (בלי ערכים אמיתיים) כתיעוד.
        </p>
        <LearnCallout variant="warn" title="אל תעשו">
          לעולם לא עושים commit ל-secret אמיתי או לסיסמת מסד נתונים.
          ב-production משתמשים ב-secrets manager או במשתני סביבה של פלטפורמת
          ההרצה / CI.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="3. NODE_ENV">
        <p>
          <code>NODE_ENV</code> הוא המשתנה המוסכם שמסמן באיזו סביבה הקוד רץ:
        </p>
        <ul>
          <li>
            <code>development</code> — מקומי: לוגים מפורטים, stack trace ב-JSON
            של שגיאות, ברירות מחדל נוחות למסד נתונים מקומי.
          </li>
          <li>
            <code>production</code> — שרת אמיתי: אין stack ללקוח, כל הסודות
            חייבים להגיע מהסביבה (ערך ריק = תקלה שצריך לעצור עליה).
          </li>
        </ul>
        <LearnCode
          label="הרצה"
          code={`# development (ברירת מחדל ברוב הפרויקטים)
npm run dev

# production
NODE_ENV=production node dist/app.js`}
        />
      </LearnSection>

      <LearnSection title="4. config.ts — נקודת אמת אחת">
        <p>
          במקום ש-<code>process.env</code> יופיע בכל קובץ, מרכזים את הקריאה
          בקובץ config אחד. דפוס נפוץ: מחלקה לכל סביבה.
        </p>
        <LearnCode
          label="config.ts"
          code={`abstract class Config {
  isDevelopment = false;
  port = 3000;
  databaseUrl = "";
  jwtSecret = "";
}

class DevelopmentConfig extends Config {
  constructor() {
    super();
    this.isDevelopment = true;
    this.port = Number(process.env.PORT) || 3000;
    this.databaseUrl =
      process.env.DATABASE_URL ||
      "postgresql://dev:dev@localhost:5432/myapp";
    this.jwtSecret = process.env.JWT_SECRET || "dev-secret-change-me";
  }
}

class ProductionConfig extends Config {
  constructor() {
    super();
    this.isDevelopment = false;
    this.port = Number(process.env.PORT) || 3000;
    this.databaseUrl = process.env.DATABASE_URL || "";
    this.jwtSecret = process.env.JWT_SECRET || "";
  }
}

const config =
  process.env.NODE_ENV === "production"
    ? new ProductionConfig()
    : new DevelopmentConfig();

export default config;`}
        />
        <p>
          שאר הקוד מייבא <code>config</code> — ולא קורא{" "}
          <code>process.env</code> בכל מקום. יתרון: שינוי מדיניות (למשל ברירת
          מחדל של timeout) נעשה במקום אחד, ויש טיפוסים במקום strings חופשיים.
        </p>
      </LearnSection>

      <LearnSection title="5. משתנים נפוצים בשרת טיפוסי">
        <ul>
          <li>
            <code>PORT</code> — הפורט שהשרת מאזין עליו
          </li>
          <li>
            <code>DATABASE_URL</code> — connection string למסד הנתונים
          </li>
          <li>
            <code>REDIS_URL</code> — כתובת שרת ה-cache (אם יש)
          </li>
          <li>
            <code>JWT_SECRET</code>, <code>JWT_EXPIRES_IN</code> — חתימת
            tokens ותוקפם
          </li>
          <li>
            <code>LOG_LEVEL</code> — כמה מפורט הלוג (debug / info / warn)
          </li>
        </ul>
        <LearnCallout variant="tip" title="config.isDevelopment">
          ה-error handler מהשיעור הקודם משתמש בדגל הזה כדי להחליט אם לחשוף
          message ו-stack ללקוח — חיבור ישיר בין config לטיפול בשגיאות.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="6. טעויות נפוצות">
        <ul>
          <li>
            <strong>שכחת <code>dotenv.config()</code> בשורה הראשונה</strong> —
            אם קובץ אחר קורא <code>process.env</code> לפני הטעינה, הוא יקבל{" "}
            <code>undefined</code>.
          </li>
          <li>
            <strong>ערכים הם תמיד string</strong> —{" "}
            <code>process.env.PORT</code> הוא <code>"3000"</code>, לא{" "}
            <code>3000</code>. צריך המרה מפורשת (<code>Number(...)</code>),
            ו-<code>"false"</code> הוא string אמיתי (truthy!).
          </li>
          <li>
            <strong>ברירת מחדל לסוד ב-production</strong> — fallback כמו{" "}
            <code>|| "dev-secret"</code> מותר רק ב-development. ב-production
            עדיף לקרוס בעלייה מאשר לרוץ עם סוד צפוי.
          </li>
        </ul>
        <p className="mt-2 mb-0">
          המשך: <Link to="/learn/node-postgres">PostgreSQL + Pool</Link> — איך{" "}
          <code>config.databaseUrl</code> הופך לחיבור אמיתי למסד הנתונים.
        </p>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>process.env = הגדרות מחוץ לקוד</li>
          <li>dotenv + .env מקומי; .env.example כתיעוד</li>
          <li>NODE_ENV → development / production</li>
          <li>config.ts = נקודת אמת אחת</li>
          <li>סודות לעולם לא ב-repo</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default NodeEnvLearnPage;
