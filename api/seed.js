// One-time migration, run from the browser so the database credential never has
// to leave the Vercel dashboard. Guarded twice: a valid session is required, and
// it refuses to touch a table that already holds records.
//
// seed.json is require()'d rather than read with fs so Vercel's dependency
// tracer bundles it into the deployed function.
const { pool, isAuthed, SCHEMA_SQL } = require("./_lib.js");
const cattle = require("../seed.json");

module.exports = async function handler(req, res) {
  if (!isAuthed(req)) return res.status(401).json({ error: "Not authenticated" });

  try {
    await pool.query(SCHEMA_SQL);

    const { rows } = await pool.query("SELECT data FROM herd_state WHERE id = 1");
    if (rows.length) {
      return res.status(409).json({
        error: "Already seeded",
        detail: `The database already holds ${rows[0].data.length} animals. Nothing was changed.`,
      });
    }

    await pool.query("INSERT INTO herd_state (id, data) VALUES (1, $1)", [JSON.stringify(cattle)]);
    return res.status(200).json({
      ok: true,
      seeded: cattle.length,
      animals: cattle.map(a => `${a.tag} (${a.sex}) — ${a.weights.length} weights, ${a.vaccinations.length} vaccinations`),
    });
  } catch (err) {
    console.error("seed failed:", err);
    return res.status(500).json({ error: "Database error", detail: String(err.message || err) });
  }
};
