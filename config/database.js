const mongoose = require("mongoose");

const connectDatabase = () => {
    mongoose
    .connect(process.env.DB_LOCAL_URI,{
        useNewUrlParser: true, 
        useUnifiedTopology: true
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Could not connect to MongoDB.", err));
}
module.exports = connectDatabase;