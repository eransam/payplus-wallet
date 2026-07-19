import { Link } from "react-router-dom";
import LearnCallout from "../../../components/learn/LearnCallout";
import LearnCode from "../../../components/learn/LearnCode";
import LearnSection from "../../../components/learn/LearnSection";
import LearnTopicLayout from "../../../components/learn/LearnTopicLayout";

function MongoNodeLearnPage() {
  return (
    <LearnTopicLayout
      slug="mongo-node"
      objectives={[
        "להתחבר למונגו מ-Node עם ה-driver הרשמי",
        "להבין מה Mongoose מוסיף — סכמות, ולידציה, מודלים",
        "לבנות repository שמדבר עם מונגו — באותה ארכיטקטורת שכבות שלנו",
        "לדעת מתי driver ומתי Mongoose",
      ]}
    >
      <LearnSection title="1. שתי דרכים לדבר עם מונגו מ-Node">
        <ul>
          <li>
            <strong>ה-driver הרשמי (חבילת mongodb)</strong> — גישה ישירה, בדיוק
            כמו הפקודות שלמדנו ב-shell. המקבילה ל-<code>pg</code> שאנחנו
            משתמשים בו מול Postgres.
          </li>
          <li>
            <strong>Mongoose</strong> — ספרייה מעל ה-driver שמוסיפה{" "}
            <strong>סכמות, ולידציה ומודלים</strong>. המקבילה הרעיונית ל-ORM.
            הפופולרית ביותר בתעשייה לפרויקטי Express.
          </li>
        </ul>
        <LearnCode
          label="התקנה"
          code={`npm install mongodb     # ה-driver הרשמי
# או
npm install mongoose    # כולל את ה-driver בפנים`}
        />
      </LearnSection>

      <LearnSection title="2. ה-driver הרשמי — חיבור ושימוש">
        <LearnCode
          label="mongo-dal.ts — singleton, בדיוק כמו ה-Pool של Postgres אצלנו"
          code={`import { MongoClient, type Db } from "mongodb";

let db: Db | null = null;

export async function getDb(): Promise<Db> {
  if (db) return db;
  const client = new MongoClient(
    process.env.MONGO_URL || "mongodb://localhost:27017",
  );
  await client.connect();
  db = client.db("payplus_learn");
  return db;
}`}
        />
        <LearnCode
          label="שימוש — אותן פקודות שלמדנו ב-shell, רק עם await"
          code={`const db = await getDb();
const wallets = db.collection("wallets");

await wallets.insertOne({ owner: "דנה", balance: 500 });

const rich = await wallets
  .find({ balance: { $gt: 1000 } })
  .sort({ balance: -1 })
  .toArray();               // cursor → מערך

await wallets.updateOne({ owner: "דנה" }, { $inc: { balance: 100 } });`}
        />
        <LearnCallout variant="warn" title="חיבור אחד לתהליך — שוב">
          כמו עם Postgres Pool ועם Redis: פותחים <strong>client אחד</strong>{" "}
          כשהאפליקציה עולה, לא חיבור חדש לכל בקשה. ה-MongoClient מנהל pool של
          חיבורים בעצמו מאחורי הקלעים.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="3. Mongoose — סכמה, מודל, ולידציה">
        <p>
          במונגו אין סכמה כפויה ברמת המסד — Mongoose מחזיר את הסדר{" "}
          <strong>ברמת הקוד</strong>. מגדירים פעם אחת איך מסמך אמור להיראות,
          ומקבלים ולידציה, ערכי ברירת מחדל וטיפוסים:
        </p>
        <LearnCode
          label="wallet-model.ts — סכמה ומודל"
          code={`import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    owner:    { type: String, required: true, trim: true },
    balance:  { type: Number, required: true, min: 0, default: 0 },
    currency: { type: String, enum: ["ILS", "USD", "EUR"], default: "ILS" },
    status:   { type: String, enum: ["active", "frozen"], default: "active" },
    tags:     [String],
  },
  { timestamps: true },  // מוסיף createdAt + updatedAt אוטומטית
);

export const Wallet = mongoose.model("Wallet", walletSchema);
// ייווצר collection בשם "wallets" (רבים, אותיות קטנות) אוטומטית`}
        />
        <LearnCode
          label="חיבור ושימוש במודל"
          code={`import mongoose from "mongoose";
import { Wallet } from "./wallet-model";

await mongoose.connect(process.env.MONGO_URL!);

// יצירה — עם ולידציה אוטומטית לפי הסכמה
const wallet = await Wallet.create({ owner: "דנה", balance: 500 });

// balance שלילי? ייזרק ValidationError עוד לפני שמגיעים למסד
await Wallet.create({ owner: "באג", balance: -50 }); // ❌ שגיאה

// שאילתות — אותם פילטרים שכבר למדנו
const active = await Wallet.find({ status: "active" }).sort({ balance: -1 });
const dana = await Wallet.findOne({ owner: "דנה" });
await Wallet.updateOne({ owner: "דנה" }, { $inc: { balance: 100 } });`}
        />
        <LearnCallout variant="tip" title="driver או Mongoose — מה לבחור?">
          <strong>Mongoose</strong> — כשבונים אפליקציה עם ישויות מוגדרות
          (משתמשים, הזמנות, ארנקים) ורוצים ולידציה וסדר. זו ברירת המחדל ברוב
          הפרויקטים. <strong>ה-driver הישיר</strong> — לסקריפטים, כלים פנימיים,
          או כשצריך שליטה מלאה וביצועים בלי שכבה באמצע.
        </LearnCallout>
      </LearnSection>

      <LearnSection title="4. איך זה משתלב בארכיטקטורת השכבות שלנו">
        <p>
          זוכרים את המבנה controllers → logic → dal מהבקאנד שלנו? מונגו נכנס
          בדיוק לאותו מקום שבו נמצא היום Postgres — בשכבת ה-DAL. שאר השכבות לא
          יודעות ולא צריכות לדעת איזה מסד יש מתחת:
        </p>
        <LearnCode
          label="wallets-repository.ts — הלוגיקה מעל לא משתנה"
          code={`import { Wallet } from "../models/wallet-model";

export const walletsRepository = {
  async findById(id: string) {
    return Wallet.findById(id);
  },

  async deposit(id: string, amount: number) {
    return Wallet.findByIdAndUpdate(
      id,
      { $inc: { balance: amount } },
      { new: true },   // להחזיר את המסמך אחרי העדכון
    );
  },

  async listActive() {
    return Wallet.find({ status: "active" }).sort({ createdAt: -1 });
  },
};`}
        />
        <p className="mt-2 mb-0">
          עכשיו השאלה הגדולה באמת של מונגו — איך מארגנים את הנתונים:{" "}
          <Link to="/learn/mongo-schema-design">
            עיצוב סכמה: Embed מול Reference
          </Link>
          .
        </p>
      </LearnSection>

      <LearnSection title="סיכום למחברת" variant="notebook">
        <ul>
          <li>שתי דרכים: driver רשמי (mongodb) או Mongoose (סכמות + ולידציה)</li>
          <li>client אחד לכל התהליך — כמו Pool של Postgres</li>
          <li>Mongoose: Schema מגדירה מבנה, model נותן API — Wallet.find וכו'</li>
          <li>ולידציה (required, min, enum) רצה בקוד לפני המסד</li>
          <li>timestamps: true — createdAt/updatedAt בחינם</li>
          <li>מונגו מתחבר בשכבת DAL — שאר הארכיטקטורה לא משתנה</li>
        </ul>
      </LearnSection>
    </LearnTopicLayout>
  );
}

export default MongoNodeLearnPage;
