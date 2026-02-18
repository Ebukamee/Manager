import { Resend } from 'resend';

export const sendRoastEmail = async (email: string, userName: string, roastText: string) => {
  const config = useRuntimeConfig();
  const resend = new Resend(config.resendApiKey);
  
  // Use your app's primary color (fallback to a sleek blue if not found)
  const appColor = config.public?.primaryColor || '#3b82f6'; 

  const formattedRoast = roastText.replace(/\n/g, '<br>');

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: email,
    subject: 'Task Reminder and Performance Review',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #000; color: #fff; margin: 0; padding: 20px; }
            .container { max-width: 550px; margin: 0 auto; border: 1px solid #222; padding: 40px; background-color: #050505; border-radius: 12px; }
            .brand-line { height: 4px; background-color: ${appColor}; width: 60px; border-radius: 2px; margin-bottom: 24px; }
            h1 { font-size: 20px; font-weight: 700; margin: 0 0 8px 0; color: #fff; }
            .status { font-size: 13px; color: ${appColor}; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; margin-bottom: 32px; }
            .roast-content { font-size: 16px; line-height: 1.7; color: #d1d1d1; margin-bottom: 32px; padding: 20px; background: #0f0f0f; border-radius: 8px; border: 1px solid #1a1a1a; }
            .btn { display: inline-block; background-color: ${appColor}; color: #fff; padding: 12px 24px; text-decoration: none; font-weight: 600; border-radius: 6px; font-size: 14px; }
            .footer { margin-top: 40px; font-size: 12px; color: #444; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="brand-line"></div>
            <h1>Performance Review: ${userName}</h1>
            
            <div class="roast-content">
              ${formattedRoast}
            </div>

            <a href="https://" class="btn">View Tasks</a>
            
            <p class="footer">
              This is an automated review. Improve your performance to stop these emails.
            </p>
          </div>
        </body>
      </html>
    `,
  });
};