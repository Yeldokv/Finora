// server/db/client.ts
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

// Create or connect to SQLite database file
const sqlite = new Database("finora.db");

// Initialize Drizzle ORM with schema
export const db = drizzle(sqlite, { schema });

// Optional: create tables if they don’t exist yet (raw SQL fallback)
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT,
    address TEXT
  );
`);
