import { authClient } from "~/lib/auth-client";

export default defineNuxtRouteMiddleware(async (to) => {
    // Get session 
    const { data } = await authClient.getSession({
        fetchOptions: {
            headers: useRequestHeaders(['cookie'])
        }
    });

    // 
    if (!data?.session) {
        return navigateTo('/login');
    }

    const isVerified = data.user.emailVerified;
    const verifyPagePath = '/verify-email'; 


    if (!isVerified && to.path !== verifyPagePath) {
        return navigateTo(verifyPagePath);
    }


    if (isVerified && to.path === verifyPagePath) {
        return navigateTo('/dashboard');
    }
});