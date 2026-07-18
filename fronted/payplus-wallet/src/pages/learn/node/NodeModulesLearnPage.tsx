import { Link } from "react-router-dom";
import LearnCallout from "../../../components/learn/LearnCallout";
import LearnCode from "../../../components/learn/LearnCode";
import LearnSection from "../../../components/learn/LearnSection";
import LearnTopicLayout from "../../../components/learn/LearnTopicLayout";

function NodeModulesLearnPage() {
  return (
    <LearnTopicLayout
      slug="node-modules"
      objectives={[
        "להבין למה מחלקים קוד לקבצים (modules)",
        "להכיר CommonJS (require) מול ESM (import)",
        "לדעת מה קובע השדה type ב-package.json",
        "להבחין בין ייבוא חבילת npm לייבוא קובץ מקומי",
      ]}
    >
      <LearnSection title="1. למה modules?">
        <p>
          אי אפשר לשים את כל השרת בקובץ אחד של 5000 שורות. Module = קובץ
          שמגדיר מה הוא <strong>מייצא</strong> החוצה, ואחרים{" "}
          <strong>מייבאים</strong> ממנו.
        </p>
        <LearnCode
          label="רעיון"
          code={`// math.ts
export function add(a: number, b: number) {
  return a + b;
}

// index.ts
import { add } from "./math";
console.log(add(2, 3));`}
        />
        <p>
          כל מה שלא יוצא ב-<code>export</code> נשאר <strong>פרטי</strong>{" "}
          לקובץ — זו הדרך הטבעית ב-JS להסתיר פרטי מימוש.
        </p>
      </LearnSection>

      <LearnSection title="2. שני עולמות: CommonJS ו-ESM">
        <p>
          היסטורית Node השתמש ב-<strong>CommonJS</strong>:
        </p>
        <LearnCode
          label="CommonJS (ישן יותר, עדיין נפוץ)"
          code={`const express = require("express");

function add(a, b) {
  return a + b;
}

module.exports = { add };`}
        />
        <p>
          היום הסטנדרט ב-JS הוא <strong>ES Modules</strong> — אותו תחביר בדיוק
          כמו בפרונט מודרני (Vite / React):
        </p>
        <LearnCode
          label="ESM"
          code={`import express from "express";

export function add(a, b) {
  return a + b;
}

export default app;`}
        />
        <LearnCallout variant="info" title="איך Node יודע במה להשתמש?">
          ב-<code>package.json</code>: <code>"type": "module"</code> → קבצי{" "}
          <code>.js</code> הם ESM. בלי זה — CommonJS כברירת מחדל. אפשר גם
          לפי סיומת: <code>.mjs</code> תמיד ESM, <code>.cjs</code> תמיד
          CommonJS. בקוד TypeScript כותבים <code>import</code> /{" "}
          <code>export</code> וה-compiler מתרגם לפי ההגדרות.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="3. ייבוא חבילה מול ייבוא קובץ מקומי">
        <LearnCode
          label="ההבדל"
          code={`import express from "express";        // מ-node_modules
import { add } from "./utils/math";   // קובץ מקומי
import config from "../config";       // תיקייה אחת למעלה`}
        />
        <p>
          שם בלי נתיב (<code>express</code>) = חבילת npm ש-Node מחפש ב-
          <code>node_modules</code>. נתיב שמתחיל ב-<code>./</code> או{" "}
          <code>../</code> = קובץ שלך.
        </p>
      </LearnSection>

      <LearnSection title="4. default export מול named exports">
        <LearnCode
          label="שתי צורות ייצוא"
          code={`// named — אפשר כמה בכל קובץ
export function formatDate(d: Date) { ... }
export const MAX_ITEMS = 100;

// default — אחד לכל קובץ
export default function createServer() { ... }

// ייבוא:
import createServer, { formatDate, MAX_ITEMS } from "./server";`}
        />
        <ul>
          <li>
            <strong>named</strong> — השם חייב להתאים (או להשתמש ב-
            <code>as</code> לשינוי שם). מעולה לפונקציות עזר.
          </li>
          <li>
            <strong>default</strong> — המייבא בוחר שם. נהוג כשהקובץ מייצג
            "דבר אחד מרכזי".
          </li>
        </ul>
      </LearnSection>

      <LearnSection title="5. איך מארגנים פרויקט שרת טיפוסי">
        <LearnCode
          label="מבנה נפוץ"
          code={`src/
  index.ts        # נקודת כניסה — מרכיב הכל ומאזין לפורט
  routes/         # הגדרות נתיבים
    users.ts
    products.ts
  services/       # לוגיקה עסקית
    user-service.ts
  db/             # גישה למסד נתונים
    pool.ts
  utils/          # פונקציות עזר כלליות
    logger.ts`}
        />
        <p>
          כל תיקייה היא "שכבה" עם אחריות אחת, וכל קובץ מייצא רק את מה
          שאחרים צריכים. נקודת הכניסה מייבאת את כולם ומחברת אותם.
        </p>
      </LearnSection>

      <LearnSection title="6. טעויות נפוצות">
        <ul>
          <li>
            לערבב <code>require</code> ו-<code>import</code> באותו קובץ —
            בוחרים סגנון אחד לפרויקט.
          </li>
          <li>
            ייבוא מעגלי (A מייבא את B ש-B מייבא את A) — עלול לתת{" "}
            <code>undefined</code> מפתיע. פותרים בהוצאת הקוד המשותף לקובץ
            שלישי.
          </li>
          <li>
            לשכוח סיומת קובץ ב-ESM טהור (<code>import "./math.js"</code>) —
            ב-ESM של Node הסיומת חובה, בניגוד ל-CommonJS.
          </li>
        </ul>
        <p className="mt-2 mb-0">
          המשך: <Link to="/learn/node-async">Async</Link> — Promises ו-
          async/await.
        </p>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>Module = קובץ עם export / import</li>
          <li>CommonJS = require / module.exports</li>
          <li>ESM = import / export (סטנדרט מודרני)</li>
          <li>חבילת npm מול קובץ מקומי — לפי הנתיב</li>
          <li>named exports לרבים; default ל"דבר מרכזי אחד"</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default NodeModulesLearnPage;
