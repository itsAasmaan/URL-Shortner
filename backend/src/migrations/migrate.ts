import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import database from "../config/database.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function migrate() {
  try {
    const sqlFile = path.join(__dirname, "database.sql");
    const sql = fs.readFileSync(sqlFile, "utf8");

    await database.query(sql);

    console.log("Migration completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

migrate();
