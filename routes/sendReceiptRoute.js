const PDFDocument = require("pdfkit");
const fs = require("fs");

module.exports = async (req, res) => {
  const order = req.body.order;

  fs.mkdir("Receipts", { recursive: true }, (err) => {
    if (err) {
      if (err.code === "EEXIST") {
        console.log(`Folder '${folderPath}' already exists.`);
      } else {
        console.error(`Error creating folder: ${err}`);
      }
    }
  });

  const doc = new PDFDocument();
  const outputStream = fs.createWriteStream(`./Receipts/${order.body.id}.pdf`);
  doc.pipe(outputStream);
  doc.fontSize(16).text("Hello, this is a PDF created with PDFKit!", 50, 50);
  doc.end();

  res.status(200).send({ message: "Receipt sent!" });
};
