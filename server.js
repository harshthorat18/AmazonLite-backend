// Libraries
require('dotenv').config(); // Ensure this is at the very top
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// DB Connection
// This line correctly imports the connectDB function from your connection.js file.
// For this to work, connection.js MUST export a function named connectDB.
const connectDB = require('./database/connection');

// Routes
const router = require('./routes/router');

// Middleware
app.use(morgan('dev')); // Logging HTTP requests
app.use(express.json()); // Body parser for JSON payloads
app.use(cookieParser()); // Cookie parser for handling cookies
app.use(cors({ credentials: true, origin: 'http://localhost:3000' })); // CORS configuration for frontend

app.use('/api', router); // Mount your API routes under /api

// DB Connect
// This line calls the connectDB function to establish the database connection.
// It will only work if connectDB is actually a function exported from connection.js.
connectDB();

// Deployment setup for serving static files in production
if (process.env.NODE_ENV === 'production') {
    // Serve static files from the client/build directory
    app.use(express.static('client/build'));

    // For any other GET request, serve the index.html file
    // This is crucial for single-page applications (SPAs) like React apps
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client/build", "index.html"));
    });
}

// Start server
app.listen(port, () => {
    console.log("✅ Server started at port " + port);
});
