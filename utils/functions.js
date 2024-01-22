const PDFDocument = require("pdfkit");
const fs = require("fs");

const generatePdf = (order) => {
  const dateString = order.body.createdAt;
  const dateObject = new Date(dateString);

  const columnWidths = [350, 75, 75];
  const rowHeight = 20;

  const font = "./node_modules/dejavu-fonts-ttf/ttf/DejaVuSans.ttf";
  const boldFont = "./node_modules/dejavu-fonts-ttf/ttf/DejaVuSans-Bold.ttf";

  const formattedDate = dateObject
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replaceAll("/", ".");

  let currentY;

  const doc = new PDFDocument();

  function drawCell(text, x, y, width, height) {
    doc.rect(x, y, width, height).stroke();
    doc.text(text, x + 5, y + 5);
  }

  function drawRow(rowData, columnWidths, rowHeight, startY) {
    let x = 50;
    rowData.forEach((text, columnIndex) => {
      drawCell(text, x, startY, columnWidths[columnIndex], rowHeight);
      x += columnWidths[columnIndex];
    });
  }

  const outputStream = fs.createWriteStream(`./Receipts/${order.body.id}.pdf`);
  doc.pipe(outputStream);
  doc.font(boldFont);
  doc.fontSize(26).text("AiRExpress", {
    align: "left",
  });
  doc.font(font);
  doc.fontSize(12);
  doc.moveDown();
  doc.fontSize(12).text(`Broj narudžbe: ${order.body.id}`, {
    align: "left",
  });
  doc.moveDown();
  doc.fontSize(12).text(`Datum: ${formattedDate}`, {
    align: "left",
  });
  doc.moveDown();
  doc.font(boldFont);
  doc.fontSize(11).text(`Podaci o kupcu`, {
    align: "left",
    bold: true,
  });
  doc.font(font);
  doc.moveDown();
  doc.fontSize(10).text(`Email: ${order.body.shippingAddress.email}`, {
    align: "left",
  });
  doc.fontSize(10).text(`Ime: ${order.body.shippingAddress.firstName}`, {
    align: "left",
  });
  doc.fontSize(10).text(`Prezime: ${order.body.shippingAddress.lastName}`, {
    align: "left",
  });
  doc
    .fontSize(10)
    .text(`Poštanski broj: ${order.body.shippingAddress.postalCode}`, {
      align: "left",
    });
  doc.fontSize(10).text(`Grad: ${order.body.shippingAddress.city}`, {
    align: "left",
  });
  doc
    .fontSize(10)
    .text(
      `Ulica i kućni broj: ${order.body.shippingAddress.streetName} ${order.body.shippingAddress.streetNumber}`,
      {
        align: "left",
      }
    );
  doc.font(boldFont);
  doc.moveDown();
  doc.fontSize(12).text(`Vaša narudžba:`, {
    align: "left",
  });
  doc.font(font);
  doc.moveDown();
  currentY = doc.y;
  doc.font(boldFont);
  drawRow(["Artikl", "Količina", "Cijena"], columnWidths, rowHeight, currentY);
  doc.font(font);
  currentY += rowHeight;
  order.body.lineItems.forEach((rowData, rowIndex) => {
    drawRow(
      [
        rowData.variant.key,
        rowData.quantity,
        rowData.price.discounted
          ? rowData.price.discounted.value.centAmount / 100 + "€"
          : rowData.price.value.centAmount / 100 + "€",
      ],
      columnWidths,
      rowHeight,
      currentY
    );
    currentY += rowHeight;
  });
  doc.moveDown();
  doc.font(boldFont);
  doc.fontSize(14).text(`Ukupna cijena:`, 50);
  doc.font(font);
  doc.fontSize(12).text(`${order.body.totalPrice.centAmount / 100} €`, 50);
  doc.end();
};

module.exports = {
  generatePdf,
};
