const express = require("express");
const mongoose = require("mongoose");
const ApiRoutes = require("./Router/ApiRoutes");
const cors = require("cors");
const app = express();
const MONGODB_URL = "mongodb://127.0.0.1:27017/sampleDB";
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/", ApiRoutes);
mongoose
  .connect(MONGODB_URL)
  .then(() => {
    app.listen(8000, () => {
      console.log("server started at port", 8000);
    });
  })
  .catch((err) => {
    console.log(err);
  });
