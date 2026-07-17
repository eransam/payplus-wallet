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
        "להבין למה צריך מחסן state גלובלי (לא רק useState בדף אחד)",
        "להכיר store, slice, dispatch בפשטות",
        "לדעת מה Redux עושה אצלנו (סיידבר) ומה לא (סוחרים)",
      ]}
    >
      <LearnSection title="1. מה רוצים שתבין?">
        <p>
          לפעמים יש מידע שצריך להיות זמין ב<strong>כל האפליקציה</strong>, לא רק
          בקומפוננטה אחת.
        </p>
        <p>
          אצלנו: האם הסיידבר &quot;נעוץ&quot; (מורחב קבוע)?  
          גם ה-Topbar וגם ה-Sidebar צריכים לדעת את זה. אם שמים רק ב-
          <code>useState</code> בתוך הסיידבר — קומפוננטות אחרות לא רואות.
        </p>
        <p>
          <strong>Redux</strong> = מחסן מרכזי אחד למידע כזה. כל מסך יכול לקרוא
          ולשנות.
        </p>
      </LearnSection>

      <LearnSection title="2. אנלוגיה">
        <LearnCallout variant="info" title="לוח מודעות במשרד">
          <ul>
            <li>
              <strong>Store</strong> = לוח המודעות באמצע המשרד
            </li>
            <li>
              כותבים עליו: &quot;סיידבר נעוץ = כן&quot;
            </li>
            <li>
              כל עובד (קומפוננטה) יכול לקרוא מהלוח
            </li>
            <li>
              כדי לשנות — שולחים הודעה (&quot;הפוך את ה-pin&quot;) והלוח
              מתעדכן
            </li>
          </ul>
        </LearnCallout>
        <p>
          <strong>Redux Toolkit</strong> = הגרסה המודרנית/נוחה של Redux — פחות
          קוד מסורבל.
        </p>
      </LearnSection>

      <LearnSection title="3. שלוש מילים שחשוב לזכור">
        <LearnCode
          label="מילון קצר"
          code={`store     = המחסן / הלוח (כל ה-state הגלובלי)
slice     = מגירה אחת במחסן (אצלנו: ui — סיידבר, מונה למידה...)
dispatch  = "שלח פקודה" — לשנות משהו במחסן
selector  = "קרא מהמחסן" — למשל state.ui.sidebarPinned`}
        />
        <LearnCode
          label="בקומפוננטה"
          code={`// לקרוא:
const pinned = useAppSelector((state) => state.ui.sidebarPinned);

// לשנות:
const dispatch = useAppDispatch();
dispatch(toggleSidebarPinned());`}
        />
      </LearnSection>

      <LearnSection title="4. הסיפור — לחיצה על Pin">
        <LearnCode
          label="צעד אחר צעד"
          code={`1. לוחצים על כפתור ה-pin בסיידבר
2. הקוד עושה: dispatch(toggleSidebarPinned())
3. Redux מעדכן במחסן: sidebarPinned = true/false
4. כל מי שקורא את הערך (סיידבר וכו') מתעדכן אוטומטית
5. אצלנו גם נשמר ב-localStorage — כדי שיזכור אחרי רענון`}
        />
      </LearnSection>

      <LearnSection title="5. Redux מול React Query — חשוב מאוד">
        <LearnCode
          label="חלוקה"
          code={`React Query  →  נתונים מהשרת
                סוחרים, ארנקים, עסקאות

Redux        →  מצב של המסך / האפליקציה
                סיידבר נעוץ, מונה בדמו למידה...`}
        />
        <p>
          לא שמים רשימת סוחרים ב-Redux אצלנו — לזה יש React Query.  
          לא שמים pin של סיידבר ב-React Query — זה לא מהשרת.
        </p>
      </LearnSection>

      <LearnSection title="6. Redux מול useReducer">
        <p>
          אותו רעיון (פקודה → עדכון state), אבל:
        </p>
        <ul>
          <li>
            <code>useReducer</code> = בתוך קומפוננטה אחת
          </li>
          <li>
            <strong>Redux</strong> = לכל האפליקציה
          </li>
        </ul>
      </LearnSection>

      <LearnSection title="7. דמו חי">
        <p>
          הכפתורים למטה משנים ערכים ב-store. אפשר גם לפתוח Redux DevTools
          ולראות את השינוי.
        </p>
        <div className="learn-demo-box">
          <ReduxDemo />
        </div>
      </LearnSection>

      <LearnSection title="8. איפה בפרויקט">
        <ul className="learn-files">
          <FileReference
            path="fronted/payplus-wallet/src/store/index.ts"
            description="יצירת ה-store"
          />
          <FileReference
            path="fronted/payplus-wallet/src/store/slices/uiSlice.ts"
            description="המגירה ui + הפקודות (toggle pin...)"
          />
          <FileReference
            path="fronted/payplus-wallet/src/main.tsx"
            description="Provider — מחבר את Redux לכל האפליקציה"
          />
          <FileReference
            path="fronted/payplus-wallet/src/components/layout/AppSidebar.tsx"
            description="שימוש אמיתי ב-sidebarPinned"
          />
        </ul>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>Redux = מחסן state לכל האפליקציה</li>
          <li>
            <code>dispatch</code> = לשנות · selector = לקרוא
          </li>
          <li>אצלנו: בעיקר UI (pin סיידבר)</li>
          <li>נתוני שרת → React Query, לא Redux</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default ReduxLearnPage;
