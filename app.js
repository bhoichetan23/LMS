const express = require("express");
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

app.get("/hi", (req,res)=>{
    res.send("Hello");

});

app.listen(port, () => {
  console.log(`Server listening on port number ${port} `);
 
});


