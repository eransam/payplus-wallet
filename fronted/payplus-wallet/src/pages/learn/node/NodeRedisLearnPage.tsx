import { Link } from "react-router-dom";
import LearnCallout from "../../../components/learn/LearnCallout";
import LearnCode from "../../../components/learn/LearnCode";
import LearnSection from "../../../components/learn/LearnSection";
import LearnTopicLayout from "../../../components/learn/LearnTopicLayout";

function NodeRedisLearnPage() {
  return (
    <LearnTopicLayout
      slug="node-redis"
      objectives={[
        "להבין מה Redis הוא (ולמה הוא לא מחליף מסד רלציוני)",
        "להבין cache מול database — מתי כל אחד",
        "להתחבר ל-Redis מ-Node עם client יחיד (singleton)",
        "להכיר TTL ומתי לא להשתמש ב-Redis בכלל",
      ]}
    >
      <LearnSection title="1. מאפס — מה זה Redis?">
        <p>
          <strong>Redis</strong> (Remote Dictionary Server) הוא מאגר נתונים{" "}
          <strong>בזיכרון (in-memory)</strong>. הוא שומר מפתח → ערך — כמו
          אובייקט JS גדול שרץ על שרת נפרד.
        </p>
        <p>
          כי הנתונים ב-RAM, קריאה וכתיבה מהירות מאוד (מיקרו-שניות). אבל: אם
          השרת נכבה — מה שלא נשמר לדיסק (או שלא שוחזר) עלול להיעלם. Redis{" "}
          <em>לא</em> מחליף מסד רלציוני לנתונים קריטיים לטווח ארוך.
        </p>
        <LearnCallout variant="tip" title="במשפט אחד">
          Redis = זיכרון מהיר ליד השרת — מצוין ל-cache, sessions קצרות,
          idempotency, rate limiting. המסד הרלציוני = מקור האמת לנתונים
          עסקיים.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="2. Cache מול Database">
        <p>
          <strong>מסד רלציוני (Postgres)</strong> — נתונים על דיסק, ACID,
          טרנזקציות, JOIN, שאילתות מורכבות. איטי יותר, אבל{" "}
          <strong>מקור האמת</strong>.
        </p>
        <p>
          <strong>Cache (Redis)</strong> — עותק זמני של תוצאה שכבר חישבנו או
          שלפנו. המטרה: לא לשאול את המסד שוב על אותו דבר, או לזכור תשובה
          לבקשה שחוזרת.
        </p>
        <LearnCode
          label="דפוס cache-aside"
          code={`// בלי cache — כל בקשה למסד
const profile = await usersRepository.findById(userId);

// עם cache — קודם Redis, רק אם אין — המסד
const cached = await redis.get("user:" + userId);
if (cached) return JSON.parse(cached);

const profile = await usersRepository.findById(userId);
await redis.set("user:" + userId, JSON.stringify(profile), { EX: 300 });
return profile;`}
        />
        <p>
          <code>EX: 300</code> = תפוגה (TTL) של 5 דקות. אחרי זה המפתח נמחק
          לבד — והבקשה הבאה תרענן אותו מהמסד.
        </p>
      </LearnSection>

      <LearnSection title="3. שימושים נפוצים">
        <ul>
          <li>
            <strong>Cache לשאילתות כבדות</strong> — דף בית שמציג "10 המוצרים
            הנמכרים" לא חייב JOIN כבד בכל בקשה.
          </li>
          <li>
            <strong>Sessions</strong> — מזהה session → פרטי משתמש, עם תפוגה
            אוטומטית.
          </li>
          <li>
            <strong>Rate limiting</strong> — ספירת בקשות לכל IP בחלון זמן
            (<code>INCR</code> + <code>EXPIRE</code>).
          </li>
          <li>
            <strong>Idempotency</strong> — לזכור תשובה לבקשה שכבר טופלה
            (השיעור הבא מוקדש לזה).
          </li>
        </ul>
      </LearnSection>

      <LearnSection title="4. איך מתחברים מ-Node">
        <p>
          חבילת <code>redis</code> מ-npm יוצרת client, מתחברת ל-URL (ממשתנה
          סביבה), ומאפשרת <code>get</code> / <code>set</code> /{" "}
          <code>del</code> ועוד עשרות פקודות.
        </p>
        <LearnCode
          label="תבנית בסיסית"
          code={`import { createClient } from "redis";

const client = createClient({ url: process.env.REDIS_URL });
await client.connect();
await client.ping(); // בדיקה שהחיבור חי

await client.set("greeting", "שלום", { EX: 60 }); // TTL 60 שניות
const value = await client.get("greeting");

await client.quit(); // סגירה נקייה ביציאה`}
        />
        <LearnCode
          label="redis.ts — singleton לכל התהליך"
          code={`import { createClient, type RedisClientType } from "redis";

let client: RedisClientType | null = null;

export async function getRedis(): Promise<RedisClientType> {
  if (client) return client;
  client = createClient({ url: process.env.REDIS_URL });
  client.on("error", (err) => logger.error("Redis error:", err.message));
  await client.connect();
  return client;
}`}
        />
        <LearnCallout variant="warn" title="חיבור אחד לתהליך">
          ב-production מחזיקים client אחד (singleton) — לא פותחים חיבור חדש
          לכל בקשה. פתיחת חיבור היא פעולה יקרה, בדיוק כמו שראינו עם Pool של
          Postgres.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="5. מתי לא להשתמש ב-Redis">
        <ul>
          <li>
            כשצריך <strong>שאילתות מורכבות</strong> או יחסים בין טבלאות —
            מסד רלציוני.
          </li>
          <li>
            כש<strong>כל byte חייב לשרוד</strong> reboot בלי recovery — לא
            רק Redis.
          </li>
          <li>
            כשהפרויקט קטן ו-cache לא פותר בעיה אמיתית — אל תוסיפו complexity
            סתם. cache שלא צריך הוא באג שמחכה לקרות (stale data).
          </li>
        </ul>
        <LearnCallout variant="tip" title="כלל אצבע">
          אם Redis נופל — האפליקציה צריכה להמשיך לעבוד (לאט יותר), כי המסד
          הרלציוני עדיין שם. Redis מזרז, לא מחליף.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="6. טעויות נפוצות">
        <ul>
          <li>
            <strong>מפתחות בלי TTL</strong> — הזיכרון מתמלא עד שהשרת מתחיל
            לזרוק מפתחות או קורס. כמעט תמיד יש תפוגה הגיונית.
          </li>
          <li>
            <strong>שמירת אובייקט בלי JSON.stringify</strong> — Redis שומר
            strings; אובייקט שיישמר ישירות יהפוך ל-"[object Object]".
          </li>
          <li>
            <strong>Redis כמקור אמת</strong> — נתון עסקי שקיים רק ב-Redis הוא
            נתון שעלול להיעלם. תמיד כותבים קודם למסד, ואז ל-cache.
          </li>
        </ul>
        <p className="mt-2 mb-0">
          המשך: <Link to="/learn/node-idempotency">Idempotency</Link> — איך
          Redis עוזר לוודא שאותה בקשה פעמיים לא מבצעת פעולה פעמיים.
        </p>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>Redis = in-memory, מהיר, key-value</li>
          <li>Cache ≠ DB — המסד הרלציוני הוא מקור האמת</li>
          <li>שימושים: cache, sessions, rate limiting, idempotency</li>
          <li>client אחד (singleton) לכל התהליך</li>
          <li>תמיד TTL; תמיד JSON.stringify לאובייקטים</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default NodeRedisLearnPage;
