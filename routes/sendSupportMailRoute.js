const { sendMail } = require("../utils/mailer");

module.exports = async (req, res) => {
  const title = req.body.title;
  const body = req.body.body;

  const token = req.cookies.token;

  fetch("http://customer_service:4002/verifyJWT", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token }),
  })
    .then((response) => response.json())
    .then((data) => {
      const userMail = data.user.email;
      const mailOptions = {
        from: userMail,
        to: "airwbltim1@gmail.com",
        subject: title,
        html: `<p>Customer: ${userMail} <br/> ${body}</p>`,
      };

      try {
        sendMail(mailOptions);
      } catch (error) {
        res.status(501).send({ success: false, message: error });
      }

      res.status(200).send({ success: true, message: "Support email sent!" });
    })
    .catch((error) => {
      console.log(error);
      res.status(501).send({ success: false, message: error });
    });
};
