import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "../schema/index.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = process.env.DATABASE_URL || "file:" + path.join(process.cwd(), "sqlite.db");
const client = createClient({
  url: dbPath
});

export const db = drizzle(client, { schema });
