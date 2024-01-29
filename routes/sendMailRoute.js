const { sendMail } = require("../utils/mailer");

module.exports = async (req, res) => {
  const mailOptions = req.body;

  console.log("Using mail service: ", process.env.MAIL_HOST);

  try {
    sendMail(mailOptions);
  } catch (error) {
    res.status(501).send(JSON.stringify({ error: error }));
  }

  res.status(200).send(JSON.stringify({ message: "Email verification sent!" }));
};
