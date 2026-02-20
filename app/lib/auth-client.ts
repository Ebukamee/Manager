
import { createAuthClient } from "better-auth/vue"


export const authClient = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL || 'https://manager-sandy-nine.vercel.app'
})