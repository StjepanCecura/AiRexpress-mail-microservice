const fs = require("fs");
const { sendMail } = require("../utils/mailer");
const { generatePdf } = require("../utils/functions");

module.exports = async (req, res) => {
  const order = req.body.order;

  try {
    fs.mkdir("Receipts", { recursive: true }, (err) => {
      if (err) {
        if (err.code === "EEXIST") {
          console.log(`Folder '${folderPath}' already exists.`);
        } else {
          console.error(`Error creating folder: ${err}`);
        }
      }
    });

    generatePdf(order);

    const mailOptions = {
      from: "airwbltim1@gmail.com",
      to: order.body.shippingAddress.email,
      subject: "Receipt",
      html: `<p>Thank you for your order!</p>`,
      attachments: [
        {
          filename: `${order.body.id}.pdf`,
          path: `./Receipts/${order.body.id}.pdf`,
        },
      ],
    };
    sendMail(mailOptions);

    res.status(200).send({ message: "Receipt sent!" });
  } catch (error) {
    console.log(`Error sending receipt! ${error}`);
    res.status(502).send({ message: "Error sending receipt!" });
  }
};
