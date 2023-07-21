const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const app = express();

const productRoute = require("./api/routes/product");
const orderRoute = require("./api/routes/order");
const userRoute = require("./api/routes/user");

mongoose.connect(
  "mongodb+srv://" +
    process.env.MONGO_ATLAS_USR_NAME +
    ":" +
    process.env.MONGO_ATLAS_PASSWD +
    "@node-rest-shop.k0ws24f.mongodb.net/"
);

app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    return res.status(200).json({});
  }
  next();
});

app.use("/api/products", productRoute);
app.use("/api/orders", orderRoute);
app.use("/users", userRoute);

app.use((req, res, next) => {
  const error = new Error("Unrecongnized Request");
  error.status = 409;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: error.message,
  });
});

module.exports = app;
