
import { authClient } from "~/lib/auth-client"; 


interface UserWithProfile {
    id: string;
    email: string;
    emailVerified: boolean;
    name: string;
    image?: string | null;
    createdAt: Date;
    updatedAt: Date;
    jobTitle?: string | null;
    bio?: string | null;
}

export default defineNuxtRouteMiddleware(async (to) => {
    const { data: session } = await authClient.getSession({
        fetchOptions: {
            headers: useRequestHeaders(['cookie']) 
        }
    });

    const user = session?.user as UserWithProfile;
    if (!session) {
        return navigateTo('/login');
    }

    if (!user.jobTitle || !user.bio) {
        if (to.path === '/add-bio') {
            return; 
        }
        return navigateTo('/add-bio');
    }
      if (user.jobTitle && user.bio) {
        if (to.path === '/add-bio') {
            return navigateTo('/dashboard');
        }
    }
});