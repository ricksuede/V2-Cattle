// POST { password } -> sets an HttpOnly session cookie.
// The password lives in a Vercel env var, so it is never shipped to the browser.
const { issueCookie } = require("./_lib.js");

module.exports = function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const expected = process.env.APP_PASSWORD;
  if (!expected) return res.status(500).json({ error: "Server is not configured" });

  const supplied = (req.body && req.body.password) || "";
  if (supplied !== expected) return res.status(401).json({ error: "Incorrect password" });

  res.setHeader("Set-Cookie", issueCookie());
  return res.status(200).json({ ok: true });
};
