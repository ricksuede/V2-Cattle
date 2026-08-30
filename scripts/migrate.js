// One-time: load seed.json into the database.
// Run with: DATABASE_URL="postgresql://..." node scripts/migrate.js
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

const root = path.join(__dirname, "..");
const cattle = JSON.parse(fs.readFileSync(path.join(root, "seed.json"), "utf8"));

(async () => {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

  await pool.query(fs.readFileSync(path.join(root, "schema.sql"), "utf8"));

  const { rows } = await pool.query("SELECT data FROM herd_state WHERE id = 1");
  if (rows.length) {
    console.error(`Refusing to overwrite: herd_state already holds ${rows[0].data.length} animals.`);
    console.error("Delete that row first if you really mean to re-seed.");
    await pool.end();
    process.exit(1);
  }

  await pool.query("INSERT INTO herd_state (id, data) VALUES (1, $1)", [JSON.stringify(cattle)]);
  console.log(`Seeded ${cattle.length} animals:`);
  for (const a of cattle) {
    console.log(`  ${a.tag.padEnd(14)} ${a.sex.padEnd(7)} weights=${a.weights.length} vaccinations=${a.vaccinations.length}`);
  }
  await pool.end();
})();
