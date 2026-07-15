import DemoLink from "../../components/learn/DemoLink";
import FileReference from "../../components/learn/FileReference";
import LearnCallout from "../../components/learn/LearnCallout";
import LearnCode from "../../components/learn/LearnCode";
import LearnSection from "../../components/learn/LearnSection";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";

function UseParamsLearnPage() {
  return (
    <LearnTopicLayout
      slug="use-params"
      objectives={[
        "להבין מהו ראוט דינמי (:id)",
        "לדעת לקרוא את ה-id עם useParams",
        "לעקוב אחרי הזרימה מקישור ברשימה לדף פרטים",
      ]}
    >
      <LearnSection title="1. הרעיון">
        <p>
          לפעמים ה-URL מכיל מזהה משתנה: <code>/wallets/42</code>. אותו דף
          (WalletDetails) מציג ארנק אחר לפי המספר.
        </p>
        <p>
          ב-Router מגדירים: <code>/wallets/:id</code>.  
          בקומפוננטה קוראים: <code>const {"{ id }"} = useParams()</code>.
        </p>
      </LearnSection>

      <LearnSection title="2. איך זה עובד בקוד">
        <LearnCode
          label="App.tsx — הגדרה"
          code={`<Route path="/wallets/:id" element={<WalletDetailsPage />} />`}
        />
        <LearnCode
          label="WalletDetailsPage — קריאה"
          code={`const { id } = useParams();
const walletId = Number(id);
const { wallet, loading, error } = useWalletDetails(walletId);`}
        />
        <LearnCode
          label="WalletRow — איך מגיעים לשם"
          code={`<Link to={\`/wallets/\${wallet.id}\`}>{wallet.id}</Link>`}
        />
        <LearnCallout variant="warn" title="שים לב">
          <code>id</code> מגיע כ-<strong>מחרוזת</strong>. לפני שימוש מספרי —
          ממירים עם <code>Number(id)</code> ובודקים שזה תקין.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="3. קבצים בפרויקט">
        <ul className="learn-files">
          <FileReference path="src/App.tsx" description='path="/wallets/:id"' />
          <FileReference
            path="src/pages/WalletDetailsPage.tsx"
            description="useParams + טעינת פרטי ארנק"
          />
          <FileReference
            path="src/components/WalletRow.tsx"
            description="Link עם id של הארנק"
          />
          <FileReference
            path="src/hooks/useWalletDetails.ts"
            description="שתי queries לפי walletId"
          />
        </ul>
        <DemoLink to="/wallets" label="בחר ארנק מהרשימה וראה את ה-URL משתנה" />
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>
            <code>:id</code> בראוט = חלק דינמי ב-URL
          </li>
          <li>
            <code>useParams()</code> מחזיר את החלקים האלה
          </li>
          <li>מהרשימה מנווטים עם Link שמכיל את המזהה</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default UseParamsLearnPage;
