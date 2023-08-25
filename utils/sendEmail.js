const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  console.log("options", options);
  const transporter = nodemailer.createTransport({
    // host: process.env.SMTP_HOST,
    // port: process.env.SMTP_PORT,
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "adolf.leannon82@ethereal.email",
      pass: "bqmE8RdFxy3Hxv9Edj",
    },
  });

  const message = {
    // from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    from: "octdoc@gmail.com",
    to: options.email,
    // to: "developer.mujahid@gmail.com",

    subject: options.subject,
    text: options.message,
    html: ` <b>This is your OTP</b> ${options.otp}`, // html body
  };
  console.log("message", message);
  const info = await transporter.sendMail(message);

  console.log("Message sent: %s", info.messageId);
};

module.exports = sendEmail;
