import ReduxDemo from "../../components/learn/ReduxDemo";
import FileReference from "../../components/learn/FileReference";
import LearnCallout from "../../components/learn/LearnCallout";
import LearnCode from "../../components/learn/LearnCode";
import LearnSection from "../../components/learn/LearnSection";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";

function ReduxLearnPage() {
  return (
    <LearnTopicLayout
      slug="redux"
      objectives={[
        "להבין מהו store גלובלי",
        "להכיר slice, action, dispatch, selector",
        "לדעת מתי Redux ומתי React Query",
      ]}
    >
      <LearnSection title="1. מה זה Redux?">
        <p>
          <strong>Redux</strong> = מחסן state אחד לכל האפליקציה. רוצים לשנות
          משהו? שולחים <code>action</code> דרך <code>dispatch</code>, ה-
          <code>reducer</code> מעדכן את ה-store, וה-UI שתלוי בערך מתעדכן.
        </p>
        <p>
          <strong>Redux Toolkit</strong> = הדרך המודרנית: פחות קוד חוזר, עם{" "}
          <code>createSlice</code> ו-<code>configureStore</code>.
        </p>
      </LearnSection>

      <LearnSection title="2. הזרימה">
        <LearnCode
          label="מסע של לחיצה"
          code={`כפתור +1
  → dispatch(incrementLearnCounter())
  → uiSlice מעדכן learnCounter
  → useAppSelector קורא ערך חדש
  → המסך מציג מספר מעודכן`}
        />
      </LearnSection>

      <LearnSection title="3. הקבצים בפרויקט">
        <ul className="learn-files">
          <FileReference path="src/store/index.ts" description="configureStore — המחסן" />
          <FileReference path="src/store/hooks.ts" description="useAppDispatch / useAppSelector" />
          <FileReference path="src/store/slices/uiSlice.ts" description="state של UI + actions" />
          <FileReference path="src/main.tsx" description="Provider עוטף את האפליקציה" />
          <FileReference
            path="src/components/layout/AppSidebar.tsx"
            description="שימוש אמיתי: sidebarPinned"
          />
        </ul>
        <LearnCallout variant="info" title="מול React Query">
          נתוני שרת (סוחרים, ארנקים) → React Query.  
          UI גלובלי (pin סיידבר, דמו למידה) → Redux.  
          לא מחליפים אחד את השני.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="4. מה זה pin?">
        <p>
          כפתור בסיידבר שקובע אם התפריט נשאר רחב תמיד או מכווץ. שמרנו את זה
          ב-Redux (+ localStorage) כדי שתהיה דוגמה אמיתית ל-state גלובלי — לא רק
          מונה בדף למידה.
        </p>
      </LearnSection>

      <LearnSection title="5. דמו חי">
        <div className="learn-demo-box">
          <ReduxDemo />
        </div>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>store = מחסן מרכזי</li>
          <li>slice = חלק מהמחסן + חוקי עדכון</li>
          <li>dispatch לשליחה, selector לקריאה</li>
          <li>Redux ל-UI; React Query לשרת</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default ReduxLearnPage;
