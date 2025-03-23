const mongoose = require("mongoose");

const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URI || "")
    .then(() => {
      "connection established successfuly";
    })
    .catch((err) => {
      console.error("connection failed", err);
    });
};

module.exports = dbConnection;