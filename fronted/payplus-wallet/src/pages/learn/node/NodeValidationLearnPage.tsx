import { Link } from "react-router-dom";
import LearnCallout from "../../../components/learn/LearnCallout";
import LearnCode from "../../../components/learn/LearnCode";
import LearnSection from "../../../components/learn/LearnSection";
import LearnTopicLayout from "../../../components/learn/LearnTopicLayout";

function NodeValidationLearnPage() {
  return (
    <LearnTopicLayout
      slug="node-validation"
      objectives={[
        "להבין למה לעולם לא סומכים על קלט מהלקוח",
        "להכיר Zod — הגדרת סכמה ובדיקת body",
        "להחזיר 400 עם הודעות ברורות",
        "לבנות middleware ולידציה לשימוש חוזר",
      ]}
    >
      <LearnSection title="1. הכלל הכי חשוב באבטחת API">
        <LearnCallout variant="warn" title="לעולם לא סומכים על הלקוח">
          גם אם יש ולידציה יפה בטופס React — כל אחד יכול לשלוח בקשה ישירות
          עם curl/Postman ולעקוף אותה. <strong>השרת חייב לבדוק הכל בעצמו.</strong>
        </LearnCallout>
        <p>מה קורה בלי ולידציה בשרת?</p>
        <ul>
          <li>
            <code>amount: -500</code> — מישהו "מפקיד" סכום שלילי.
          </li>
          <li>
            <code>email: "abc"</code> — נתונים זבל נכנסים ל-DB.
          </li>
          <li>
            body ענק / שדות לא צפויים — פרצות ואיבוד שליטה על הנתונים.
          </li>
        </ul>
      </LearnSection>

      <LearnSection title="2. Zod — סכמה אחת שבודקת ומטייפת">
        <p>
          <code>zod</code> נותן לך להגדיר <strong>סכמה</strong> (מה מותר),
          לבדוק מולה קלט, ולקבל ממנה גם <strong>טיפוס TypeScript</strong>{" "}
          אוטומטית:
        </p>
        <LearnCode
          label="הגדרת סכמה"
          code={`import { z } from "zod";

export const createOrderSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().min(1).max(100),
  couponCode: z.string().trim().max(20).optional(),
});

// טיפוס TS נגזר מהסכמה — אין כפילות הגדרות:
export type CreateOrderInput = z.infer<typeof createOrderSchema>;`}
        />
      </LearnSection>

      <LearnSection title="3. שימוש ב-route">
        <LearnCode
          label="safeParse — בלי exceptions מפתיעים"
          code={`app.post("/api/orders", (req, res) => {
  const result = createOrderSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: {
        code: "validation_error",
        issues: result.error.issues.map((i) => ({
          field: i.path.join("."),
          message: i.message,
        })),
      },
    });
  }

  // מכאן result.data מטויפ ובטוח:
  const order = result.data; // CreateOrderInput
  // ...
});`}
        />
        <LearnCallout variant="tip" title="למה 400?">
          קלט לא תקין = הבעיה אצל הלקוח = סטטוס 4xx. עם רשימת השדות
          הבעייתיים — כדי שהפרונט יוכל להציג שגיאות ליד השדות.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="4. Middleware ולידציה — פעם אחת, לכל ה-routes">
        <p>
          במקום לחזור על safeParse בכל route — כותבים middleware גנרי שמקבל
          סכמה:
        </p>
        <LearnCode
          label="validate middleware"
          code={`import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export function validateBody(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: { code: "validation_error", issues: result.error.issues },
      });
    }
    req.body = result.data; // מנוקה ומטויפ
    next();
  };
}

// שימוש:
app.post("/api/orders", validateBody(createOrderSchema), createOrderHandler);`}
        />
      </LearnSection>

      <LearnSection title="5. מה עוד מוודאים חוץ מ-body?">
        <ul>
          <li>
            <strong>params</strong> — <code>/users/:id</code> — האם id באמת
            מספר? (<code>z.coerce.number()</code>)
          </li>
          <li>
            <strong>query</strong> — <code>?page=2&limit=50</code> — גבולות
            הגיוניים ל-pagination.
          </li>
          <li>
            <strong>headers</strong> — Content-Type נכון, token קיים.
          </li>
        </ul>
        <LearnCode
          label="ולידציה ל-params"
          code={`const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});
// "abc" → 400 במקום שאילתת DB מוזרה`}
        />
      </LearnSection>

      <LearnSection title="6. עקרונות של סניור">
        <ul>
          <li>
            <strong>Fail fast</strong> — ולידציה בקצה, לפני שהקלט מגיע ללוגיקה.
          </li>
          <li>
            <strong>Whitelist, לא blacklist</strong> — מגדירים מה מותר; כל
            השאר נדחה (Zod עושה את זה כברירת מחדל עם <code>strict()</code>).
          </li>
          <li>
            <strong>אותה סכמה לפרונט ולבק</strong> — אם שניהם TS, אפשר לשתף
            את קבצי ה-Zod ולקבל התאמה מושלמת.
          </li>
        </ul>
        <p className="mt-2 mb-0">
          המשך: <Link to="/learn/node-docker">Docker</Link> — לארוז את השרת
          כך שירוץ אותו דבר בכל מקום.
        </p>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>ולידציה בפרונט = UX; ולידציה בשרת = אבטחה. חובה בשרת</li>
          <li>Zod: סכמה אחת → בדיקה + טיפוס TS</li>
          <li>safeParse → 400 עם רשימת issues</li>
          <li>middleware גנרי validateBody(schema)</li>
          <li>בודקים גם params, query, headers</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default NodeValidationLearnPage;
