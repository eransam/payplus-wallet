import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import CreateMerchantFormManual from "../../components/learn/CreateMerchantFormManual";
import DemoLink from "../../components/learn/DemoLink";
import FileReference from "../../components/learn/FileReference";
import LearnCallout from "../../components/learn/LearnCallout";
import LearnCode from "../../components/learn/LearnCode";
import LearnSection from "../../components/learn/LearnSection";
import LearnTopicLayout from "../../components/learn/LearnTopicLayout";

function ReactHookFormLearnPage() {
  return (
    <LearnTopicLayout
      slug="react-hook-form"
      objectives={[
        "להבין מה כל ספרייה עושה: RHF מול zod",
        "לראות את התבנית register + handleSubmit + resolver",
        "להשוות לטופס useState ידני בדמו",
      ]}
    >
      <LearnSection title="1. שתי ספריות — שני תפקידים">
        <ul>
          <li>
            <strong>react-hook-form</strong> — מנהל את הטופס: שדות, שליחה,
            שגיאות, מצב submitting. פחות <code>useState</code> לכל שדה.
          </li>
          <li>
            <strong>zod</strong> — מגדיר חוקי validation במקום אחד (סכמה).
            מתחבר לטופס דרך <code>zodResolver</code>.
          </li>
        </ul>
        <LearnCallout variant="info" title="שניהם חיצוניים">
          לא חלק מ-React עצמו — מתקינים עם npm.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="2. התבנית">
        <LearnCode
          label="סכמה + טופס (מפושט)"
          code={`const schema = z.object({
  name: z.string().min(1, "שדה חובה"),
});

const { register, handleSubmit, formState: { errors, isSubmitting } } =
  useForm({ resolver: zodResolver(schema) });

<form onSubmit={handleSubmit(onSubmit)}>
  <input {...register("name")} />
  {errors.name && <p>{errors.name.message}</p>}
  <button disabled={isSubmitting}>שמור</button>
</form>`}
        />
      </LearnSection>

      <LearnSection title="3. השוואה חיה">
        <p className="mb-3">
          משמאל: גרסת <strong>useState ידנית</strong> (למידה). בדף הסוחרים —
          אותה מטרה עם RHF + zod.
        </p>
        <Row className="g-3">
          <Col md={6}>
            <div className="learn-demo-box h-100">
              <strong className="d-block mb-2">דמו — useState ידני</strong>
              <CreateMerchantFormManual />
            </div>
          </Col>
          <Col md={6}>
            <div className="learn-demo-box h-100">
              <strong className="d-block mb-2">באפליקציה הראשית</strong>
              <p className="text-muted mb-0">
                בדף הסוחרים הטופס רץ עם react-hook-form + zod — אותה חוויה
                למשתמש, פחות boilerplate ו-validation מסודר בקובץ schema.
              </p>
              <DemoLink to="/merchants" label="פתח טופס סוחרים" />
            </div>
          </Col>
        </Row>
      </LearnSection>

      <LearnSection title="4. קבצים">
        <ul className="learn-files">
          <FileReference path="src/schemas/merchantSchema.ts" description="חוקי zod" />
          <FileReference path="src/components/CreateMerchantForm.tsx" description="RHF באפליקציה" />
          <FileReference
            path="src/components/learn/CreateMerchantFormManual.tsx"
            description="useState — להשוואה"
          />
        </ul>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>RHF = ניהול טופס</li>
          <li>zod = חוקי validation</li>
          <li>zodResolver מחבר ביניהם</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default ReactHookFormLearnPage;
