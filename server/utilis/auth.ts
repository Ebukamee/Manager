import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db"; 
import { Resend } from "resend"; 
import { user, session, account, verification } from "../database/schema";


const resend = new Resend(process.env.RESEND_API_KEY);
type User = typeof user.$inferSelect;

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
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: async ({user, url, token}, request) => {
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      });
    },
    onPasswordReset: async ({ user }, request) => {
      // your logic here
      console.log(`Password for user ${user.email} has been reset.`);
    },

  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,

    sendVerificationEmail: async ({ user, url, token }, request) => {
        console.log("Sending Verification Email to:", user.email);
        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: user.email,
            subject: "Verify your email address",
            html: `<p>Click the link to verify your email: <a href="${url}">${url}</a></p>`,
        });
    }
},


  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      prompt: "select_account", 
    }
  }
});