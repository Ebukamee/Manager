import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from "../database/schema";

// This grabs the password string from your .env file
const client = postgres(process.env.DATABASE_URL!);

// This exports the "db" tool that we use everywhere
export const db = drizzle(client, { schema });