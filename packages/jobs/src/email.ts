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
    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
      <h2 style="color: #4CAF50;">Welcome to Wakandans HR!</h2>
      <p>We received a request to log in to your account. If this was you, please click the button below:</p>
      <a href="${loginLink}" style="display: inline-block; margin: 20px 0; padding: 10px 20px; background-color: #4CAF50; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold;">
        Log In to Your Account
      </a>
      <p>If you didn’t request this, you can safely ignore this email.</p>
      <p>Best regards,<br>Wakandans HR Team</p>
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
