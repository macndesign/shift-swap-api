-- Domain tables for the shift-swap library entities.
-- id is shared with the Better Auth "user" table (see signup hook in src/lib/auth.ts).

CREATE TABLE IF NOT EXISTS funcionario (
  id TEXT PRIMARY KEY REFERENCES "user" (id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS supervisor (
  id TEXT PRIMARY KEY REFERENCES "user" (id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL
);
