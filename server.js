const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");

// Setting Env file
dotenv.config({path:"./config/config.env"});

// Connecting to database
connectDatabase();

app.listen(process.env.PORT, (req,res) => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`)
});