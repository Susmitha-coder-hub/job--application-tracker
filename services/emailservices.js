// services/emailservices.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error("❌ SMTP configuration error:", error);
  } else {
    console.log("✅ SMTP server is ready to send emails");
  }
});

const sendStageChangeEmail = async (application) => {
  try {
    console.log("📨 Sending email to:", application.candidateEmail);

    await transporter.sendMail({
      from: '"Job Tracker" <no-reply@jobtracker.com>',
      to: application.candidateEmail, // candidate's email should be stored in JobApplication model
      subject: `Application update – ${application.title}`,
      text: `Hello ${application.candidateName},\n\nYour application moved from ${application.previousStage || application.stage} to ${application.stage}.`,
    });

    console.log("✅ Email sent successfully");
  } catch (err) {
    console.error("❌ Email error:", err.message);
  }
};

module.exports = { sendStageChangeEmail };
