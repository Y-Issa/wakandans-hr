import nodemailer from 'nodemailer';
import { markJobAsCompleted } from './helpers';

// Configure the transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'maildev',
  port: parseInt(process.env.SMTP_PORT || '1025', 10),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || undefined,
    pass: process.env.SMTP_PASSWORD || undefined,
  },
});

// Function to send a login email
export const sendLoginEmail = async (to: string, token: string, id: number) => {
  const loginLink = `http://localhost:3000/login/${token}`;
  const subject = 'Login to Wakandans HR';

  // HTML Email Body with a Button
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
  <h2 style="color: #4CAF50; text-align: center;">Welcome to Wakandans HR!</h2>
  <p style="font-size: 16px;">Hello,</p>
  <p style="font-size: 16px;">We received a request to log in to your account. If this was you, please click the button below to securely access your account:</p>
  <div style="text-align: center; margin: 30px 0;">
    <a href="${loginLink}" style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
      Log In to Your Account
    </a>
  </div>
  <p style="font-size: 16px;">If you didn't request this, you can safely ignore this email. No action is required on your part.</p>
  <p style="font-size: 16px; margin-top: 20px;">Best regards,<br><strong>Wakandans HR Team</strong></p>
  <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
  <footer style="font-size: 14px; text-align: center; color: #888;">
    <p>You're receiving this email because your email address is registered with Wakandans HR.</p>
    <p>If you have any questions, feel free to contact us at <a href="mailto:support@wakandanshr.com" style="color: #4CAF50; text-decoration: none;">support@wakandanshr.com</a>.</p>
  </footer>
</div>


  `;

  try {
    const info = await transporter.sendMail({
      from: '"Wakandans HR" <no-reply@wakandans-hr.com>', // Sender address
      to, // Recipient email
      subject, // Email subject
      text: `Click on the following link to log in: ${loginLink}`, // Plain text fallback
      html, // HTML email body
    });
    console.log(`Email sent: ${info.messageId}`);
    await markJobAsCompleted(id); // Mark the job as completed
  } catch (error) {
    console.error('Error sending login email:', error);
    throw error;
  }
};
