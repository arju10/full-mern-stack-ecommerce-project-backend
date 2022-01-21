const mongoose = require("mongoose");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const dotenv = require("dotenv").config({path:"../config/config.env"});

// const connectDatabase = () => {
//     mongoose
//     .connect(process.env.DB_LOCAL_URI,{
//         useNewUrlParser: true, 
//         useUnifiedTopology: true
//     })
//     .then(() => console.log("Connected to MongoDB"))
//     .catch((err) => console.error("Could not connect to MongoDB.", err));
// }
// module.exports = connectDatabase;


// Alternative way to connect database (try .. catch >>> use for async error handle)
// const connectDatabase = async () => {
//    try {
//     await mongoose.connect(process.env.DB_LOCAL_URI,{
//         useNewUrlParser: true, 
//         useUnifiedTopology: true
//     })
//     console.log("Mongodb Connected successfully");
   
//    } catch (error) {
//        console.log("MongoDB connection fail", error.message);
//    }
// }
// module.exports = connectDatabase;


// Alternative way to connect database with Async Error Handle

const connectDatabase = catchAsyncErrors(async () => {
    
    await mongoose.connect(process.env.DB_LOCAL_URI,{
        useNewUrlParser: true, 
        useUnifiedTopology: true
    })
    console.log("Mongodb Connected successfully");
  
})
 module.exports = connectDatabase;