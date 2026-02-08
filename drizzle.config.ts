import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './server/database/schema.ts', // Make sure this path matches where your schema is
  out: './server/database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})