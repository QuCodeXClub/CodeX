import nodemailer from "nodemailer";
import { ApiError } from "./ApiError.js";

/**
 * Utility to send emails using nodemailer
 * @param {Object} options - Email options
 * @param {string} options.email - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.message - Email message body (html)
 * @param {string} options.textMessage - Email message body (plain text)
 * @param {string|string[]} options.bcc - Blind carbon copy recipients
 */
const sendEmail = async (options) => {
  try {
    // 1. Create a transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT == 465, // Use SSL/TLS for port 465
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // 2. Define the email options
    const mailOptions = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: options.email,
      bcc: options.bcc,
      replyTo: process.env.FROM_EMAIL,
      subject: options.subject,
      html: options.message,
      text: options.textMessage,
    };

    // 3. Actually send the email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email: ", error);
    throw new ApiError(500, "Error sending email");
  }
};

export { sendEmail };
