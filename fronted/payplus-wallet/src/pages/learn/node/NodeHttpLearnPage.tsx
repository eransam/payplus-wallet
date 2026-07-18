import { Link } from "react-router-dom";
import LearnCallout from "../../../components/learn/LearnCallout";
import LearnCode from "../../../components/learn/LearnCode";
import LearnSection from "../../../components/learn/LearnSection";
import LearnTopicLayout from "../../../components/learn/LearnTopicLayout";

function NodeHttpLearnPage() {
  return (
    <LearnTopicLayout
      slug="node-http"
      objectives={[
        "להבין מה קורה כשהדפדפן שולח בקשה לשרת",
        "לזהות method, URL, headers ו-body",
        "לדעת status codes נפוצים (200, 201, 400, 401, 404, 500)",
        "להכיר את ה-headers החשובים בעבודה עם JSON API",
      ]}
    >
      <LearnSection title="1. מאפס — מה זה HTTP?">
        <p>
          כשאפליקציית web קוראת ל-<code>/api/users</code>, היא לא "מדברת
          ישירות" עם מסד הנתונים. היא שולחת <strong>הודעת HTTP</strong> דרך
          הרשת לשרת — והשרת מחזיר <strong>תשובת HTTP</strong>.
        </p>
        <p>
          HTTP הוא <strong>פרוטוקול</strong> (חוקים מוסכמים): איך לנסח בקשה,
          איך לנסח תשובה, ומה המשמעות של מספרים כמו 200 או 404.
        </p>
        <LearnCallout variant="tip" title="במשפט אחד">
          HTTP = שפה משותפת בין <strong>לקוח</strong> (דפדפן / fetch) ל-
          <strong>שרת</strong> (למשל Node).
        </LearnCallout>
      </LearnSection>

      <LearnSection title="2. מבנה בקשה (Request)">
        <p>כל בקשה מורכבת מארבעה חלקים עיקריים:</p>
        <ul>
          <li>
            <strong>Method</strong> — מה רוצים לעשות:{" "}
            <code>GET</code> (לקרוא), <code>POST</code> (ליצור),{" "}
            <code>PUT</code>/<code>PATCH</code> (לעדכן), <code>DELETE</code>{" "}
            (למחוק).
          </li>
          <li>
            <strong>URL</strong> — לאן: למשל{" "}
            <code>https://api.example.com/api/users/5</code>.
          </li>
          <li>
            <strong>Headers</strong> — מטא-נתונים: סוג תוכן, token, ועוד.
          </li>
          <li>
            <strong>Body</strong> — גוף הבקשה (בדרך כלל ב-POST/PUT) — JSON,
            טופס, קובץ.
          </li>
        </ul>
        <LearnCode
          label="דוגמה — יצירת משימה חדשה"
          code={`POST /api/todos HTTP/1.1
Host: api.example.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "title": "לקנות חלב",
  "done": false
}`}
        />
        <p>
          ב-JavaScript זה נראה כמו{" "}
          <code>fetch(url, {"{ method, headers, body }"})</code> — אותה
          הודעה בדיוק, רק שהדפדפן מנסח אותה בשבילך.
        </p>
      </LearnSection>

      <LearnSection title="3. מבנה תשובה (Response)">
        <p>השרת מחזיר גם status, headers, ולעיתים body:</p>
        <LearnCode
          label="תשובה מוצלחת — 201 Created"
          code={`HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": 42,
  "title": "לקנות חלב",
  "done": false
}`}
        />
        <LearnCode
          label="תשובת שגיאה — 404 Not Found"
          code={`HTTP/1.1 404 Not Found
Content-Type: application/json

{
  "error": {
    "code": "not_found",
    "message": "Todo with id 999 does not exist"
  }
}`}
        />
        <p>
          לקוח טוב בודק את <code>response.status</code> ואת ה-JSON — לא מניח
          ש"קיבלתי תשובה = הכל בסדר" בלי לקרוא את הגוף.
        </p>
      </LearnSection>

      <LearnSection title="4. Status codes — המספרים שחייבים להכיר">
        <ul>
          <li>
            <strong>2xx — הצלחה:</strong> <code>200 OK</code> (קריאה/עדכון),{" "}
            <code>201 Created</code> (נוצר משאב חדש),{" "}
            <code>204 No Content</code> (הצלחה בלי גוף, למשל מחיקה).
          </li>
          <li>
            <strong>4xx — הבעיה אצל הלקוח:</strong> <code>400</code> בקשה לא
            תקינה, <code>401</code> לא מחובר, <code>403</code> אין הרשאה,{" "}
            <code>404</code> לא נמצא, <code>409</code> התנגשות מצב.
          </li>
          <li>
            <strong>5xx — הבעיה בשרת:</strong> <code>500</code> שגיאה פנימית
            — באג או תקלה בתשתית; הלקוח לא אמור "לתקן" את זה.
          </li>
        </ul>
        <LearnCallout variant="warn" title="לא לערבב">
          <code>404</code> = "הנתיב או המשאב לא קיים".{" "}
          <code>401</code> = "לא שלחת token תקין".{" "}
          <code>403</code> = "מזוהה, אבל אסור לך". שלושה מצבים שונים —
          תשובות שונות ללקוח.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="5. Headers חשובים ב-JSON API">
        <ul>
          <li>
            <code>Content-Type: application/json</code> — אומר לצד השני שהגוף
            הוא JSON.
          </li>
          <li>
            <code>Authorization: Bearer &lt;token&gt;</code> — הדרך המקובלת
            לשלוח token של משתמש מחובר; בלי זה routes מוגנים מחזירים 401.
          </li>
          <li>
            <code>Accept: application/json</code> — הלקוח מצפה ל-JSON
            בתשובה (ברירת מחדל ברוב ה-APIs).
          </li>
        </ul>
        <p>
          Headers הם <strong>מילון מפתח-ערך</strong> — לא חלק מה-URL ולא
          מה-body. השרת יכול גם להוסיף headers לתשובה, למשל headers של
          אבטחה או caching.
        </p>
      </LearnSection>

      <LearnSection title="6. דוגמה מלאה — מהלקוח לשרת וחזרה">
        <LearnCode
          label="צד לקוח — fetch"
          code={`const response = await fetch("https://api.example.com/api/todos", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: \`Bearer \${token}\`,
  },
  body: JSON.stringify({ title: "לקנות חלב" }),
});

if (!response.ok) {
  const problem = await response.json();
  throw new Error(problem.error.message);
}

const todo = await response.json(); // { id: 42, title: ... }`}
        />
        <p>
          <code>response.ok</code> הוא קיצור ל"status בטווח 2xx". תמיד
          בודקים אותו לפני שסומכים על הגוף.
        </p>
        <p className="mt-2 mb-0">
          המשך: <Link to="/learn/node-express">Express</Link> — איך Node
          מקשיב לבקשות HTTP ומנתב אותן.
        </p>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>HTTP = בקשה (method, URL, headers, body) + תשובה (status, headers, body)</li>
          <li>GET קורא, POST יוצר — RESTful API</li>
          <li>2xx הצלחה, 4xx לקוח, 5xx שרת</li>
          <li>Authorization + Content-Type — headers קריטיים</li>
          <li>תמיד לבדוק response.ok לפני קריאת הגוף</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default NodeHttpLearnPage;
