import { authClient } from "../lib/auth-client";

export const getFormattedDate = (): string => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long', // "Thursday"
    month: 'short',  // "Jan"
    day: 'numeric',  // "18"
  }).format(new Date())
}

export const getGreeting = (): string => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 18) return 'Good Afternoon'
  return 'Good Evening'
}

export const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard" 
    });
};