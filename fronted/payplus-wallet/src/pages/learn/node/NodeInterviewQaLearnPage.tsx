import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import LearnCallout from "../../../components/learn/LearnCallout";
import LearnSection from "../../../components/learn/LearnSection";
import LearnTopicLayout from "../../../components/learn/LearnTopicLayout";

/** שאלה עם תשובה נפתחת — נסה לענות לבד לפני שפותחים */
function Qa({ q, children }: { q: string; children: ReactNode }) {
  return (
    <details className="border rounded p-2 mb-2 bg-white">
      <summary style={{ cursor: "pointer", fontWeight: 600 }}>{q}</summary>
      <div className="mt-2 small">{children}</div>
    </details>
  );
}

function NodeInterviewQaLearnPage() {
  return (
    <LearnTopicLayout
      slug="node-interview-qa"
      objectives={[
        "לחזור על כל הקורס דרך שאלות ראיון אמיתיות",
        "לתרגל ניסוח תשובות ברמת סניור",
        "לזהות נקודות חלשות שצריך לחזור עליהן",
      ]}
    >
      <LearnSection title="איך להשתמש בדף הזה">
        <p>
          כל שאלה סגורה. <strong>נסה לענות בקול רם</strong> (כמו בראיון) —
          ורק אז לחץ כדי לפתוח את התשובה. אם לא ידעת — חזור לשיעור המקושר.
        </p>
      </LearnSection>

      <LearnSection title="1. יסודות ו-Event Loop">
        <Qa q="מה זה Node.js? (במשפט)">
          <p>
            Runtime להרצת JavaScript מחוץ לדפדפן, מבוסס על מנוע V8, עם APIs
            לקבצים, רשת ותהליכים. לא שפה ולא framework.
          </p>
        </Qa>
        <Qa q="Node הוא single-threaded — אז איך הוא מטפל באלפי בקשות במקביל?">
          <p>
            קוד ה-JS רץ על חוט אחד, אבל פעולות I/O (רשת, דיסק, DB) מתבצעות
            מאחורי הקלעים על ידי libuv ומערכת ההפעלה. ה-Event Loop מריץ את
            ההמשך (callback/await) כשהתוצאה מוכנה. לכן Node מצוין ל-I/O
            ופחות לחישובים כבדים.
          </p>
        </Qa>
        <Qa q="מה יקרה אם אריץ לולאה סינכרונית כבדה בתוך handler של Express?">
          <p>
            חוט ה-JS ייחסם — אף בקשה אחרת לא תטופל עד שהלולאה תסתיים. הפתרון:
            worker_threads, job queue, או לפרק את העבודה.
          </p>
          <p>
            <Link to="/learn/node-event-loop">שיעור Event Loop</Link>
          </p>
        </Qa>
        <Qa q="מה ההבדל בין process.nextTick, Promise callback ו-setTimeout(0)?">
          <p>
            סדר עדיפויות: <code>nextTick</code> רץ מיד אחרי הפעולה הנוכחית
            (לפני הכל), אחריו microtasks (Promises), ורק אז macrotasks כמו{" "}
            <code>setTimeout</code>. תשובת סניור מוסיפה: שימוש יתר ב-nextTick
            יכול להרעיב את ה-loop.
          </p>
        </Qa>
      </LearnSection>

      <LearnSection title="2. Async">
        <Qa q="מה ההבדל בין callback, Promise ו-async/await?">
          <p>
            שלושה דורות של אותו רעיון: callback = פונקציה שנקראת בסיום (מוביל
            ל-callback hell); Promise = אובייקט שמייצג תוצאה עתידית עם
            then/catch; async/await = סוכר תחבירי מעל Promises שנראה כמו קוד
            סינכרוני וקל לטיפול שגיאות עם try/catch.
          </p>
        </Qa>
        <Qa q="מה עושה await בפועל? הוא חוסם את השרת?">
          <p>
            לא. await משהה רק את <strong>הפונקציה הנוכחית</strong> ומחזיר את
            השליטה ל-Event Loop — בקשות אחרות ממשיכות להיות מטופלות. כשה-
            Promise נפתר, ההמשך נכנס לתור ה-microtasks.
          </p>
        </Qa>
        <Qa q="איך מריצים כמה פעולות async במקביל?">
          <p>
            <code>Promise.all([a, b, c])</code> — נכשל אם אחת נכשלת;{" "}
            <code>Promise.allSettled</code> — מחזיר את כל התוצאות כולל
            כישלונות. await בלולאה = טורי (איטי) — טעות נפוצה.
          </p>
        </Qa>
      </LearnSection>

      <LearnSection title="3. Express ו-Middleware">
        <Qa q="מה זה middleware ואיך עובד next()?">
          <p>
            פונקציה שרצה על כל בקשה (או על route מסוים) לפני ה-handler:
            מקבלת req, res, next. קוראת <code>next()</code> להעביר הלאה
            בשרשרת, או עוצרת ומחזירה תשובה. הסדר שבו רושמים אותם = סדר
            ההרצה.
          </p>
        </Qa>
        <Qa q="איך Express מזהה error middleware?">
          <p>
            לפי החתימה — <strong>ארבעה פרמטרים</strong>:{" "}
            <code>(err, req, res, next)</code>. רושמים אותו אחרון, וכל{" "}
            <code>next(err)</code> מדלג ישר אליו.
          </p>
          <p>
            <Link to="/learn/node-errors">שיעור Error Handling</Link>
          </p>
        </Qa>
        <Qa q="למה חשוב הסדר של app.use?">
          <p>
            Express מריץ middleware לפי סדר הרישום. json parser חייב לבוא
            לפני routes שקוראים req.body; auth לפני routes מוגנים; error
            handler אחרון.
          </p>
        </Qa>
      </LearnSection>

      <LearnSection title="4. ארכיטקטורה ושגיאות">
        <Qa q="למה מחלקים שרת לשכבות (controllers / services / repositories)?">
          <p>
            הפרדת אחריות: controller מטפל ב-HTTP בלבד, service מכיל לוגיקה
            עסקית, repository מדבר עם ה-DB. יתרונות: בדיקות קלות (mock
            לשכבה אחת), החלפת DB בלי לגעת בלוגיקה, וקוד קריא.
          </p>
        </Qa>
        <Qa q="איך מטפלים בשגיאות בצורה מסודרת ב-API?">
          <p>
            מחלקת שגיאה מותאמת (למשל AppError עם status + code), זריקה
            מהלוגיקה, ותפיסה מרכזית ב-error middleware שממפה ל-JSON אחיד.
            ב-production לא מחזירים stack ללקוח — רק ללוג.
          </p>
        </Qa>
        <Qa q="ההבדל בין 401 ל-403? בין 400 ל-422?">
          <p>
            401 = לא מזוהה (אין/פג token). 403 = מזוהה אבל אין הרשאה. 400 =
            בקשה לא תקינה; 422 משמש לעיתים לולידציה סמנטית — העיקר להיות
            עקבי בכל ה-API.
          </p>
        </Qa>
      </LearnSection>

      <LearnSection title="5. נתונים: Postgres, Redis, טרנזקציות">
        <Qa q="למה משתמשים ב-connection pool מול DB?">
          <p>
            פתיחת חיבור ל-DB יקרה (TCP + auth). Pool מחזיק חיבורים פתוחים
            וממחזר אותם — כל בקשה לוקחת חיבור פנוי ומחזירה. בלי pool, תחת
            עומס נגמרים החיבורים וה-DB קורס.
          </p>
        </Qa>
        <Qa q="מתי חובה טרנזקציה? תן דוגמה.">
          <p>
            כשכמה כתיבות חייבות להצליח או להיכשל <strong>יחד</strong>.
            קלאסי: העברת כסף — חיוב חשבון A וזיכוי חשבון B. BEGIN → שתי
            הפעולות → COMMIT; כל שגיאה → ROLLBACK. אחרת אפשר לחייב בלי
            לזכות.
          </p>
          <p>
            <Link to="/learn/node-transactions">שיעור טרנזקציות</Link>
          </p>
        </Qa>
        <Qa q="מתי Redis ומתי Postgres?">
          <p>
            Postgres = מקור האמת, נתונים שחייבים לשרוד. Redis = זיכרון מהיר
            ל-cache, sessions, rate limiting, תורים — דברים שמותר לאבד או
            שנבנים מחדש. Redis לא מחליף DB.
          </p>
        </Qa>
        <Qa q="מה זה idempotency ולמה זה קריטי בתשלומים?">
          <p>
            אותה בקשה שמגיעה פעמיים (retry, לחיצה כפולה) מבוצעת פעם אחת
            בלבד. מימוש: הלקוח שולח idempotency key ייחודי; השרת שומר את
            התוצאה (למשל ב-Redis) ומחזיר אותה שוב בלי לבצע מחדש. בלי זה —
            חיוב כפול.
          </p>
        </Qa>
      </LearnSection>

      <LearnSection title="6. אבטחה ו-Auth">
        <Qa q="תאר flow מלא של JWT.">
          <p>
            login עם אימייל+סיסמה → השרת מאמת מול hash (bcrypt) → חותם JWT
            עם secret ומחזיר ללקוח → הלקוח שולח בכל בקשה{" "}
            <code>Authorization: Bearer token</code> → middleware מאמת חתימה
            ותוקף ושם את פרטי המשתמש על req → ה-handler ממשיך.
          </p>
        </Qa>
        <Qa q="למה bcrypt ולא sha256 לסיסמאות?">
          <p>
            bcrypt איטי <strong>בכוונה</strong> (cost factor) וכולל salt
            מובנה — מה שהופך brute force ו-rainbow tables ללא מעשיים. hash
            כללי כמו sha256 מהיר מדי ולכן פריץ.
          </p>
        </Qa>
        <Qa q="שלוש הגנות בסיסיות שכל API צריך?">
          <p>
            helmet (security headers), cors מוגדר נכון (לא * עם credentials),
            ולידציה על כל קלט + rate limiting. בונוס: לא לחשוף הודעות שגיאה
            פנימיות ו-stack ב-production.
          </p>
        </Qa>
      </LearnSection>

      <LearnSection title="7. תפעול: לוגים, process, scaling">
        <Qa q="למה console.log לא מספיק בפרודקשן?">
          <p>
            אין רמות (info/warn/error), אין structure לחיפוש, אין timestamps
            עקביים, ואי אפשר לנתב ליעדים (קובץ, שירות לוגים). ספריות כמו
            Winston/Pino נותנות JSON מובנה עם רמות.
          </p>
        </Qa>
        <Qa q="מה זה graceful shutdown ולמה זה חשוב?">
          <p>
            כשמגיע SIGTERM (deploy, scale down) — מפסיקים לקבל בקשות חדשות,
            נותנים לבקשות פעילות להסתיים, סוגרים חיבורי DB/Redis, ורק אז
            יוצאים. בלי זה — בקשות נקטעות באמצע ונתונים עלולים להיפגע.
          </p>
        </Qa>
        <Qa q="שרת Node אחד על מכונה עם 8 ליבות — מה הבעיה ומה הפתרון?">
          <p>
            JS רץ על ליבה אחת — 7 מבוזבזות. פתרון: cluster / PM2 עם עותק
            לכל ליבה, או כמה containers. תנאי: השרת stateless — session
            ב-Redis/JWT, לא בזיכרון.
          </p>
          <p>
            <Link to="/learn/node-scaling">שיעור Scaling</Link>
          </p>
        </Qa>
        <Qa q="מתי streams עדיפים על readFile?">
          <p>
            קבצים גדולים או תשובות ארוכות: stream מעבד chunk-chunk בזיכרון
            קבוע, במקום לטעון הכל ל-RAM. למשל: העלאת וידאו, ייצוא CSV ענק,
            proxy של קבצים.
          </p>
        </Qa>
      </LearnSection>

      <LearnSection title="8. שאלות 'פתוחות' שאוהבים בראיונות">
        <Qa q="לקוח מתלונן שה-API איטי. איך ניגשים?">
          <p>
            כמו סניור: קודם <strong>מדידה</strong>, לא ניחוש. לוגים/APM לזהות
            איפה הזמן הולך → לרוב DB (שאילתה בלי אינדקס, N+1) → אחר כך
            cache, ורק בסוף עוד שרתים. לציין גם: לבדוק אם האיטיות בכלל בצד
            שלנו (רשת? פרונט?).
          </p>
        </Qa>
        <Qa q="מה ההבדל בין Node לבין Java/C# בהקשר של שרתים?">
          <p>
            מודל threads: Java/C# = thread לכל בקשה (או pool); Node = חוט JS
            אחד + I/O אסינכרוני. Node מצטיין בהרבה חיבורים במקביל עם I/O
            (APIs, real-time); שפות multi-threaded חזקות בחישובים כבדים
            במקביל.
          </p>
        </Qa>
        <Qa q="איך היית מתכנן endpoint של יצירת הזמנה מאפס? (שאלת תכנון)">
          <p>
            תשובה מסודרת: ולידציה (Zod) → auth (מי המשתמש) → idempotency key
            → טרנזקציה (יצירת הזמנה + עדכון מלאי יחד) → תשובה 201 עם ה-id →
            שגיאות במבנה אחיד → לוג. לציין בדיקות: unit ללוגיקה + integration
            ל-route.
          </p>
        </Qa>
      </LearnSection>

      <LearnSection title="לפני הראיון">
        <LearnCallout variant="tip" title="שלושה כללי זהב לתשובות">
          1) משפט הגדרה קצר → 2) למה זה קיים / איזו בעיה זה פותר → 3) דוגמה
          קונקרטית מהניסיון. תשובה בנויה ככה נשמעת סניורית גם אם היא קצרה.
        </LearnCallout>
        <p className="mb-0">
          <Link to="/learn">חזרה למרכז הלמידה</Link>
        </p>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default NodeInterviewQaLearnPage;
