import { Link } from "react-router-dom";
import LearnCallout from "../../../components/learn/LearnCallout";
import LearnCode from "../../../components/learn/LearnCode";
import LearnSection from "../../../components/learn/LearnSection";
import LearnTopicLayout from "../../../components/learn/LearnTopicLayout";

function NodeDockerLearnPage() {
  return (
    <LearnTopicLayout
      slug="node-docker"
      objectives={[
        "להבין מה הבעיה ש-Docker פותר ('אצלי זה עובד')",
        "להבדיל בין Image ל-Container",
        "לכתוב Dockerfile לשרת Node",
        "להרים סביבה שלמה (app + DB + Redis) עם docker-compose",
      ]}
    >
      <LearnSection title="1. הבעיה — 'אצלי זה עובד'">
        <p>
          השרת רץ מצוין אצלך: Node 20, משתני env נכונים, ספריות מותקנות. ואז
          מעלים אותו לשרת production — וגרסת Node שונה, חסר env, ומשהו נשבר.
        </p>
        <LearnCallout variant="tip" title="במשפט אחד">
          Docker אורז את האפליקציה + Node + התלויות + ההגדרות ל
          <strong>קופסה אחת</strong> (image) שרצה אותו דבר בכל מחשב ושרת.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="2. שלושה מושגים">
        <ul>
          <li>
            <strong>Image</strong> — "תבנית קפואה": מערכת קבצים + Node + הקוד
            שלך. כמו קובץ התקנה.
          </li>
          <li>
            <strong>Container</strong> — image <em>שרץ</em>. אפשר להריץ כמה
            containers מאותו image.
          </li>
          <li>
            <strong>Dockerfile</strong> — המתכון לבניית ה-image, שלב אחרי
            שלב.
          </li>
        </ul>
        <p>
          דימוי: Image = תקליטור משחק. Container = המשחק כשהוא רץ. Dockerfile
          = הוראות הצריבה.
        </p>
      </LearnSection>

      <LearnSection title="3. Dockerfile לשרת Node">
        <LearnCode
          label="Dockerfile בסיסי ונכון"
          code={`# תמונת בסיס — Node רשמי, גרסה קבועה, slim = קטן
FROM node:20-slim

WORKDIR /app

# קודם רק package*.json — שכבת cache: אם הקוד השתנה
# אבל התלויות לא, docker לא יריץ npm install מחדש
COPY package*.json ./
RUN npm ci --omit=dev

# עכשיו שאר הקוד
COPY . .
RUN npm run build

# לא רצים כ-root
USER node

EXPOSE 3001
CMD ["node", "dist/app.js"]`}
        />
        <LearnCode
          label="בנייה והרצה"
          code={`docker build -t my-api .
docker run -p 3001:3001 --env-file .env my-api
# -p 3001:3001 = חבר את פורט המחשב לפורט הקונטיינר`}
        />
        <LearnCallout variant="warn" title=".dockerignore">
          כמו .gitignore — חובה להחריג <code>node_modules</code> ו-
          <code>.env</code> כדי שלא ייכנסו ל-image (גודל + סודות).
        </LearnCallout>
      </LearnSection>

      <LearnSection title="4. docker-compose — סביבה שלמה בפקודה אחת">
        <p>
          API אמיתי צריך גם Postgres וגם Redis. במקום להתקין אותם על המחשב —
          מגדירים הכל בקובץ אחד:
        </p>
        <LearnCode
          label="docker-compose.yml"
          code={`services:
  api:
    build: .
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgres://app:secret@db:5432/mydb
      REDIS_URL: redis://cache:6379
    depends_on:
      - db
      - cache

  db:
    image: postgres:16
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: mydb
    volumes:
      - db-data:/var/lib/postgresql/data

  cache:
    image: redis:7

volumes:
  db-data:`}
        />
        <LearnCode
          label="הרצה"
          code={`docker compose up -d    # מרים הכל
docker compose logs -f  # לוגים חיים
docker compose down     # מכבה הכל`}
        />
        <p>
          שים לב: בתוך compose, השירותים מדברים זה עם זה{" "}
          <strong>לפי שם</strong> — <code>db</code>, <code>cache</code> — לא
          localhost.
        </p>
      </LearnSection>

      <LearnSection title="5. למה זה קריטי לסניור?">
        <ul>
          <li>
            <strong>Onboarding</strong> — מפתח חדש מריץ{" "}
            <code>docker compose up</code> ויש לו סביבה שלמה בדקות.
          </li>
          <li>
            <strong>CI/CD</strong> — אותו image שנבדק הוא בדיוק מה שעולה
            לפרודקשן.
          </li>
          <li>
            <strong>Scaling</strong> — Kubernetes / ECS מריצים עותקים של
            ה-image שלך (שיעור הבא).
          </li>
        </ul>
      </LearnSection>

      <LearnSection title="6. טעויות נפוצות">
        <ul>
          <li>
            <code>FROM node:latest</code> — גרסה משתנה מתחת לרגליים. תמיד גרסה
            מפורשת.
          </li>
          <li>
            COPY הכל לפני npm install — הורס את ה-cache, כל build איטי.
          </li>
          <li>
            סודות בתוך ה-image — env תמיד מבחוץ (<code>--env-file</code>,
            secrets manager).
          </li>
        </ul>
        <p className="mt-2 mb-0">
          המשך: <Link to="/learn/node-scaling">Scaling ו-Performance</Link> —
          מה עושים כששרת אחד לא מספיק.
        </p>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>Docker = לארוז app + runtime + תלויות לקופסה שרצה בכל מקום</li>
          <li>Image = תבנית; Container = image שרץ; Dockerfile = מתכון</li>
          <li>קודם COPY package.json + install, אחר כך הקוד — בשביל cache</li>
          <li>docker-compose = app + DB + Redis בפקודה אחת</li>
          <li>סודות אף פעם לא בתוך ה-image</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default NodeDockerLearnPage;
