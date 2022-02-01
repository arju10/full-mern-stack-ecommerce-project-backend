const express = require("express");

const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const app = express();

const errorMiddle = require("./middlewares/errors");
// Parsing URL encoded body
app.use(express.urlencoded({extended: false}));

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

// import all Product routes
const products = require("./routes/product");
app.use("/api/v1",products);

// import all user routes
const auth = require("./routes/auth");
app.use("/api/v1", auth);

// Middleware to handle error
// RUNS AFTER THE ROUTES BUT BEFORE THE CONTROLLER
app.use(errorMiddle);

module.exports = app;
