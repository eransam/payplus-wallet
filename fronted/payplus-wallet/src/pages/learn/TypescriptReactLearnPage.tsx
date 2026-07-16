import LearnCallout from "../../components/learn/LearnCallout";
import LearnCode from "../../components/learn/LearnCode";
import LearnSection from "../../components/learn/LearnSection";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";
import FileReference from "../../components/learn/FileReference";

function TypescriptReactLearnPage() {
  return (
    <LearnTopicLayout
      slug="typescript-react"
      objectives={[
        "להקליד props של קומפוננטה",
        "להכיר טיפוסי useState / events",
        "להבין children, FC, ו-generics בסיסי ב-hooks",
        "לדעת לקרוא טיפוסים בפרויקט שלנו",
      ]}
    >
      <LearnSection title="1. למה TypeScript ב-React">
        <p>
          TS תופס טעויות לפני ריצה: prop חסר, <code>merchant</code> לא קיים,{" "}
          <code>onClick</code> עם חתימה לא נכונה. בפרויקט שלנו כמעט הכל ב-
          <code>.tsx</code>.
        </p>
      </LearnSection>

      <LearnSection title="2. Props">
        <LearnCode
          label="טיפוס לקומפוננטה"
          code={`type MerchantRowProps = {
  merchant: Merchant;
  onDelete: (id: number) => void;
};

function MerchantRow({ merchant, onDelete }: MerchantRowProps) {
  return <tr>...</tr>;
}`}
        />
        <LearnCallout variant="tip" title="העדפה מודרנית">
          מעדיפים <code>function Comp(props: Props)</code> על פני{" "}
          <code>React.FC&lt;Props&gt;</code> (פחות קסמים סביב children).
        </LearnCallout>
      </LearnSection>

      <LearnSection title="3. useState עם טיפוס">
        <LearnCode
          label="כש-TS לא מסיק לבד"
          code={`const [merchant, setMerchant] = useState<Merchant | null>(null);
const [items, setItems] = useState<string[]>([]);`}
        />
      </LearnSection>

      <LearnSection title="4. Events">
        <LearnCode
          label="שינויי קלט"
          code={`function onChange(e: React.ChangeEvent<HTMLInputElement>) {
  setName(e.target.value);
}

function onSubmit(e: React.FormEvent) {
  e.preventDefault();
}`}
        />
      </LearnSection>

      <LearnSection title="5. children">
        <LearnCode
          label="עטיפה"
          code={`type BoxProps = {
  title: string;
  children: React.ReactNode;
};

function Box({ title, children }: BoxProps) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
}`}
        />
      </LearnSection>

      <LearnSection title="6. Generics ב-hooks / API">
        <LearnCode
          label="כמו אצלנו ב-api.ts"
          code={`async function request<T>(path: string): Promise<T> {
  const res = await fetch(...);
  return res.json() as Promise<T>;
}

const merchants = await request<MerchantsResponse>("/merchants");`}
        />
      </LearnSection>

      <LearnSection title="7. טיפוסים בפרויקט">
        <ul className="learn-files">
          <FileReference
            path="fronted/payplus-wallet/src/models/types.ts"
            description="Merchant, Wallet, Transaction..."
          />
          <FileReference
            path="fronted/payplus-wallet/src/services/api.ts"
            description="request generic + ApiError"
          />
          <FileReference
            path="fronted/payplus-wallet/src/store/index.ts"
            description="RootState, AppDispatch"
          />
          <FileReference
            path="fronted/payplus-wallet/src/store/hooks.ts"
            description="useAppSelector / useAppDispatch מטיפוסים"
          />
        </ul>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>Props = type / interface מפורש</li>
          <li>
            <code>useState&lt;T&gt;</code> כשצריך · Events מ-
            <code>React.*Event</code>
          </li>
          <li>
            <code>ReactNode</code> ל-children · generics ל-API
          </li>
          <li>מודלים ב-<code>models/types.ts</code></li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default TypescriptReactLearnPage;
