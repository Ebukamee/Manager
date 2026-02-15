import { authClient } from "../lib/auth-client";

export const getFormattedDate = (): string => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',  
    day: 'numeric',
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

export const getCategoryClass = (category: string) => {
  switch (category) {
    case 'work': return 'text-sky-600 bg-sky-50 dark:bg-sky-500/10 dark:text-sky-400'
    case 'personal': return 'text-purple-600 bg-purple-50 dark:bg-purple-500/10 dark:text-purple-400'
    case 'health': return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400'
    case 'finance': return 'text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400'
    default: return 'text-slate-600 bg-slate-50 dark:bg-neutral-800'
  }
}

export const getPeriodEndDate = (type: 'weekly' | 'monthly' | 'custom' | 'daily') => {
  const now = new Date();
  
  if (type === 'weekly') {
    // End of the current week (Saturday)
    const lastDay = new Date(now.setDate(now.getDate() - now.getDay() + 6));
    return lastDay.toISOString().split('T')[0];
  }
  
  if (type === 'monthly') {
    // Last day of the current month
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return lastDay.toISOString().split('T')[0];
  }
  
  return null; // For 'custom', we use the actual expiresAt from the DB
}