// Import the necessary modules
import { Resend } from '@resend/sdk';
import { SES } from 'aws-sdk';

// Initialize Resend and SES
const resend = new Resend(process.env.RESEND_API_KEY);
const ses = new SES();

export async function sendAuthEmail({ email, token }: { email: string, token: string }) {
  try {
    // Try Resend first
    await resend.send({
      from: 'Auth <auth@yourdomain.com>',
      to: email,
      subject: 'Verify your account',
      react: <VerificationEmail token={token} />
    });
  } catch (error) {
    // Fallback to SES if Resend fails
    await ses.sendEmail({
      Destination: { ToAddresses: [email] },
      Message: { 
        Body: {
          Html: {
            Data: `Please verify your account using this token: ${token}`
          }
        },
        Subject: { Data: 'Verify your account' }
      },
      Source: 'Auth <auth@yourdomain.com>'
    }).promise();
  }
}
