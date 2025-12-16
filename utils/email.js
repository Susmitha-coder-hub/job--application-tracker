const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendStageChangeEmail(to, jobTitle, previousStage, newStage) {
  try {
    await transporter.sendMail({
      from: '"Job Tracker" <no-reply@jobtracker.com>',
      to,
      subject: `Application update – ${jobTitle}`,
      text: `Your application moved from ${previousStage} to ${newStage}.`,
    });

    console.log("✅ Email captured in Mailtrap");
  } catch (err) {
    console.error("❌ Email error:", err.message);
  }
}

module.exports = sendStageChangeEmail;