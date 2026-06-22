import * as fs from "fs";
import * as path from "path";
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config({ path: path.join(__dirname, "../.env") });

const scriptsDir = path.join(__dirname, "../database_scripts");

async function run() {
  const databaseUrl =
    process.env.DATABASE_URL ||
    "postgresql://payplus:payplus@localhost:5432/payplus_wallet";

  const files = fs
    .readdirSync(scriptsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  console.log("Running SQL scripts:", files);

  const pool = new Pool({ connectionString: databaseUrl });

  for (const file of files) {
    const content = fs.readFileSync(path.join(scriptsDir, file), "utf8");
    console.log(`\n--- ${file} ---`);
    try {
      await pool.query(content);
      console.log(`OK: ${file}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`Error in ${file}:`, message);
      throw err;
    }
  }

  const tables = await pool.query(
    `SELECT table_name FROM information_schema.tables
     WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
     ORDER BY table_name`
  );
  console.log("\nTables:", tables.rows.map((r) => r.table_name).join(", "));

  await pool.end();
  console.log("\nDone!");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
