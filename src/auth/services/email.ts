// src/auth/services/email.ts
export async function sendAuthEmail({ email, token }: { email: string, token: string }) {
  try {
    // Try Resend first
    await resend.send({
      from: 'Auth <auth@yourdomain.com>',
      to: email,
      subject: 'Verify your account',
      react: <VerificationEmail token={token} />
    })
  } catch (error) {
    // Fallback to SES if Resend fails
    await ses.send({
      Destination: { ToAddresses: [email] },
      Message: { /* ... */ }
    })
  }
}
