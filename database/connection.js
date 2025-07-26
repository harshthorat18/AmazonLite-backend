// D:\harsh all projexcts\AmazonLite Payment System Project\backend\database\connection.js

// Libraries
const mongoose = require('mongoose');

// Database Connection Function
const connectDB = async () => {
    try {
        const db_url = process.env.MONGO_URL; // Get URL inside the function
        if (!db_url) {
            console.error('Error: MONGO_URL is not defined in your .env file!');
            // Exit the process if the URL is missing, as the app can't function without it
            process.exit(1);
        }
        await mongoose.connect(db_url);
        console.log("MongoDB Connected Successfully!");
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        // Exit the process if connection fails
        process.exit(1);
    }
};

module.exports = connectDB; // <--- Export the function