const express = require("express");

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const app = express();
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

// import all Product routes
const products = require("./routes/product");

app.use("/api/v1/",products);

module.exports = app;
