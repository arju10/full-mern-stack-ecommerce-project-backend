// Seeder is use for sending dummy data to database

const Product = require("../models/product");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDatabase = require("../config/database.js");

// Importing dummy dataset
const productData = require("../data/product.json");

// Setting ENV file
dotenv.config({ path: "../config/config.env" });

// Connecting to database
connectDatabase();

const insertProduct = async () => {
  try {
    // deleteMany will empty the entire database
    await Product.deleteMany();
    console.log("Products are deleted which was stored in database!");

    // insertMany will insert multiple data into database
    await Product.insertMany(productData);
    console.log("Products are inserted successfully!");

    process.exit();
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
};

//  Calling Data insertion Function
insertProduct();
