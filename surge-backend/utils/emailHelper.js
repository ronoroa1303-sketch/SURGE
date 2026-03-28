import nodemailer from 'nodemailer';

const sendEmail = async ({ email, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"SURGE Team" <${process.env.SMTP_USER}>`,
      to: email,
      subject: subject,
      text: text,
      html: html,
    });

    console.log(`Email sent: ${info.messageId}`);
  } catch (error) {
    console.error(`Failed to send email: ${error.message}`);
  }
};

export default sendEmail;
