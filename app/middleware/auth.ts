
import { authClient } from "~/lib/auth-client"; 

export default defineNuxtRouteMiddleware(async (to) => {
    const { data: session } = await authClient.getSession({
        fetchOptions: {
            headers: useRequestHeaders(['cookie']) 
        }
    });

    // 2. If no session, kick them out
    if (!session) {
        return navigateTo('/login');
    }
});