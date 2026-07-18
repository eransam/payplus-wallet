import { Link } from "react-router-dom";
import LearnCallout from "../../../components/learn/LearnCallout";
import LearnCode from "../../../components/learn/LearnCode";
import LearnSection from "../../../components/learn/LearnSection";
import LearnTopicLayout from "../../../components/learn/LearnTopicLayout";

function NodeAsyncLearnPage() {
  return (
    <LearnTopicLayout
      slug="node-async"
      objectives={[
        "להבין למה קוד שרת כמעט תמיד async",
        "לעבור מ-callback ל-Promise ל-async/await",
        "לדעת לטפל בשגיאות עם try/catch",
        "להכיר Promise.all להרצת פעולות במקביל",
      ]}
    >
      <LearnSection title="1. למה לא לכתוב הכל בסדר סינכרוני?">
        <p>
          שליפה ממסד נתונים או קריאת רשת לוקחת זמן (מילישניות עד שניות). אם
          היינו <strong>מחכים בסגנון חוסם</strong> — השרת היה קפוא ולא מטפל
          באף בקשה אחרת. לכן כמעט כל פעולת I/O ב-Node מחזירה Promise,
          וכותבים אותה עם <code>async/await</code>.
        </p>
      </LearnSection>

      <LearnSection title="2. שלושה דורות (בקצרה)">
        <LearnCode
          label="1) Callback (ישן, מסתבך בקלות)"
          code={`fs.readFile("a.txt", (err, data) => {
  if (err) return console.error(err);
  // ...עוד callback בפנים... (callback hell)
});`}
        />
        <LearnCode
          label="2) Promise"
          code={`fetchData()
  .then((data) => process(data))
  .catch((err) => console.error(err));`}
        />
        <LearnCode
          label="3) async/await (הסגנון המודרני)"
          code={`async function getUsers() {
  try {
    const rows = await db.query("SELECT * FROM users");
    return rows;
  } catch (err) {
    // מטפלים / זורקים הלאה
    throw err;
  }
}`}
        />
        <LearnCallout variant="tip" title="במשפט אחד">
          <code>async</code> מסמן שפונקציה מחזירה Promise.{" "}
          <code>await</code> מחכה לתוצאה בלי לחסום את כל Node (רק את המשך
          הפונקציה).
        </LearnCallout>
      </LearnSection>

      <LearnSection title="3. הטעות הכי נפוצה — לבלוע שגיאות">
        <LearnCode
          label="רע"
          code={`try {
  await doSomething();
} catch (e) {
  // ריק — השגיאה נעלמת, אף אחד לא ידע שמשהו נכשל
}`}
        />
        <p>
          כלל אצבע: או שמטפלים בשגיאה באמת (לוג + תגובה מתאימה למשתמש), או
          שזורקים אותה הלאה למי שיודע לטפל. <code>catch</code> ריק הוא באג
          שמחכה לקרות.
        </p>
      </LearnSection>

      <LearnSection title="4. טעות נפוצה שנייה — לשכוח await">
        <LearnCode
          label="מה הבעיה כאן?"
          code={`async function saveUser(user) {
  db.insert("users", user); // חסר await!
  return { ok: true };      // מחזירים הצלחה לפני שהשמירה קרתה
}`}
        />
        <p>
          בלי <code>await</code> הפונקציה ממשיכה בלי לחכות — ואם השמירה
          תיכשל, אף אחד לא יידע. שגיאה כזו גם עלולה להפוך ל-
          <code>unhandled promise rejection</code> שמפיל את התהליך.
        </p>
      </LearnSection>

      <LearnSection title="5. במקביל, לא בטור — Promise.all">
        <LearnCode
          label="שתי שליפות שלא תלויות זו בזו"
          code={`// איטי — בטור (200ms + 200ms = 400ms)
const users = await fetchUsers();
const products = await fetchProducts();

// מהיר — במקביל (~200ms)
const [users, products] = await Promise.all([
  fetchUsers(),
  fetchProducts(),
]);`}
        />
        <p>
          כשפעולות לא תלויות זו בזו — מריצים במקביל.{" "}
          <code>Promise.all</code> נכשל אם אחת נכשלת;{" "}
          <code>Promise.allSettled</code> מחזיר תוצאה לכל אחת בנפרד.
        </p>
      </LearnSection>

      <LearnSection title="6. דוגמה מלאה — handler אסינכרוני">
        <LearnCode
          label="route טיפוסי בשרת"
          code={`app.get("/api/users/:id", async (req, res, next) => {
  try {
    const user = await db.query(
      "SELECT * FROM users WHERE id = $1",
      [req.params.id]
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    next(err); // מעביר ל-error middleware
  }
});`}
        />
        <p>
          הדפוס קבוע: <code>try</code> סביב כל ה-await-ים,{" "}
          <code>next(err)</code> בשגיאה — כך שגיאות תמיד מגיעות למקום אחד
          מרכזי במקום להתפזר.
        </p>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>I/O = async; לא חוסמים את השרת</li>
          <li>async/await = התחביר המודרני מעל Promises</li>
          <li>catch ריק בולע שגיאות — תמיד לטפל או לזרוק הלאה</li>
          <li>await חסר = באג שקט; Promise.all לפעולות בלתי תלויות</li>
        </ul>
        <p className="mt-2 mb-0">
          המשך: <Link to="/learn/node-http">HTTP מאפס</Link> — לפני Express.
        </p>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default NodeAsyncLearnPage;
