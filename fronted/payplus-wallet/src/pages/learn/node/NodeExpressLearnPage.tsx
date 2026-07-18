import { Link } from "react-router-dom";
import LearnCallout from "../../../components/learn/LearnCallout";
import LearnCode from "../../../components/learn/LearnCode";
import LearnSection from "../../../components/learn/LearnSection";
import LearnTopicLayout from "../../../components/learn/LearnTopicLayout";

function NodeExpressLearnPage() {
  return (
    <LearnTopicLayout
      slug="node-express"
      objectives={[
        "להבין מה Express מוסיף מעל HTTP גולמי",
        "ליצור app, לרשום middleware, ולהאזין לפורט",
        "לעשות mount ל-routers לפי prefix (/api/users, /api/products…)",
        "להכיר את req ו-res — הגשר בין הקוד ל-HTTP",
      ]}
    >
      <LearnSection title="1. מאפס — למה Express?">
        <p>
          Node יודע לקבל HTTP עם מודול <code>http</code> — אבל צריך לכתוב הרבה
          boilerplate: לפרסר URL, לקרוא body, לנתב לפי path ולפי method.{" "}
          <strong>Express</strong> הוא framework דק שעושה את זה בשבילך.
        </p>
        <LearnCallout variant="tip" title="במשפט אחד">
          Express = router + middleware + helpers על גבי Node HTTP — הסטנדרט
          de-facto ל-API ב-JS.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="2. יצירת אפליקציה והאזנה">
        <LearnCode
          label="מינימום — שרת שמחזיר JSON"
          code={`import express from "express";

const app = express();
const PORT = 3000;

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(\`API on port \${PORT}\`);
});`}
        />
        <p>
          <code>express()</code> יוצר אובייקט אפליקציה. <code>listen</code>{" "}
          פותח socket ומחכה לבקשות. באפליקציה אמיתית הפורט מגיע ממשתנה סביבה
          (<code>process.env.PORT</code>) ולא כתוב בקוד.
        </p>
      </LearnSection>

      <LearnSection title="3. שלד של אפליקציה אמיתית — הסדר הנכון">
        <LearnCode
          label="index.ts (מקוצר)"
          code={`import express from "express";
import cors from "cors";
import helmet from "helmet";
import usersRouter from "./routes/users";
import productsRouter from "./routes/products";
import errorHandler from "./middleware/error-handler";

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);

// 404 → errorHandler → listen
app.use((_req, res) => res.status(404).json({ error: "Not found" }));
app.use(errorHandler);

app.listen(process.env.PORT ?? 3000);`}
        />
        <p>
          שימו לב: <strong>קודם</strong> middleware גלובלי (cors, json),{" "}
          <strong>אחר כך</strong> routes, <strong>בסוף</strong> 404 וטיפול
          בשגיאות — ורק אז <code>listen</code>.
        </p>
      </LearnSection>

      <LearnSection title="4. Routers — לפצל לפי נושא">
        <p>
          במקום לשים מאות <code>app.get</code> בקובץ אחד, כל תחום מייצא{" "}
          <code>express.Router()</code> עם הנתיבים שלו:
        </p>
        <LearnCode
          label="routes/users.ts (דפוס)"
          code={`import express from "express";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const users = await userService.getAll();
    res.json(users);
  } catch (err) {
    next(err); // מעביר ל-error handler
  }
});

router.get("/:id", async (req, res, next) => { /* ... */ });
router.post("/", async (req, res, next) => { /* ... */ });

export default router;`}
        />
        <p>
          ב-index: <code>app.use("/api/users", usersRouter)</code> — כל route
          ב-router מקבל את ה-prefix (למשל <code>GET /api/users/5</code> מגיע
          ל-<code>router.get("/:id")</code>).
        </p>
      </LearnSection>

      <LearnSection title="5. req ו-res — מה מגיע מה-HTTP">
        <ul>
          <li>
            <code>req.method</code>, <code>req.path</code>,{" "}
            <code>req.params</code> (למשל <code>:id</code>),{" "}
            <code>req.query</code> (אחרי <code>?</code>),{" "}
            <code>req.body</code>, <code>req.headers</code>.
          </li>
          <li>
            <code>res.status(201).json({"{ ... }"})</code> — status + JSON.
          </li>
          <li>
            <code>next(err)</code> — מדלג ל-middleware הבא (בדרך כלל error
            handler).
          </li>
        </ul>
        <LearnCallout variant="info" title="async routes">
          handler אסינכרוני חייב <code>try/catch</code> ו-<code>next(err)</code>{" "}
          — Express 4 לא תופס reject של Promise אוטומטית (אלא אם עוטפים
          ב-wrapper או עוברים ל-Express 5).
        </LearnCallout>
      </LearnSection>

      <LearnSection title="6. דוגמה מלאה — CRUD קטן">
        <LearnCode
          label="routes/todos.ts"
          code={`const router = express.Router();

router.get("/", async (_req, res, next) => {
  try {
    res.json(await todoService.getAll());
  } catch (err) { next(err); }
});

router.post("/", async (req, res, next) => {
  try {
    const created = await todoService.create(req.body);
    res.status(201).json(created);
  } catch (err) { next(err); }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await todoService.remove(Number(req.params.id));
    res.status(204).end();
  } catch (err) { next(err); }
});

export default router;`}
        />
        <p>
          שלושה עקרונות חוזרים: status נכון לכל פעולה (200 / 201 / 204),{" "}
          <code>next(err)</code> בכל catch, וה-router לא מכיל לוגיקה עסקית —
          רק תרגום בין HTTP לשירות.
        </p>
        <p className="mt-2 mb-0">
          המשך: <Link to="/learn/node-middleware">Middleware</Link> — מה זה{" "}
          <code>app.use</code> ולמה הסדר קובע.
        </p>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>Express = app + middleware + routers + listen</li>
          <li>סדר: middleware גלובלי → routes → 404 → error handler</li>
          <li>Router לכל תחום; mount עם prefix ב-app.use</li>
          <li>req/res = גשר ל-HTTP; next(err) לשגיאות</li>
          <li>הפורט ממשתנה סביבה — לא בקוד</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default NodeExpressLearnPage;
