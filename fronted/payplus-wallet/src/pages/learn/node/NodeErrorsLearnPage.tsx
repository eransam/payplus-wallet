import { Link } from "react-router-dom";
import LearnCallout from "../../../components/learn/LearnCallout";
import LearnCode from "../../../components/learn/LearnCode";
import LearnSection from "../../../components/learn/LearnSection";
import LearnTopicLayout from "../../../components/learn/LearnTopicLayout";

function NodeErrorsLearnPage() {
  return (
    <LearnTopicLayout
      slug="node-errors"
      objectives={[
        "להבין AppError — שגיאה עם code, status, message",
        "לזהות error middleware עם 4 פרמטרים",
        "לדעת למה השרת לא קורס על שגיאה ב-route",
        "להבין למה לא חושפים stack trace ב-production",
      ]}
    >
      <LearnSection title="1. מאפס — מה קורה כשמשהו נכשל?">
        <p>
          ב-route אסינכרוני נזרקת שגיאה — אם אין מי שיתפוס אותה, Express עלול
          להשיב 500 כללי, או שהתהליך יירשם כ-unhandled rejection.{" "}
          <strong>המטרה:</strong> כל שגיאה הופכת ל-JSON אחיד עם status נכון —
          והשרת <em>ממשיך</em> לשרת את הבקשות הבאות.
        </p>
        <p>
          הדפוס המקובל: מחלקת שגיאה ייעודית (<code>AppError</code>), העברת
          שגיאות עם <code>next(err)</code>, ו-middleware אחד שמרכז את כל
          התרגום ל-HTTP.
        </p>
      </LearnSection>

      <LearnSection title="2. AppError — שגיאה מכוונת">
        <LearnCode
          label="app-error.ts"
          code={`export class AppError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details?: Record<string, unknown>;

  constructor(code: string, message: string, status: number, details?: Record<string, unknown>) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }

  toJSON() {
    return {
      error: {
        code: this.code,
        message: this.message,
        status: this.status,
        ...(this.details ? { details: this.details } : {}),
      },
    };
  }
}`}
        />
        <p>
          נהוג להוסיף helpers כמו <code>notFound("User", 3)</code> או{" "}
          <code>badRequest("quantity must be positive")</code> — פונקציות
          קצרות שיוצרות AppError עם status והֶקשר מתאימים (404, 400, 409).
        </p>
        <LearnCallout variant="tip" title="במשפט אחד">
          AppError = "אני יודע איזה status ואיזה JSON לשלוח" — לא stack trace
          אקראי שהלקוח לא אמור לראות.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="3. next(err) — העברה ל-handler">
        <LearnCode
          label="ב-controller"
          code={`router.get("/users/:id", async (req, res, next) => {
  try {
    const user = await usersService.getUserById(parseId(req.params.id));
    if (!user) throw notFound("User", req.params.id);
    res.json(user);
  } catch (err) {
    next(err); // ← קופץ ל-error middleware
  }
});`}
        />
        <p>
          גם ב-middleware רגיל אפשר לזרוק:{" "}
          <code>return next(new AppError("unauthorized", "Missing token", 401))</code>.
          בלי <code>next</code> — השגיאה נבלעת והלקוח נשאר תקוע בלי תשובה.
        </p>
      </LearnSection>

      <LearnSection title="4. error middleware — 4 פרמטרים">
        <p>
          Express מזהה error middleware לפי החתימה: <strong>ארבעה</strong>{" "}
          פרמטרים — <code>(err, req, res, next)</code>. הוא נרשם אחרון בשרשרת.
        </p>
        <LearnCode
          label="errors-handler.ts"
          code={`function errorsHandler(err, _request, response, _next) {
  if (err instanceof AppError) {
    response.status(err.status).json(err.toJSON());
    return;
  }

  if (err instanceof Error) {
    logger.error(err.message, { stack: err.stack });

    response.status(500).json({
      error: {
        code: "internal_error",
        message: isDevelopment ? err.message : "Internal server error",
        status: 500,
        ...(isDevelopment && err.stack
          ? { details: { stack: err.stack } }
          : {}),
      },
    });
    return;
  }

  // ערך שנזרק ואינו Error בכלל → 500 גנרי
  response.status(500).json({
    error: { code: "internal_error", message: "Internal server error", status: 500 },
  });
}`}
        />
        <ul>
          <li>AppError → status מהשגיאה + toJSON()</li>
          <li>Error רגיל → לוג מלא בשרת; ללקוח הודעה כללית ב-production</li>
          <li>כל דבר אחר → 500 גנרי (ב-JS אפשר לזרוק גם string)</li>
        </ul>
      </LearnSection>

      <LearnSection title="5. לא לקרוס, לא לדלוף">
        <LearnCallout variant="warn" title="production">
          ב-development נוח לראות message ו-stack ב-JSON — לדיבוג. ב-production
          הלקוח מקבל רק "Internal server error"; ה-stack נשאר בלוגים של השרת.
          stack שדולף החוצה חושף מבנה קוד, נתיבים וספריות — מתנה לתוקפים.
        </LearnCallout>
        <p>
          שגיאה בבקשה אחת <strong>לא</strong> מפילה את תהליך Node — היא רק
          מחזירה response לבקשה הזו. זה כל ההבדל בין שרת יציב לשרת שקורס בכל
          פעם שמישהו שולח קלט לא צפוי.
        </p>
      </LearnSection>

      <LearnSection title="6. 404 — route שלא קיים">
        <p>
          בקשה לנתיב שלא הוגדר לא נחשבת "שגיאה" מבחינת Express — פשוט אף route
          לא תפס אותה. הפתרון: middleware גנרי <em>אחרי</em> כל ה-routes, שיוצר
          שגיאת 404 ומעביר אותה ל-error handler.
        </p>
        <LearnCode
          label="server.ts — אחרי כל ה-routes"
          code={`server.use((req, _res, next) => {
  next(new AppError("not_found", \`Route not found: \${req.method} \${req.originalUrl}\`, 404));
});

server.use(errorsHandler); // תמיד אחרון`}
        />
        <p className="mt-2 mb-0">
          המשך: <Link to="/learn/node-env">Env ו-Config</Link> — איך השרת יודע
          אם הוא רץ ב-development או ב-production.
        </p>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>AppError = code + status + message (+ details)</li>
          <li>controller: try/catch → next(err)</li>
          <li>error middleware = 4 פרמטרים; אחרון בשרשרת</li>
          <li>production: לא stack ללקוח; כן לוג בשרת</li>
          <li>404 = middleware ייעודי לפני ה-error handler</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default NodeErrorsLearnPage;
