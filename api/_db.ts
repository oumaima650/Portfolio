import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL!);

export default sql;

// ── Schema init — appelé une fois au démarrage ─────────────────────────────
export async function initDb() {
  await sql`
    CREATE TABLE IF NOT EXISTS visits (
      id          SERIAL PRIMARY KEY,
      created_at  TIMESTAMPTZ DEFAULT NOW(),
      device      TEXT,
      browser     TEXT,
      os          TEXT,
      country     TEXT,
      city        TEXT,
      referrer    TEXT,
      ref_param   TEXT,
      lang        TEXT,
      session_id  TEXT UNIQUE
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS events (
      id          SERIAL PRIMARY KEY,
      created_at  TIMESTAMPTZ DEFAULT NOW(),
      session_id  TEXT,
      type        TEXT NOT NULL,
      label       TEXT,
      value       TEXT,
      seconds     INTEGER
    )
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_events_type ON events(type)
  `;

  await sql`
    CREATE INDEX IF NOT EXISTS idx_visits_created ON visits(created_at)
  `;
}
