import { Link } from "react-router-dom";
import LearnCallout from "../../../components/learn/LearnCallout";
import LearnCode from "../../../components/learn/LearnCode";
import LearnSection from "../../../components/learn/LearnSection";
import LearnTopicLayout from "../../../components/learn/LearnTopicLayout";

function NodeArchitectureLearnPage() {
  return (
    <LearnTopicLayout
      slug="node-architecture"
      objectives={[
        "להבין שלוש שכבות: controllers → services → repositories",
        "לדעת מה כל שכבה אחראית — ומה אסור לה להכיל",
        "לזהות זרימת בקשה מ-HTTP ועד מסד הנתונים ובחזרה",
        "להבין למה הפרדה כזו היא סטנדרט בצוותים מקצועיים",
      ]}
    >
      <LearnSection title="1. מאפס — למה לא הכל בקובץ אחד?">
        <p>
          אפשר לכתוב <code>app.get</code> שמריץ SQL, בודק הרשאות, מחשב לוגיקה
          עסקית ושולח JSON — הכל באותה פונקציה. זה עובד בדמו, אבל אחרי 500
          שורות אף אחד לא מבין את הקוד, אי אפשר לכתוב בדיקות, וכל שינוי במסד
          הנתונים שובר את כל השרת.
        </p>
        <p>
          <strong>ארכיטקטורת שכבות</strong> (Layered Architecture) מחלקת את
          האחריות: כל קובץ עושה דבר אחד ברור, וכל שכבה מדברת רק עם השכנה שלה.
          זו הדרך הנפוצה ביותר לארגן שרת Node.js בעולם האמיתי.
        </p>
      </LearnSection>

      <LearnSection title="2. שלוש השכבות">
        <ul>
          <li>
            <strong>Controllers</strong> — קצה ה-HTTP: קוראים{" "}
            <code>req</code>, מפעילים את שכבת ה-service, ומחזירים{" "}
            <code>res.status().json()</code>. <em>בלי</em> SQL ישיר ו<em>בלי</em>{" "}
            חוקי עסקים כבדים.
          </li>
          <li>
            <strong>Services</strong> — הלוגיקה העסקית: ולידציה, חישובים, חוקים
            ("אי אפשר להזמין כמות שלילית"), תיאום בין כמה repositories. שכבה זו
            לא יודעת על Express — רק על מודלים ו-repositories.
          </li>
          <li>
            <strong>Repositories</strong> (לפעמים נקראת DAL — Data Access
            Layer) — הגישה לנתונים: חיבור למסד, queries, mapping משורות
            לאובייקטים. השכבה לא יודעת "מה זו הזמנה" — רק "הרץ SQL והחזר
            שורות".
          </li>
        </ul>
        <LearnCallout variant="tip" title="זרימה">
          בקשה → controller → service → repository → מסד נתונים → חזרה למעלה
          עם נתונים או שגיאה.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="3. דוגמה — יצירת הזמנה">
        <LearnCode
          label="Controller — רק HTTP"
          code={`// orders-controller.ts
router.post("/orders", async (req, res, next) => {
  try {
    const order = await ordersService.createOrder({
      userId: req.body.user_id,
      productId: req.body.product_id,
      quantity: req.body.quantity,
    });
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});`}
        />
        <LearnCode
          label="Service — חוקים עסקיים"
          code={`// orders-service.ts
async function createOrder(input: CreateOrderInput) {
  if (input.quantity <= 0) {
    throw new AppError("bad_request", "Quantity must be positive", 400);
  }

  const product = await productsRepository.findById(input.productId);
  if (!product) {
    throw new AppError("not_found", "Product not found", 404);
  }

  const total = product.price * input.quantity;
  return ordersRepository.insert({ ...input, total });
}`}
        />
        <LearnCode
          label="Repository — רק גישה לנתונים"
          code={`// orders-repository.ts
async function insert(order: NewOrder) {
  const result = await pool.query(
    \`INSERT INTO orders (user_id, product_id, quantity, total)
     VALUES ($1, $2, $3, $4) RETURNING *\`,
    [order.userId, order.productId, order.quantity, order.total]
  );
  return result.rows[0];
}`}
        />
        <p>
          ה-controller לא יודע על SQL. ה-service לא יודע על status code 201.
          ה-repository לא יודע מה זה "כמות חוקית". כל שכבה נבדקת ומתוחזקת
          בנפרד.
        </p>
      </LearnSection>

      <LearnSection title="4. שכבות תמיכה נוספות">
        <ul>
          <li>
            <strong>utils / shared</strong> — config, מחלקת שגיאות, logger —
            כלים שכל השכבות משתמשות בהם.
          </li>
          <li>
            <strong>middleware</strong> — אימות (auth), לוגים, טיפול בשגיאות —
            רץ לפני או אחרי ה-controllers.
          </li>
          <li>
            <strong>models / types</strong> — טיפוסים ומבני נתונים (TypeScript
            interfaces) שמשותפים לכל השכבות.
          </li>
        </ul>
        <p>
          חלוקת התיקיות עצמה פחות חשובה מהעיקרון: כשפותחים קובץ צריך להיות
          ברור באיזו שכבה הוא נמצא — ומה אסור לייבא לתוכו (למשל: service לא
          מייבא express).
        </p>
      </LearnSection>

      <LearnSection title="5. למה זה סטנדרט מקצועי?">
        <ul>
          <li>
            <strong>בדיקות</strong> — service נבדק בלי HTTP mock; repository
            נבדק מול מסד נתונים לבדיקות.
          </li>
          <li>
            <strong>שינוי מסד נתונים</strong> — מחליפים queries ב-repository
            בלי לגעת ב-routes.
          </li>
          <li>
            <strong>עבודת צוות</strong> — מפתח אחד על controllers, אחר על
            services — בלי לדרוך אחד על השני.
          </li>
          <li>
            <strong>אבטחה</strong> — SQL רק בשכבת הנתונים; פחות סיכון להזרקה
            מ-controller מבולגן.
          </li>
        </ul>
        <LearnCallout variant="warn" title="anti-pattern">
          <code>controller</code> שכותב <code>pool.query("SELECT...")</code> —
          שובר את השכבות. גם אם "עובד מהר" בדמו, זה חוב טכני שמצטבר מהר.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="6. טעויות נפוצות">
        <ul>
          <li>
            <strong>service שמחזיר <code>res.json()</code></strong> — הלוגיקה
            נקשרת ל-Express ואי אפשר לבדוק אותה בנפרד. service מחזיר נתונים או
            זורק שגיאה — ה-controller מתרגם ל-HTTP.
          </li>
          <li>
            <strong>repository עם חוקים עסקיים</strong> — למשל בדיקת הרשאות
            בתוך query. החוקים שייכים ל-service; ה-repository רק ניגש לנתונים.
          </li>
          <li>
            <strong>מעבר על שכבה</strong> — controller שקורא ישירות ל-repository
            "כי זה קצר יותר". ברגע שיתווסף חוק עסקי, לא יהיה לו בית.
          </li>
        </ul>
        <p className="mt-2 mb-0">
          המשך: <Link to="/learn/node-errors">Error Handling</Link> — איך
          שגיאות חוזרות מה-service ללקוח בצורה אחידה.
        </p>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>controllers = HTTP בלבד</li>
          <li>services = לוגיקה עסקית + תיאום</li>
          <li>repositories = גישה למסד הנתונים</li>
          <li>זרימה: req → controller → service → repository → DB</li>
          <li>הפרדה = תחזוקה, בדיקות, בטיחות</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default NodeArchitectureLearnPage;
