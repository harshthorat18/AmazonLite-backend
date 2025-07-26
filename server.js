// my server.js // Libraries
require('dotenv').config(); // Ensure this is at the very top
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// DB Connection
const connectDB = require('./database/connection');

// Routes
const router = require('./routes/router');

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

// --- MODIFIED CORS ORIGIN LOGIC ---
let corsOrigin;

// Set CORS origin based on environment
if (process.env.NODE_ENV === 'production') {
    // In production, use only the deployed frontend URL
    corsOrigin = process.env.FRONTEND_URL;
    console.log(`DEBUG: Production CORS Origin: "${corsOrigin}"`);
} else {
    // In development, use localhost
    corsOrigin = 'http://localhost:3000';
    console.log(`DEBUG: Development CORS Origin: "${corsOrigin}"`);
}

// Add a check to ensure corsOrigin is a valid string
if (!corsOrigin || typeof corsOrigin !== 'string' || corsOrigin.length === 0) {
    console.error('CRITICAL ERROR: CORS origin is not defined or is invalid!');
    // This will stop the app if origin is invalid. Helps to debug.
    process.exit(1);
}

app.use(cors({
    credentials: true,
    origin: corsOrigin // Pass the determined origin directly
}));
// --- END MODIFIED CORS LOGIC ---

app.use('/api', router);

// DB Connect
connectDB();

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client/build", "index.html"));
    });
}

// Start server
app.listen(port, () => {
    console.log(" Server started at port " + port);
});
