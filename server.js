const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");
const { process_params } = require("express/lib/router");

// Setting Env file
dotenv.config({path:"./config/config.env"});

// Connecting to database
connectDatabase();

const server = app.listen(process.env.PORT, (req,res) => {
    console.log(`Server is running on http://localhost:${process.env.PORT} in ${process.env.NODE_ENV}`);
});

process.on('unhandledRejection', err => {
    console.log(`ERROR :: ${err.message}`);
    console.log("Shutting down the server due to unhandled promise rejection!");
    server.close(() => {
        process.exit(1);
    })
})