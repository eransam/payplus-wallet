import FileReference from "../../components/learn/FileReference";
import LearnCallout from "../../components/learn/LearnCallout";
import LearnCode from "../../components/learn/LearnCode";
import LearnSection from "../../components/learn/LearnSection";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";

function DeploymentLearnPage() {
  return (
    <LearnTopicLayout
      slug="deployment"
      objectives={[
        "להבין את 3 החלקים של הפרויקט ואיך כל אחד עולה ל-AWS",
        "להבין מה זה Vite ולמה אחרי build הפרונט הוא קבצים סטטיים",
        "לדעת מה זה S3, CloudFront, RDS, EC2, ACM — במשפט אחד כל אחד",
        "להבין איך מחברים דומיין (www + api) עם HTTPS",
        "להבין איך GitHub מחובר לעדכוני גרסאות (CI/CD)",
      ]}
    >
      <LearnSection title="1. התמונה הגדולה (פרויקט כמו שלנו)">
        <p>
          PayPlus Wallet = 3 חלקים שונים. בענן כל חלק מקבל שירות אחר:
        </p>
        <LearnCode
          label="ארכיטקטורה יעד"
          code={`www.2ai.co.il
  → CloudFront (HTTPS + CDN)
      → S3          ← קבצי React אחרי build (dist/)

api.2ai.co.il
  → EC2            ← Node/Express (npm start)
      → RDS        ← PostgreSQL (במקום Docker)
      → Redis      ← cache / idempotency (אופציונלי על אותו EC2)`}
        />
        <LearnCallout variant="info" title="אנלוגיה">
          <ul>
            <li>
              <strong>S3</strong> = תיקיית הקבצים של האתר
            </li>
            <li>
              <strong>CloudFront</strong> = הדלפק שמחלק אותם מהר ובטוח
            </li>
            <li>
              <strong>EC2</strong> = המחשב שמריץ את ה-API
            </li>
            <li>
              <strong>RDS</strong> = מסד הנתונים המנוהל
            </li>
          </ul>
        </LearnCallout>
      </LearnSection>

      <LearnSection title="1ב. מה זה Vite?">
        <p>
          כשאתה כותב React, אתה כותב קבצים כמו <code>.tsx</code> שהדפדפן{" "}
          <strong>לא מבין ישירות</strong>. צריך מישהו שיהפוך אותם לקבצים
          שהדפדפן כן מבין (HTML, JS, CSS).
        </p>
        <p>
          <strong>Vite</strong> = הכלי הזה אצלנו בפרונט.
        </p>
        <p>יש לו שני תפקידים, לפי הפקודה שאתה מריץ:</p>
        <ol>
          <li>
            <strong>
              <code>npm start</code> (פיתוח על המחשב)
            </strong>
            <br />
            Vite פותח את האתר בכתובת כמו <code>localhost:5173</code> /{" "}
            <code>3000</code>. אתה משנה קוד → רואה שינוי מהר. זה רק אצלך
            במחשב, לא בענן.
          </li>
          <li>
            <strong>
              <code>npm run build</code> (הכנה להעלאה)
            </strong>
            <br />
            Vite לוקח את כל תיקיית <code>src/</code> ויוצר תיקייה חדשה{" "}
            <code>dist/</code> — קבצים מוכנים. את <code>dist/</code> מעלים
            ל-S3. אחרי זה Vite כבר לא רץ באינטרנט.
          </li>
        </ol>
        <LearnCallout variant="info" title="אנלוגיה פשוטה">
          <ul>
            <li>
              <code>src/</code> = מתכון + מצרכים (הקוד שאתה כותב)
            </li>
            <li>
              <strong>Vite</strong> = השף שמכין את האוכל
            </li>
            <li>
              <code>dist/</code> = המנה המוכנה (מה שהאורחים אוכלים)
            </li>
            <li>
              <strong>S3</strong> = המגש שמגישים ממנו את המנה לאורחים
            </li>
          </ul>
        </LearnCallout>
        <LearnCode
          label="בקיצור"
          code={`npm start      → Vite מריץ את האתר אצלך (לפיתוח)
npm run build → Vite מייצר dist/ (להעלאה לענן)
                אחר כך מעלים את dist/ ל-S3 — בלי Vite`}
        />
        <LearnCallout variant="tip" title="לא להתבלבל עם ה-API">
          כשאתה מריץ <code>npm run dev</code> בשורש הפרויקט — זה{" "}
          <strong>Express</strong> (השרת של merchants/wallets). Vite הוא רק
          לפרונט בתיקיית <code>fronted/payplus-wallet</code>. שני דברים
          נפרדים.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="2. מילון קצר — מה זה כל דבר?">
        <ul>
          <li>
            <strong>Deployment</strong> — להעביר מהמחשב שלך לאינטרנט, כדי
            שאחרים יוכלו להשתמש.
          </li>
          <li>
            <strong>Vite</strong> — הופך את קוד React ב-<code>src/</code>{" "}
            לאתר שרץ במחשב (<code>npm start</code>) או לקבצים ב-
            <code>dist/</code> להעלאה (<code>npm run build</code>).
          </li>
          <li>
            <strong>S3</strong> — מחסן קבצים. לפרונט: שומרים שם את{" "}
            <code>dist/</code> אחרי <code>npm run build</code>.
          </li>
          <li>
            <strong>CloudFront</strong> — CDN מול S3: HTTPS, מהירות, דומיין
            מותאם.
          </li>
          <li>
            <strong>ACM</strong> — תעודת SSL (HTTPS). מוכיחים בעלות על הדומיין
            עם רשומת CNAME ב-DNS.
          </li>
          <li>
            <strong>RDS</strong> — PostgreSQL מנוהל בענן (במקום{" "}
            <code>docker compose</code> מקומי).
          </li>
          <li>
            <strong>EC2</strong> — מחשב וירטואלי שמריץ את Node API 24/7.
          </li>
          <li>
            <strong>Security Group</strong> — חומת אש: מי מורשה לדבר עם מי
            (למשל EC2 → RDS על פורט 5432).
          </li>
          <li>
            <strong>CI/CD</strong> — אוטומציה: push ל-Git → build → העלאה
            לענן בלי העתקה ידנית.
          </li>
        </ul>
      </LearnSection>

      <LearnSection title="3. שלב א׳ — העלאת הפרונט (React)">
        <ol>
          <li>
            <code>npm run build</code> בתיקיית{" "}
            <code>fronted/payplus-wallet</code> → נוצרת <code>dist/</code>
          </li>
          <li>
            יוצרים <strong>S3 bucket</strong>, מעלים את תוכן{" "}
            <code>dist/</code> (<code>index.html</code> + <code>assets/</code>)
          </li>
          <li>
            יוצרים <strong>CloudFront</strong> שמקורו ב-S3, Default root ={" "}
            <code>index.html</code>, שגיאות 403/404 → <code>/index.html</code>{" "}
            (ל-React Router)
          </li>
          <li>
            בודקים: <code>https://xxxxx.cloudfront.net</code>
          </li>
        </ol>
        <LearnCallout variant="tip" title="מה כבר עשינו בפרויקט">
          Bucket: <code>payplus-wallet-frontend-eransam21</code> · CloudFront:{" "}
          <code>d1qycovj074897.cloudfront.net</code>
        </LearnCallout>
        <LearnCode
          label="למה VITE_API_BASE?"
          code={`// src/services/api.ts
const API_BASE = import.meta.env.VITE_API_BASE ?? "/api";

// ב-dev: Vite proxy → localhost:3001
// בפרודקשן: אין proxy → חייבים:
// VITE_API_BASE=https://api.2ai.co.il/api
// ואז npm run build מחדש`}
        />
      </LearnSection>

      <LearnSection title="4. שלב ב׳ — מסד נתונים (RDS)">
        <p>
          מקומית: Postgres ב-Docker. בענן: <strong>RDS</strong> (או Aurora)
          רץ תמיד, עם endpoint קבוע.
        </p>
        <LearnCode
          label="מה שומרים אחרי יצירה"
          code={`Endpoint: database-1.cluster-xxxxx.us-east-1.rds.amazonaws.com
Port:     5432
User:     postgres
Password: (מה שבחרת)
DB name:  payplus_wallet   ← כמו ב-docker-compose`}
        />
        <p>
          אחרי שה-API על EC2 — מריצים <code>npm run run-sql</code> מול RDS
          (יוצר טבלאות + stored procedures מ-
          <code>database_scripts/</code>).
        </p>
        <LearnCallout variant="warn" title="Security Group">
          RDS לא פתוח לאינטרנט. פותחים פורט <strong>5432</strong> רק מ-
          Security Group של ה-EC2.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="5. שלב ג׳ — Backend (EC2)">
        <p>
          הפרונט ב-S3 הוא רק קבצים. ה-API צריך מחשב שרץ תמיד ומריץ Node —
          זה <strong>EC2</strong>.
        </p>
        <ul>
          <li>
            <strong>EC2</strong> = מחשב וירטואלי בענן של AWS (כמו המחשב שלך,
            אבל באינטרנט, דלוק 24/7).
          </li>
          <li>
            <strong>Ubuntu Server</strong> = מערכת ההפעלה על המחשב הזה (Linux),
            במקום Windows. עובדים איתה בעיקר בטרמינל, לא עם מסך שולחן עבודה.
          </li>
          <li>
            <strong>SSH</strong> = התחברות מרחוק לשרת מהמחשב שלך (PowerShell).
          </li>
          <li>
            <strong>קובץ <code>.pem</code></strong> = מפתח אבטחה (כמו סיסמה
            בקובץ). בלי המפתח אי אפשר להתחבר. שומרים אותו רק אצלך — לא ב-Git.
          </li>
        </ul>
        <LearnCallout variant="info" title="אנלוגיה">
          <ul>
            <li>
              <strong>EC2</strong> = השכירות של החדר (המחשב)
            </li>
            <li>
              <strong>Ubuntu</strong> = הריהוט / מערכת ההפעלה בחדר
            </li>
            <li>
              <strong>Node + הקוד שלנו</strong> = מה שמריצים בחדר (ה-API)
            </li>
            <li>
              <strong>
                <code>.pem</code>
              </strong>{" "}
              = המפתח לדלת
            </li>
          </ul>
        </LearnCallout>
        <p>הסדר הכללי:</p>
        <ol>
          <li>יוצרים EC2 עם Ubuntu ומורידים את ה-<code>.pem</code></li>
          <li>
            מתחברים ב-SSH מהמחשב:{" "}
            <code>ssh -i ....pem ubuntu@IP</code>
          </li>
          <li>מתקינים Node (כמו במחשב שלך)</li>
          <li>
            מושכים את הקוד מ-GitHub (<code>git clone</code>)
          </li>
          <li>
            יוצרים <code>.env</code> עם כתובת ה-RDS וסיסמאות
          </li>
          <li>
            מריצים SQL + את ה-API, ועם <strong>PM2</strong> כדי שיחזור אחרי
            restart של השרת
          </li>
        </ol>
        <LearnCode
          label="רצף על השרת (תמצית)"
          code={`# 1) מהמחשב שלך (Windows PowerShell):
ssh -i payplus-wallet-key.pem ubuntu@YOUR_EC2_IP

# 2) על השרת (Ubuntu) — אחרי שהתחברת:
git clone https://github.com/eransam/payplus-wallet.git
cd payplus-wallet
npm install
npm run build

# 3) קובץ .env בשורש הפרויקט (לא ב-Git):
NODE_ENV=production
PORT=3001
DATABASE_URL=postgresql://postgres:PASS@RDS_ENDPOINT:5432/payplus_wallet
REDIS_URL=redis://127.0.0.1:6379
JWT_SECRET=long-random-secret

# 4) טבלאות + הרצת API:
npm run run-sql
pm2 start npm --name payplus-api -- start
pm2 save`}
        />
        <p>
          בדיקה מהדפדפן / מהמחשב:{" "}
          <code>http://YOUR_EC2_IP:3001/api/health</code> → צריך{" "}
          <code>database: connected</code>.
        </p>
        <LearnCallout variant="tip" title="למה לא S3 ל-API?">
          S3 שומר קבצים סטטיים. Express צריך תהליך Node חי שמקבל בקשות —
          לכן EC2 (או שירות דומה כמו ECS), לא S3.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="6. שלב ד׳ — חיבור לדומיין (2ai.co.il)">
        <p>שני שמות נפרדים — פרונט ו-API:</p>
        <LearnCode
          label="DNS ב-LiveDNS (אחרי שהכל מוכן)"
          code={`# 1) תעודת HTTPS לפרונט (ACM, region us-east-1)
CNAME validation:
  _xxxxx.www  →  _yyyy.acm-validations.aws

# 2) CloudFront: Alternate domain = www.2ai.co.il + התעודה

# 3) LiveDNS — הפרונט:
www  CNAME  →  d1qycovj074897.cloudfront.net
# (מוחקים A ישן של www שמצביע ל-parking)

# 4) LiveDNS — ה-API:
api  A      →  Elastic IP של EC2
# (או CNAME ל-Load Balancer אם יש)`}
        />
        <LearnCallout variant="info" title="למה ACM ב-us-east-1?">
          תעודות ל-CloudFront חייבות להיות ב-N. Virginia (
          <code>us-east-1</code>), גם אם ה-S3 ב-Stockholm.
        </LearnCallout>
        <p>
          אחרי שה-API חי: build מחדש של הפרונט עם{" "}
          <code>VITE_API_BASE=https://api.2ai.co.il/api</code> → העלאה ל-S3 →
          Invalidate ב-CloudFront.
        </p>
      </LearnSection>

      <LearnSection title="7. שלב ה׳ — Git: איך מעדכנים לגרסה חדשה?">
        <p>
          <strong>GitHub</strong> = מקור האמת של הקוד. כל שינוי קוד קודם נשמר
          שם עם <code>git push</code>. אחר כך מעדכנים את הענן — פרונט ובק{" "}
          <em>בנפרד</em>, כי הם על שירותים שונים.
        </p>
        <LearnCode
          label="תמיד קודם — על המחשב שלך"
          code={`# כתבת קוד חדש (פרונט ו/או בק)
git add .
git commit -m "what changed"
git push origin main

# עכשיו הקוד ב-GitHub מעודכן.
# הענן עדיין על הגרסה הישנה — עד שמעדכנים ידנית (או CI).`}
        />
        <p>
          <strong>עדכון הפרונט</strong> (React → S3 → CloudFront):
        </p>
        <ol>
          <li>
            בתיקיית <code>fronted/payplus-wallet</code>:{" "}
            <code>npm run build</code> (עם <code>VITE_API_BASE</code> אם צריך)
          </li>
          <li>
            מעלים את <code>dist/</code> ל-S3 (מחליפים את הקבצים הישנים)
          </li>
          <li>
            CloudFront → <strong>Invalidation</strong> של <code>/*</code> —
            כדי שהמשתמשים יקבלו את הגרסה החדשה ולא cache ישן
          </li>
        </ol>
        <p>
          <strong>עדכון הבק</strong> (Node על EC2):
        </p>
        <ol>
          <li>
            SSH לשרת: <code>ssh -i ....pem ubuntu@IP</code>
          </li>
          <li>
            בתיקיית הפרויקט: <code>git pull</code> (מושך את הגרסה מ-GitHub)
          </li>
          <li>
            <code>npm install</code> (אם נוספו חבילות) →{" "}
            <code>npm run build</code>
          </li>
          <li>
            <code>pm2 restart payplus-api</code> — מפעיל מחדש את ה-API עם
            הקוד החדש
          </li>
        </ol>
        <LearnCallout variant="info" title="בקיצור">
          <ul>
            <li>
              <code>git push</code> = שומרים גרסה ב-GitHub
            </li>
            <li>
              פרונט = build → העלאה ל-S3 → Invalidation
            </li>
            <li>
              בק = על EC2 עושים <code>git pull</code> + restart
            </li>
          </ul>
        </LearnCallout>
        <p>
          <strong>עם CI/CD (מקצועי יותר):</strong> GitHub Actions מריץ את שני
          העדכונים אוטומטית אחרי כל <code>push</code> ל-<code>main</code> —
          בלי להעלות ידנית ל-S3 ובלי SSH ידני.
        </p>
        <LearnCode
          label="רעיון ה-pipeline"
          code={`push to main
  ├── Frontend:  build → s3 sync → cloudfront invalidation
  └── Backend:   ssh → git pull → build → pm2 restart`}
        />
        <p>
          סיסמאות ו-AWS keys נשמרים ב-<strong>GitHub Secrets</strong> — לא
          בתוך הריפו.
        </p>
      </LearnSection>

      <LearnSection title="8. איך מעדכנים את השרת ביום־יום?">
        <LearnCode
          label="צ׳קליסט קצר"
          code={`# שינוי בפרונט בלבד:
1. git push
2. npm run build  (עם VITE_API_BASE אם צריך)
3. העלאה ל-S3
4. CloudFront → Invalidations → /*

# שינוי בבק בלבד:
1. git push
2. SSH ל-EC2
3. cd payplus-wallet && git pull
4. npm install && npm run build
5. pm2 restart payplus-api

# שינוי ב-SQL (database_scripts):
1. על EC2: npm run run-sql
2. pm2 restart payplus-api`}
        />
        <LearnCallout variant="warn" title="עלות">
          EC2 + RDS דולקים 24/7 עולים כסף. כשלא מתרגלים — Stop ל-EC2 /
          מחיקת משאבים שלא בשימוש. CloudFront + S3 לתרגול בדרך כלל זולים.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="9. סדר עבודה מומלץ (מהראשון לאחרון)">
        <ol>
          <li>Build פרונט → S3 → CloudFront (HTTPS על כתובת AWS)</li>
          <li>ACM + CNAME ב-DNS → <code>www.2ai.co.il</code></li>
          <li>RDS + EC2 + Security Groups + <code>.env</code> + run-sql</li>
          <li>
            דומיין <code>api.2ai.co.il</code> → rebuild פרונט עם{" "}
            <code>VITE_API_BASE</code>
          </li>
          <li>GitHub Actions (אופציונלי) — deploy אוטומטי</li>
        </ol>
      </LearnSection>

      <LearnSection title="10. קבצים רלוונטיים בפרויקט">
        <ul className="learn-files">
          <FileReference
            path="fronted/payplus-wallet/vite.config.ts"
            description="הגדרות Vite — proxy ל-/api ב-dev"
          />
          <FileReference
            path="fronted/payplus-wallet/src/services/api.ts"
            description="VITE_API_BASE — כתובת ה-API בפרודקשן"
          />
          <FileReference
            path="fronted/payplus-wallet/.env.example"
            description="דוגמה למשתנה סביבה של הפרונט"
          />
          <FileReference
            path="fronted/payplus-wallet/dist/"
            description="מה שמעלים ל-S3 אחרי npm run build"
          />
          <FileReference
            path="src/app.ts"
            description="נקודת כניסה של ה-API (Express)"
          />
          <FileReference
            path="src/01-utils/config.ts"
            description="DATABASE_URL, REDIS_URL, JWT_SECRET"
          />
          <FileReference
            path="docker-compose.yml"
            description="Postgres + Redis מקומיים — בענן: RDS (+ Redis)"
          />
          <FileReference
            path="database_scripts/"
            description="SQL שרצים עם npm run run-sql מול RDS"
          />
        </ul>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>
            <strong>Vite</strong> = מריץ פרונט בפיתוח / בונה{" "}
            <code>dist/</code> להעלאה
          </li>
          <li>
            <strong>פרונט</strong> = build → S3 → CloudFront → דומיין www
          </li>
          <li>
            <strong>DB</strong> = RDS (PostgreSQL מנוהל)
          </li>
          <li>
            <strong>בק</strong> = EC2 + Node + PM2 + <code>.env</code>
          </li>
          <li>
            <strong>דומיין</strong> = DNS (CNAME/A) + ACM (HTTPS)
          </li>
          <li>
            <strong>Git</strong> = מקור האמת; CI/CD מעלה גרסאות אוטומטית
          </li>
          <li>
            עדכון: push → build/pull → S3 או <code>pm2 restart</code>
          </li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default DeploymentLearnPage;
