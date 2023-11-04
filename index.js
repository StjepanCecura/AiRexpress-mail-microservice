const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sendMail = require("./routes/sendMail");

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

app.post("/", sendMail);

app.listen(port, () => {
  console.log(`User service on port: ${port}`);
});
