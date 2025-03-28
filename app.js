const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

dotenv.config();

app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(cookieParser());

const port = process.env.PORT || 4000;

const userRouter = require("./routes/user");

app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("Database connection successfull");
    app.listen(port, () => {
      console.log(`Server listening on port number ${port}`);
    });
  })
  .catch((err) => {
    console.log("Database connection failed");
    console.error(err.message);
    process.exit(1);
  });
