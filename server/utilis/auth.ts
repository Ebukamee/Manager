import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db"; 
import { Resend } from "resend"; 
import { user, session, account, verification } from "../database/schema";
import * as schema from "~~/server/database/schema";


const resend = new Resend(process.env?.RESEND_API_KEY);


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
  user: {
    additionalFields: {
      jobTitle: {
        type: "string",
      },
      bio: {
        type: "string",
      },
      roastLevel: {
        type:'string',

      }
    },
    deleteUser: {
      enabled: true,
      // This is the key part: it replaces the password requirement with an email flow
      sendDeleteAccountVerification: async ({ user, url }) => {
        await resend.emails.send({
          from: "onboarding@resend.dev",
          to: user.email,
          subject: "Confirm Account Deletion",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
              <h2>Delete Account Request</h2>
              <p>Hello ${user.name},</p>
              <p>We received a request to permanently delete your account. This action cannot be undone.</p>
              <p>If you intended to delete your account, please click the button below:</p>
              <a href="${url}" style="background-color: #e11d48; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; margin-top: 20px;">
                Permanently Delete My Account
              </a>
              <p style="margin-top: 30px; font-size: 12px; color: #64748b;">
                If you did not request this, you can safely ignore this email.
              </p>
            </div>
          `,
        });
      }
    }
    
  },
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
databaseHooks: {
        user: {
            create: {
                after: async (user) => {
                    await db.insert(schema.container).values([
                        {
                            userId: user.id,
                            name: 'Daily Tasks',
                            type: 'daily',
                        },
                        {
                            userId: user.id,
                            name: 'Weekly Goals',
                            type: 'weekly',
                        },
                        {
                            userId: user.id,
                            name: 'Monthly Targets',
                            type: 'monthly',
                        }
                    ]);
                },
            },
            
        },
    },


  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      prompt: "select_account", 
    }
  }
});