import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db"; 
import { user, session, account, verification } from "../database/schema"; 

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
        user,
        session,
        account,
        verification
    }
  }),
  emailAndPassword: {  
    enabled: true
  },
  // We can add Google/GitHub providers here later!
});