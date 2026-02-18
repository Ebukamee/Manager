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
      verification,
    },
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
        type: "string",
      },
    },
    deleteUser: {
      enabled: true,
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
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url, token }, request) => {
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: user.email,
        subject: "Reset your password",
        html: `
  <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; background-color: #ffffff;">
    <div style="text-align: center; margin-bottom: 32px;">
      <h1 style="font-size: 24px; font-weight: 800; color: #0f172a; letter-spacing: -0.025em; margin: 0; text-transform: uppercase;">
        Reset Your Password
      </h1>
      <p style="font-size: 14px; color: #64748b; margin-top: 8px;">
        Follow the link below to secure your account.
      </p>
    </div>
    
    <div style="background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 16px; padding: 32px; text-align: center;">
      <p style="font-size: 14px; line-height: 24px; color: #334155; margin-bottom: 24px;">
        We received a request to change your password. If you didn't make this request, you can safely ignore this email.
      </p>
      
      <a href="${url}" 
         style="display: inline-block; background-color: #0284c7; color: #ffffff; padding: 12px 32px; font-size: 12px; font-weight: 700; text-decoration: none; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.05em; transition: background-color 0.2s;">
        Reset Password
      </a>
      
      <p style="font-size: 11px; color: #94a3b8; margin-top: 24px;">
        This link will expire in 1 hour for security reasons.
      </p>
    </div>

    <div style="text-align: center; margin-top: 32px; border-top: 1px solid #f1f5f9; padding-top: 24px;">
      <p style="font-size: 10px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700;">
        Powered by Manager
      </p>
    </div>
  </div>
`,
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
        html: `
  <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #0f172a;">
    <div style="margin-bottom: 32px; text-align: center;">
      <h1 style="font-size: 20px; font-weight: 800; text-transform: uppercase; tracking-tight; margin: 0;">
        Verify Your Account
      </h1>
      <p style="font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; margin-top: 4px;">
        Analytics Center
      </p>
    </div>

    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 24px; padding: 40px; text-align: center;">
      <p style="font-size: 15px; line-height: 24px; color: #334155; margin-bottom: 32px;">
        Welcome aboard! To start tracking your performance and managing your tasks, please confirm your email address.
      </p>

      <a href="${url}" 
         style="display: inline-block; background-color: #0284c7; color: #ffffff; padding: 14px 40px; font-size: 11px; font-weight: 800; text-decoration: none; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.05em;">
        Verify Email Address
      </a>

      <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
        <p style="font-size: 12px; color: #94a3b8; margin-bottom: 8px;">
          Button not working? Copy and paste this link:
        </p>
        <p style="font-size: 11px; word-break: break-all; color: #0284c7;">
          <a href="${url}" style="color: #0284c7; text-decoration: none;">${url}</a>
        </p>
      </div>
    </div>

    <p style="text-align: center; font-size: 11px; color: #cbd5e1; margin-top: 32px; font-weight: 500;">
      If you didn't create an account, you can ignore this email.
    </p>
  </div>
`,
      });
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await db.insert(schema.container).values([
            {
              userId: user.id,
              name: "Daily Tasks",
              type: "daily",
            },
            {
              userId: user.id,
              name: "Weekly Goals",
              type: "weekly",
            },
            {
              userId: user.id,
              name: "Monthly Targets",
              type: "monthly",
            },
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
    },
  },
});
