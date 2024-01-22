const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

const sendMailRoute = require("./routes/sendMailRoute");
const sendSupportMailRoute = require("./routes/sendSupportMailRoute");
const sendReceiptRoute = require("./routes/sendReceiptRoute");

if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: ".env.dev" });
} else if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.prod" });
} else {
  throw new Error(
    'Unknown NODE_ENV. Please set it to "development" or "production".'
  );
}

const app = express();
const port = process.env.PORT;
const corsOptions = {
  origin: true,
  credentials: true,
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());

app.post("/", sendMailRoute);
app.post("/support", sendSupportMailRoute);
app.post("/sendReceipt", sendReceiptRoute);

app.listen(port, () => {
  console.log(`Mail service on port: ${port}`);
});
