import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "../schema/index.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const client = createClient({
  url: "file:" + path.join(__dirname, "..", "..", "sqlite.db")
});

export const db = drizzle(client, { schema });
