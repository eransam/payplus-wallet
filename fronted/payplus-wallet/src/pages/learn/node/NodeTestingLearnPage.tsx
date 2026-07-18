import { Link } from "react-router-dom";
import LearnCallout from "../../../components/learn/LearnCallout";
import LearnCode from "../../../components/learn/LearnCode";
import LearnSection from "../../../components/learn/LearnSection";
import LearnTopicLayout from "../../../components/learn/LearnTopicLayout";

function NodeTestingLearnPage() {
  return (
    <LearnTopicLayout
      slug="node-testing"
      objectives={[
        "להבין למה בדיקות הן לא 'תוספת' אלא חלק מהמקצוע",
        "להבדיל בין unit test ל-integration test",
        "לכתוב בדיקת API עם supertest",
        "להבין mocking — לבדוק לוגיקה בלי DB אמיתי",
      ]}
    >
      <LearnSection title="1. למה בכלל בדיקות?">
        <p>
          בלי בדיקות, כל שינוי בקוד הוא הימור: "אני מקווה שלא שברתי כלום".
          עם בדיקות — מריצים פקודה אחת ויודעים תוך שניות אם משהו נשבר.
        </p>
        <ul>
          <li>
            <strong>ביטחון לשנות</strong> — refactor בלי פחד.
          </li>
          <li>
            <strong>תיעוד חי</strong> — בדיקה מראה איך הקוד אמור להתנהג.
          </li>
          <li>
            <strong>באגים נתפסים מוקדם</strong> — לפני production, לא אחרי.
          </li>
        </ul>
        <LearnCallout variant="tip" title="נקודת מבט של סניור">
          בראיונות שואלים "איך אתה בודק את הקוד שלך?" — תשובה טובה מדברת על
          פירמידת בדיקות: הרבה unit, פחות integration, מעט end-to-end.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="2. Unit מול Integration">
        <ul>
          <li>
            <strong>Unit test</strong> — בודק פונקציה אחת <em>מבודדת</em>:
            נכנס X, יוצא Y. מהיר, בלי DB, בלי רשת.
          </li>
          <li>
            <strong>Integration test</strong> — בודק כמה חלקים ביחד: route
            אמיתי → service → DB (לרוב DB של בדיקות).
          </li>
          <li>
            <strong>E2E</strong> — מערכת שלמה כולל פרונט. יקר ואיטי — שומרים
            למסלולים קריטיים.
          </li>
        </ul>
        <LearnCode
          label="Unit test פשוט (Vitest / Jest — אותו תחביר)"
          code={`// price.ts
export function totalWithVat(amount: number, vatRate = 0.17) {
  return Math.round(amount * (1 + vatRate) * 100) / 100;
}

// price.test.ts
import { describe, it, expect } from "vitest";
import { totalWithVat } from "./price";

describe("totalWithVat", () => {
  it("adds 17% VAT by default", () => {
    expect(totalWithVat(100)).toBe(117);
  });

  it("supports custom rate", () => {
    expect(totalWithVat(100, 0)).toBe(100);
  });
});`}
        />
      </LearnSection>

      <LearnSection title="3. בדיקת API עם supertest">
        <p>
          <code>supertest</code> מרים את אפליקציית Express בזיכרון ושולח לה
          בקשות HTTP אמיתיות — בלי לפתוח פורט:
        </p>
        <LearnCode
          label="Integration test ל-route"
          code={`import request from "supertest";
import { app } from "../src/app"; // מייצאים את app בלי listen!

describe("GET /api/users", () => {
  it("returns 200 with users array", async () => {
    const res = await request(app).get("/api/users");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.users)).toBe(true);
  });

  it("returns 401 without token on protected route", async () => {
    const res = await request(app).post("/api/orders").send({});
    expect(res.status).toBe(401);
  });
});`}
        />
        <LearnCallout variant="warn" title="טיפ מבני חשוב">
          מפרידים בין <code>app</code> (הגדרת routes) ל-<code>listen</code>{" "}
          (הפעלה). ככה הבדיקות מייבאות את app בלי להרים שרת אמיתי.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="4. Mocking — לבדוק בלי DB אמיתי">
        <p>
          לוגיקה שקוראת ל-DB? ב-unit test מחליפים את שכבת ה-DB ב"שחקן חליפי"
          (mock) שמחזיר תשובות קבועות:
        </p>
        <LearnCode
          label="Mock לשכבת הנתונים"
          code={`import { vi, describe, it, expect } from "vitest";
import * as usersRepo from "../src/repositories/users-repo";
import { getUserProfile } from "../src/services/users-service";

describe("getUserProfile", () => {
  it("throws 404 when user not found", async () => {
    // במקום DB אמיתי — פונקציה מזויפת שמחזירה null
    vi.spyOn(usersRepo, "findById").mockResolvedValue(null);

    await expect(getUserProfile(999)).rejects.toThrow("User not found");
  });
});`}
        />
        <p>
          ככה בודקים את <strong>הלוגיקה</strong> (מה קורה כשאין משתמש?) בלי
          תלות ב-DB רץ, בנתונים, או ברשת.
        </p>
      </LearnSection>

      <LearnSection title="5. מה שווה לבדוק קודם?">
        <ol>
          <li>
            <strong>לוגיקה עסקית עם כסף/חישובים</strong> — טעויות שם עולות
            ביוקר.
          </li>
          <li>
            <strong>מקרי קצה</strong> — קלט ריק, ערכים שליליים, משתמש שלא
            קיים.
          </li>
          <li>
            <strong>קודי שגיאה של ה-API</strong> — 400/401/404 חוזרים נכון?
          </li>
        </ol>
        <LearnCallout variant="info" title="לא רודפים אחרי 100% coverage">
          עדיף 60% coverage על הקוד הקריטי מאשר 100% שכולל בדיקות חסרות ערך
          על getters. מודדים ערך, לא אחוזים.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="6. טעויות נפוצות">
        <ul>
          <li>
            <strong>בדיקות שתלויות זו בזו</strong> — כל בדיקה חייבת לעמוד
            בפני עצמה (beforeEach שמנקה מצב).
          </li>
          <li>
            <strong>בדיקה על DB של פיתוח</strong> — משתמשים ב-DB ייעודי
            לבדיקות או ב-testcontainers.
          </li>
          <li>
            <strong>לשכוח await</strong> — בדיקה אסינכרונית בלי await "עוברת"
            תמיד כי היא מסתיימת לפני שהבדיקה בכלל רצה.
          </li>
        </ul>
        <p className="mt-2 mb-0">
          המשך: <Link to="/learn/node-validation">Validation בצד שרת</Link> —
          ההגנה הראשונה על ה-API.
        </p>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>פירמידה: הרבה unit, פחות integration, מעט E2E</li>
          <li>supertest = בקשות HTTP ל-app בזיכרון, בלי פורט</li>
          <li>מפרידים app מ-listen כדי שאפשר יהיה לבדוק</li>
          <li>mock לשכבת DB = בודקים לוגיקה מבודדת</li>
          <li>קודם לוגיקת כסף, מקרי קצה, וקודי שגיאה</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default NodeTestingLearnPage;
