import { neon, neonConfig } from "@neondatabase/serverless";
import { env } from "cloudflare:workers";
import { drizzle } from "drizzle-orm/neon-http";
import ws from "ws";

neonConfig.webSocketConstructor = ws;
neonConfig.poolQueryViaFetch = true;

const sql = neon(env.DATABASE_URL || "");
export const db = drizzle(sql);

export * as enums from "./enums";
export * as schema from "./schema";
