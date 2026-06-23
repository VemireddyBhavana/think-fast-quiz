import nodemailer from 'nodemailer';

// Create a generic transporter using Ethereal Email (for development) or standard SMTP
// In production, configure environment variables: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
const createTransporter = async () => {
  if (process.env.NODE_ENV === 'production' && process.env.SMTP_HOST) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // Fallback to testing email (Ethereal) if no production config is found
  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
};

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = await createTransporter();
    
    const info = await transporter.sendMail({
      from: '"ThinkFast Quiz" <noreply@thinkfastquiz.com>',
      to,
      subject,
      html,
    });

    console.log('Message sent: %s', info.messageId);
    
    // Preview only available when sending through an Ethereal account
    if (process.env.NODE_ENV !== 'production' || !process.env.SMTP_HOST) {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};
