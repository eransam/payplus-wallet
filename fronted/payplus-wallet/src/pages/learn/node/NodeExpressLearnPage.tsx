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
      <LearnSection title="1. מאפס — למה בכלל צריך Express?">
        <p>
          Node לבד <strong>כבר יודע</strong> להיות שרת — יש לו מודול מובנה
          בשם <code>http</code>. אפשר לבנות API שלם רק איתו. אז למה כולם
          מתקינים Express?
        </p>
        <p>
          כי עם <code>http</code> הגולמי, <strong>הכל עליך</strong>. תראה מה
          נדרש רק כדי לענות לשתי כתובות שונות:
        </p>
        <LearnCode
          label="בלי Express — מודול http גולמי"
          code={`import http from "node:http";

const server = http.createServer((req, res) => {
  // אין ניתוב — בודקים ידנית גם את הכתובת וגם את המתודה:
  if (req.url === "/api/users" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify([{ id: 1, name: "דנה" }]));

  } else if (req.url === "/api/users" && req.method === "POST") {
    // אין req.body! צריך לאסוף את הגוף חתיכה-חתיכה בעצמנו:
    let raw = "";
    req.on("data", (chunk) => (raw += chunk));
    req.on("end", () => {
      const body = JSON.parse(raw);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ id: 2, ...body }));
    });

  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(3000);`}
        />
        <p>
          שים לב כמה עבודה ידנית יש כאן: שרשרת <code>if/else</code> לניתוב,
          איסוף ה-body בחתיכות, כתיבת headers בכל תשובה. ועוד לא דיברנו על{" "}
          <code>/api/users/5</code> (לחלץ את ה-5 מהכתובת — בעצמך).
        </p>
        <p>עכשיו בדיוק אותו שרת — עם Express:</p>
        <LearnCode
          label="עם Express — אותו דבר בדיוק"
          code={`import express from "express";

const app = express();
app.use(express.json()); // req.body מוכן לבד

app.get("/api/users", (req, res) => {
  res.json([{ id: 1, name: "דנה" }]);
});

app.post("/api/users", (req, res) => {
  res.status(201).json({ id: 2, ...req.body });
});

app.listen(3000);`}
        />
        <p>
          אותה תוצאה, רבע מהקוד. Express נותן לך שלושה דברים עיקריים:
        </p>
        <ul>
          <li>
            <strong>ניתוב (Routing)</strong> — במקום if/else:{" "}
            <code>app.get("/api/users", ...)</code>. הכתובת והמתודה כבר
            מופרדות, כולל פרמטרים כמו <code>/users/:id</code>.
          </li>
          <li>
            <strong>עזרים ל-req/res</strong> — <code>req.body</code> מוכן,{" "}
            <code>res.json(...)</code> כותב JSON עם ה-headers הנכונים בשורה
            אחת.
          </li>
          <li>
            <strong>Middleware</strong> — דרך להפעיל קוד על כל בקשה (אבטחה,
            אימות, לוגים) בלי לשכפל אותו בכל route. זה כל השיעור הבא.
          </li>
        </ul>
        <LearnCallout variant="tip" title="במשפט אחד">
          Express לא מחליף את Node — הוא שכבה דקה <strong>מעל</strong> מודול
          ה-http של Node, שחוסכת את כל העבודה הידנית. בגלל זה הוא הכלי
          הנפוץ ביותר לבניית API ב-JavaScript.
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
