import DemoLink from "../../components/learn/DemoLink";
import FileReference from "../../components/learn/FileReference";
import LearnCallout from "../../components/learn/LearnCallout";
import LearnCode from "../../components/learn/LearnCode";
import LearnSection from "../../components/learn/LearnSection";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";

function RouterLearnPage() {
  return (
    <LearnTopicLayout
      slug="router"
      objectives={[
        "להבין מה React Router עושה",
        "להכיר Routes, Route, Link / NavLink",
        "למצוא את המיפוי בין URL לדף ב-App.tsx",
      ]}
    >
      <LearnSection title="1. למה צריך Router?">
        <p>
          באתר עם דפים רבים רוצים שה-URL ישתנה (<code>/merchants</code>,{" "}
          <code>/wallets</code>) בלי לרענן את כל האפליקציה מהשרת.
        </p>
        <p>
          <strong>React Router</strong> מחבר בין כתובת בכתובת הדפדפן לקומפוננטה
          שמוצגת על המסך.
        </p>
      </LearnSection>

      <LearnSection title="2. איך זה בנוי אצלך">
        <LearnCode
          label="עיקרון (מפושט מ-App.tsx)"
          code={`<Routes>
  <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/merchants" element={<MerchantsPage />} />
  <Route path="/wallets/:id" element={<WalletDetailsPage />} />
</Routes>`}
        />
        <ul>
          <li>
            <code>path</code> — איזו כתובת
          </li>
          <li>
            <code>element</code> — איזו קומפוננטה להציג
          </li>
          <li>
            <code>NavLink</code> בסיידבר — ניווט + סימון הדף הפעיל
          </li>
        </ul>
        <LearnCallout variant="info" title="Layouts">
          יש <code>PublicLayout</code> (login) ו-<code>AppLayout</code> (אחרי
          התחברות עם סיידבר). הראוטים מקוננים בתוך ה-layout.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="3. קבצים">
        <ul className="learn-files">
          <FileReference
            path="src/App.tsx"
            description="הגדרת כל ה-Routes"
          />
          <FileReference
            path="src/main.tsx"
            description="BrowserRouter עוטף את האפליקציה"
          />
          <FileReference
            path="src/components/layout/AppSidebar.tsx"
            description="NavLink לכל דף"
          />
          <FileReference
            path="src/components/ProtectedRoute.tsx"
            description="חוסם דפים פרטיים בלי התחברות"
          />
        </ul>
        <DemoLink to="/dashboard" label="נווט בין דפים מהסיידבר" />
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>Router = URL ↔ קומפוננטה</li>
          <li>Routes/Route מגדירים את המיפוי</li>
          <li>Link/NavLink מחליפים ניווט בלי רענון מלא</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default RouterLearnPage;
