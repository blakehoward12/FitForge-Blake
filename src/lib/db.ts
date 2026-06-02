import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

// Fall back to a harmless in-memory database when TURSO_DATABASE_URL is absent.
// Next.js imports this module during build-time page-data collection, where env
// vars may not be present; constructing the client with `undefined` used to throw
// (URL_INVALID) and fail the whole build. The placeholder lets the module import
// cleanly. At runtime (Vercel/serverless) the real env var is set and used.
const url = process.env.TURSO_DATABASE_URL ?? "file::memory:";

const client = createClient({
  url,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

export const db = drizzle(client, { schema });
