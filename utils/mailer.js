const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: "./.env.dev" });
} else if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: "./.env.prod" });
} else {
  throw new Error(
    'Unknown NODE_ENV. Please set it to "development" or "production".'
  );
}

const mailHost = process.env.MAIL_HOST;
const mailPort = process.env.MAIL_PORT;
const mailSecure = process.env.MAIL_SECURE;
const mailUser = process.env.MAIL_USER;
const mailPassword = process.env.MAIL_PASSWORD;

const transporter = nodemailer.createTransport({
  host: mailHost,
  port: parseInt(mailPort),
  secure: mailSecure === "true" ? true : false,
  auth: {
    user: mailUser,
    pass: mailPassword,
  },
});

const sendMail = (mailOptions) => {
  console.log(transporter);

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

module.exports = { sendMail };
