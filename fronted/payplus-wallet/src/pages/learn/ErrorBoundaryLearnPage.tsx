import ErrorBoundary from "../../components/ErrorBoundary";
import CrashDemo from "../../components/learn/CrashDemo";
import FileReference from "../../components/learn/FileReference";
import LearnCallout from "../../components/learn/LearnCallout";
import LearnCode from "../../components/learn/LearnCode";
import LearnSection from "../../components/learn/LearnSection";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";

function ErrorBoundaryLearnPage() {
  return (
    <LearnTopicLayout
      slug="error-boundary"
      objectives={[
        "להבין למה בכלל צריך הגנה מקריסות ב-React",
        "לדעת מה Error Boundary עושה (ולמה יש מסך לבן בלעדיו)",
        "לדעת מה הוא לא תופס (API, לחיצות)",
        "לראות דמו חי בפרויקט",
      ]}
    >
      <LearnSection title="1. למה זה קיים? (הבעיה)">
        <p>
          לפעמים יש באג בקוד. למשל: מנסים להציג שם של סוחר, אבל הנתונים עדיין{" "}
          <code>null</code>:
        </p>
        <LearnCode
          label="באג נפוץ"
          code={`// merchant עדיין null
return <p>{merchant.name}</p>;
// → קריסה: Cannot read properties of null`}
        />
        <p>
          ב-React, כשקורה דבר כזה <strong>בזמן ציור המסך (render)</strong>, בלי
          הגנה — עלול להישבר <em>כל</em> העמוד: מסך לבן, כלום לא עובד.
        </p>
        <p>
          זה גרוע למשתמש. עדיף להראות הודעה: &quot;משהו השתבש, נסה שוב&quot; —
          והשאר האפליקציה (תפריט וכו') יישאר.
        </p>
      </LearnSection>

      <LearnSection title="2. מה זה Error Boundary?">
        <p>
          <strong>Error Boundary</strong> = קומפוננטה מיוחדת שעוטפת חלקים
          באפליקציה ואומרת:
        </p>
        <LearnCode
          label="הרעיון"
          code={`אם ילד שלי קרס בזמן ציור המסך —
  אל תפיל את כל האפליקציה.
  תציג במקום זה הודעת שגיאה יפה.`}
        />
        <LearnCallout variant="info" title="אנלוגיה">
          כמו נתיך בחשמל: אם יש קצר בחדר אחד — הנתיך קופץ, והבית כולו לא
          נשרף. Error Boundary = נתיך לחלק מהמסך.
        </LearnCallout>
        <LearnCode
          label="שימוש"
          code={`<ErrorBoundary>
  <MerchantsPage />
</ErrorBoundary>

// אם MerchantsPage קורס → רואים "משהו השתבש"
// לא מסך לבן על כל האתר`}
        />
      </LearnSection>

      <LearnSection title="3. מה הוא כן תופס / מה לא">
        <h3 className="learn-section__subtitle">כן — קריסה בזמן ציור המסך</h3>
        <ul>
          <li>
            באג ב-<code>return (...)</code> של קומפוננטה
          </li>
          <li>
            למשל: <code>null.name</code>, מערך לא מוגדר, וכו'
          </li>
        </ul>

        <h3 className="learn-section__subtitle">לא — דברים אחרים</h3>
        <ul>
          <li>
            <strong>שגיאת API</strong> (השרת החזיר 500) — זה לא קריסת React.
            מטפלים עם הודעת error / React Query
          </li>
          <li>
            <strong>לחיצה על כפתור</strong> עם באג ב-<code>onClick</code> —
            שם משתמשים ב-<code>try/catch</code> אם צריך
          </li>
        </ul>
        <LearnCallout variant="warn" title="חשוב">
          Error Boundary <strong>לא מחליף</strong> טיפול בשגיאות מהשרת. הוא רק
          רשת בטיחות כשה-UI עצמו קורס.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="4. אצלנו בפרויקט">
        <p>
          ב-<code>App.tsx</code> עטפנו את האפליקציה ב-
          <code>&lt;ErrorBoundary&gt;</code>. אם דף קורס — מוצגת ההודעה מ-
          <code>ErrorBoundary.tsx</code> (עם כפתורי &quot;נסה שוב&quot; /
          &quot;רענן&quot;).
        </p>
      </LearnSection>

      <LearnSection title="5. דמו חי — תרגיש את ההבדל">
        <p>
          לחץ על הכפתור. הקומפוננטה בכוונה קורסת. במקום מסך לבן — Error
          Boundary מציג הודעה.
        </p>
        <div className="learn-demo-box">
          <ErrorBoundary>
            <CrashDemo />
          </ErrorBoundary>
        </div>
      </LearnSection>

      <LearnSection title="6. קבצים">
        <ul className="learn-files">
          <FileReference
            path="fronted/payplus-wallet/src/components/ErrorBoundary.tsx"
            description="הקומפוננטה שתופסת ומראה fallback"
          />
          <FileReference
            path="fronted/payplus-wallet/src/App.tsx"
            description="איפה עוטפים את האפליקציה"
          />
          <FileReference
            path="fronted/payplus-wallet/src/components/learn/CrashDemo.tsx"
            description="הדמו שקורס בכוונה"
          />
        </ul>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>
            בלי הגנה: באג ב-render → לפעמים מסך לבן
          </li>
          <li>
            Error Boundary = נתיך — מציג הודעה במקום שהכל יישבר
          </li>
          <li>
            תופס קריסות ציור מסך · לא שגיאות API
          </li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default ErrorBoundaryLearnPage;
