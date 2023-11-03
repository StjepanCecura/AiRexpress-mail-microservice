const express = require("express");
const cors = require("cors");
const { sendMail } = require("./utils/mailer");
const dotenv = require("dotenv");

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

app.use(cors());
app.use(express.json());

app.post("/", async (req, res) => {
  const mailOptions = req.body;
  console.log("Using mail service: ", process.env.MAIL_HOST);
  try {
    sendMail(mailOptions);
  } catch (error) {
    res.send(JSON.stringify({ error: error }));
  }

  res.send(JSON.stringify({ message: "Email verification sent!" }));
});

app.listen(port, () => {
  console.log(`User service on port: ${port}`);
});
