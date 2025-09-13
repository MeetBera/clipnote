// Back-End/utils/emailTransporter.js
import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,   // your Gmail
    pass: process.env.EMAIL_PASS,   // your App Password (not your normal Gmail password!)
  },
});

export default transporter;
