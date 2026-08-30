// Shared helpers for the API routes. CommonJS on purpose: package.json has no
// "type": "module", so .js here is CJS and we avoid changing the Vite build.
const crypto = require("crypto");
const { Pool } = require("pg");

// Reuse the pool across warm invocations. Serverless spins containers up and
// down; without this we'd open a new connection on every request.
const pool =
  globalThis.__v2pool ||
  (globalThis.__v2pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 1,
  }));

const SESSION_HOURS = 12;

// The whole herd is one JSON document. Four animals is not a four-table problem,
// and the app has always read and written them as a unit. If this ever grows
// multiple owners, add an owner_id column and one row per owner.
const SCHEMA_SQL = `
  CREATE TABLE IF NOT EXISTS herd_state (
    id         integer PRIMARY KEY,
    data       jsonb       NOT NULL,
    updated_at timestamptz NOT NULL DEFAULT now()
  );
`;

function sign(expiresAt) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not set");
  return crypto.createHmac("sha256", secret).update(String(expiresAt)).digest("hex");
}

function issueCookie() {
  const expiresAt = Date.now() + SESSION_HOURS * 3600 * 1000;
  const value = `${expiresAt}.${sign(expiresAt)}`;
  return [
    `v2_session=${value}`,
    "HttpOnly",
    "Secure",
    "SameSite=Strict",
    "Path=/",
    `Max-Age=${SESSION_HOURS * 3600}`,
  ].join("; ");
}

function isAuthed(req) {
  const raw = req.headers.cookie || "";
  const match = raw.match(/(?:^|;\s*)v2_session=([^;]+)/);
  if (!match) return false;

  const [expiresAt, mac] = decodeURIComponent(match[1]).split(".");
  if (!expiresAt || !mac) return false;
  if (Date.now() > Number(expiresAt)) return false;

  // timingSafeEqual throws on length mismatch, so compare buffers of equal size.
  const expected = Buffer.from(sign(Number(expiresAt)), "utf8");
  const actual = Buffer.from(mac, "utf8");
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

module.exports = { pool, issueCookie, isAuthed, SCHEMA_SQL };
