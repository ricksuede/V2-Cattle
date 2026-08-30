-- The whole herd is one JSON document. There are four animals and the app has
-- always read and written them as a unit, so a single row is the right size for
-- this. If the app ever grows multiple owners, add an owner_id column and one
-- row per owner; the document itself does not need to change.
CREATE TABLE IF NOT EXISTS herd_state (
  id         integer PRIMARY KEY,
  data       jsonb       NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
