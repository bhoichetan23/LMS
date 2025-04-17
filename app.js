const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const cloudinary = require("cloudinary");

dotenv.config();

app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 4000;

// Cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.API_SECRET,
});

const userRouter = require("./routes/user");

app.use("/", userRouter);
app.use("/", courseRouter);

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
