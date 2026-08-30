// GET  -> the herd document
// PUT  -> replace the herd document
// Both require a valid session cookie. The database credential stays server-side.
const { pool, isAuthed } = require("./_lib.js");

module.exports = async function handler(req, res) {
  if (!isAuthed(req)) return res.status(401).json({ error: "Not authenticated" });

  try {
    if (req.method === "GET") {
      const { rows } = await pool.query("SELECT data FROM herd_state WHERE id = 1");
      return res.status(200).json(rows.length ? rows[0].data : []);
    }

    if (req.method === "PUT") {
      const body = req.body;
      if (!Array.isArray(body)) return res.status(400).json({ error: "Expected an array of animals" });

      await pool.query(
        `INSERT INTO herd_state (id, data, updated_at) VALUES (1, $1, now())
         ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
        [JSON.stringify(body)]
      );
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("herd handler failed:", err);
    return res.status(500).json({ error: "Database error" });
  }
};
