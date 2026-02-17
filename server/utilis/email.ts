import { Resend } from 'resend';

export const sendRoastEmail = async (email: string, roastText: string) => {
  const config = useRuntimeConfig();
  const resend = new Resend(config.resendApiKey);

  return await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Your Task Update',
    text: roastText,
  });
};