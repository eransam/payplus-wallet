import { Link } from "react-router-dom";
import LearnCallout from "../../../components/learn/LearnCallout";
import LearnCode from "../../../components/learn/LearnCode";
import LearnSection from "../../../components/learn/LearnSection";
import LearnTopicLayout from "../../../components/learn/LearnTopicLayout";

function MongoInstallLearnPage() {
  return (
    <LearnTopicLayout
      slug="mongo-install"
      objectives={[
        "להרים MongoDB עם Docker (הדרך המומלצת — כמו ה-Postgres שלנו)",
        "להתקין את MongoDB Compass — ה-GUI הרשמי",
        "להכיר את mongosh — הטרמינל של מונגו",
        "לבדוק שהכול עובד עם פקודות ראשונות",
      ]}
    >
      <LearnSection title="1. מה מתקינים בכלל? שלושה חלקים">
        <ul>
          <li>
            <strong>MongoDB Server (mongod)</strong> — המסד עצמו. התהליך שרץ
            ברקע ומאזין על פורט <code>27017</code> (כמו ש-Postgres מאזין על
            5432).
          </li>
          <li>
            <strong>MongoDB Compass</strong> — ה-GUI הרשמי. המקבילה ל-pgAdmin:
            רואים את הנתונים, מריצים שאילתות, בונים אינדקסים — הכל בעיניים.
          </li>
          <li>
            <strong>mongosh</strong> — ה-shell (טרמינל אינטראקטיבי). המקבילה
            ל-psql. שימושי לפקודות מהירות, וכבר מגיע מובנה בתוך Compass.
          </li>
        </ul>
        <LearnCallout variant="tip" title="ההמלצה שלנו">
          את השרת מריצים עם <strong>Docker</strong> (בדיוק כמו שאנחנו מריצים
          Postgres ו-Redis בפרויקט), ואת <strong>Compass</strong> מתקינים
          כאפליקציה רגילה על ה-Mac. ככה המחשב נשאר נקי — מוחקים קונטיינר וזהו.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="2. הרצת השרת עם Docker">
        <p>אפשרות א' — פקודה חד-פעמית מהטרמינל:</p>
        <LearnCode
          label="docker run — מרים מונגו בשניות"
          code={`docker run -d \\
  --name learn-mongo \\
  -p 27017:27017 \\
  -v mongo_data:/data/db \\
  mongo:7`}
        />
        <ul>
          <li>
            <code>-d</code> — רץ ברקע (detached).
          </li>
          <li>
            <code>-p 27017:27017</code> — חיבור הפורט מהמחשב לקונטיינר.
          </li>
          <li>
            <code>-v mongo_data:/data/db</code> — volume כדי שהנתונים ישרדו
            מחיקה של הקונטיינר.
          </li>
        </ul>
        <p>
          אפשרות ב' (מסודרת יותר) — להוסיף שירות ל-
          <code>docker-compose.yml</code>, בדיוק כמו ה-db וה-redis שכבר יש לנו:
        </p>
        <LearnCode
          label="docker-compose.yml — מוסיפים שירות mongo"
          code={`services:
  # ... db (postgres) ו-redis שכבר קיימים ...

  mongo:
    image: mongo:7
    container_name: payplus-wallet-mongo
    restart: unless-stopped
    ports:
      - "27017:27017"
    volumes:
      - payplus_mongo_data:/data/db
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 5s
      timeout: 5s
      retries: 10

volumes:
  # ... הקיימים ...
  payplus_mongo_data:`}
        />
        <LearnCode
          label="ואז מרימים ובודקים"
          code={`docker compose up -d
docker ps          # אמור להופיע payplus-wallet-mongo עם STATUS: Up (healthy)`}
        />
        <LearnCallout variant="info" title="בלי Docker?">
          אפשר גם התקנה מקומית על Mac: <code>brew tap mongodb/brew</code> ואז{" "}
          <code>brew install mongodb-community</code> ולבסוף{" "}
          <code>brew services start mongodb-community</code>. עובד מצוין — אבל
          Docker נקי יותר וזהה למה שתפגשו בעבודה.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="3. התקנת Compass — ה-GUI">
        <p>
          מורידים מהאתר הרשמי:{" "}
          <a
            href="https://www.mongodb.com/try/download/compass"
            target="_blank"
            rel="noreferrer"
          >
            mongodb.com/try/download/compass
          </a>{" "}
          (או <code>brew install --cask mongodb-compass</code>). בפתיחה
          הראשונה:
        </p>
        <ul>
          <li>
            לוחצים <strong>Add new connection</strong>.
          </li>
          <li>
            ב-URI משאירים את ברירת המחדל:{" "}
            <code>mongodb://localhost:27017</code>
          </li>
          <li>
            לוחצים <strong>Connect</strong> — וזהו, אתם בפנים.
          </li>
        </ul>
        <p>מה רואים ב-Compass ולמה זה שווה זהב בזמן למידה:</p>
        <ul>
          <li>
            <strong>Databases בצד שמאל</strong> — כמו Object Explorer ב-pgAdmin.
          </li>
          <li>
            <strong>Documents</strong> — הנתונים עצמם, כל מסמך ככרטיס JSON.
            אפשר לערוך ישירות ביד.
          </li>
          <li>
            <strong>שורת Filter</strong> — מריצים שאילתות בלי קוד, למשל{" "}
            <code>{"{ balance: { $gt: 100 } }"}</code>.
          </li>
          <li>
            <strong>Indexes / Explain Plan</strong> — לבדוק ביצועים (שיעור 7).
          </li>
          <li>
            <strong>mongosh מובנה</strong> — יש טרמינל בתחתית המסך, לא צריך
            להתקין כלום בנפרד.
          </li>
        </ul>
        <LearnCallout variant="tip" title="GUI חלופות">
          Compass הוא הסטנדרט והכי מומלץ להתחלה. חלופות שתפגשו בתעשייה:{" "}
          <strong>Studio 3T</strong> (עשיר, בתשלום), <strong>TablePlus</strong>{" "}
          (תומך גם Postgres וגם Mongo — נוח למי שעובד עם שניהם), והתוסף של
          MongoDB ל-VS Code.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="4. צעדים ראשונים — בודקים שהכול חי">
        <p>
          פותחים את ה-mongosh (בתחתית Compass, או{" "}
          <code>docker exec -it payplus-wallet-mongo mongosh</code> מהטרמינל)
          ומריצים:
        </p>
        <LearnCode
          label="הפקודות הראשונות שלך במונגו"
          code={`// איפה אני?
db                          // מציג את ה-database הנוכחי (test כברירת מחדל)

// מעבר / יצירת database (נוצר בפועל רק כשמכניסים נתון ראשון)
use payplus_learn

// הכנסת מסמך ראשון — וזה יוצר גם את ה-collection וגם את ה-database
db.wallets.insertOne({ owner: "ערן", balance: 500, currency: "ILS" })

// לראות מה יש
show dbs                    // כל ה-databases
show collections            // כל ה-collections ב-db הנוכחי
db.wallets.find()           // כל המסמכים ב-collection`}
        />
        <p>
          עכשיו תפתחו את Compass, תרעננו (Refresh) — ותראו את{" "}
          <code>payplus_learn</code> עם ה-collection <code>wallets</code> והמסמך
          שיצרתם. זה הרגע שבו הכול מתחבר: מה שעשינו בטרמינל מופיע ב-GUI.
        </p>
        <LearnCallout variant="warn" title="שימו לב — אין CREATE">
          במונגו לא "יוצרים" database או collection מראש. הם נוצרים אוטומטית
          ברגע שמכניסים אליהם מסמך ראשון. נוח — אבל טעות כתיב בשם (
          <code>walets</code> במקום <code>wallets</code>) פשוט תיצור collection
          חדש בשקט, בלי שגיאה. זו טעות נפוצה מאוד של מתחילים.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="5. איפה גרים הנתונים? (ולמה volume חשוב)">
        <p>
          בתוך הקונטיינר, מונגו כותב לדיסק בנתיב <code>/data/db</code>. בגלל
          שחיברנו לשם volume (<code>payplus_mongo_data</code>), הנתונים שמורים
          גם אם הקונטיינר נמחק ונבנה מחדש — בדיוק כמו שעשינו עם Postgres.
        </p>
        <LearnCode
          label="פקודות תחזוקה שימושיות"
          code={`docker compose stop mongo       # עצירה (הנתונים נשארים)
docker compose start mongo      # הפעלה מחדש
docker logs payplus-wallet-mongo # לוגים של השרת
docker volume ls                 # לראות את ה-volumes`}
        />
        <p className="mt-2 mb-0">
          הסביבה מוכנה! השיעור הבא:{" "}
          <Link to="/learn/mongo-crud">CRUD — הפעולות הבסיסיות</Link> — מתחילים
          לעבוד עם נתונים באמת.
        </p>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>שלושה חלקים: mongod (שרת, פורט 27017), Compass (GUI), mongosh (טרמינל)</li>
          <li>הרצה מומלצת: Docker עם volume — כמו Postgres אצלנו</li>
          <li>Compass מתחבר ל-mongodb://localhost:27017</li>
          <li>use יוצר db; המסמך הראשון יוצר את ה-collection בפועל</li>
          <li>זהירות מטעויות כתיב — אין שגיאה על collection שלא קיים</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default MongoInstallLearnPage;
