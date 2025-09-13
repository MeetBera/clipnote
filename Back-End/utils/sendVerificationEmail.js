// Back-End/utils/sendVerificationEmail.js
import transporter from "./emailTransporter.js";

export const sendVerificationEmail = async (email, token) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify?token=${token}`;

  await transporter.sendMail({
    from: `"Video Summarizer" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify your email",
    html: `
      <p>Welcome to Video Summarizer!</p>
      <p>Please click the link below to verify your email address:</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
      <p>If you did not sign up, you can safely ignore this email.</p>
    `,
  });
};
