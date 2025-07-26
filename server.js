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

// --- ADVANCED DEBUGGING FOR CORS ORIGIN (KEEP THESE LINES!) ---
const LOCAL_FRONTEND_URL = 'http://localhost:3000';
const DEPLOYED_FRONTEND_URL = process.env.FRONTEND_URL; // This is the value from Render's dashboard

console.log(`DEBUG: Initial PORT: "${port}"`);
console.log(`DEBUG: process.env.NODE_ENV: "${process.env.NODE_ENV}"`);
console.log(`DEBUG: LOCAL_FRONTEND_URL (hardcoded): "${LOCAL_FRONTEND_URL}"`);
console.log(`DEBUG: DEPLOYED_FRONTEND_URL (from process.env): "${DEPLOYED_FRONTEND_URL}"`); // *** THIS LINE IS CRUCIAL ***

const allowedOrigins = [
    LOCAL_FRONTEND_URL, // For local frontend development
    DEPLOYED_FRONTEND_URL // For deployed frontend
];

// Filter out any undefined, null, or empty string values from allowedOrigins
const cleanedAllowedOrigins = allowedOrigins.filter(url => typeof url === 'string' && url.length > 0);

console.log(`DEBUG: allowedOrigins array (before clean): ${JSON.stringify(allowedOrigins)}`);
console.log(`DEBUG: cleanedAllowedOrigins array (after filter): ${JSON.stringify(cleanedAllowedOrigins)}`); // *** THIS LINE IS CRUCIAL ***

app.use(cors({
    credentials: true,
    origin: function (origin, callback) {
        // If the array is empty, it means DEPLOYED_FRONTEND_URL was not set correctly
        if (cleanedAllowedOrigins.length === 0) {
            console.error('CRITICAL CORS ERROR: No valid origins configured. DEPLOYED_FRONTEND_URL might be missing or invalid.');
            return callback(new Error('CORS configuration error: No valid origins.'));
        }

        if (!origin || cleanedAllowedOrigins.includes(origin)) {
            console.log(`CORS ALLOWED: Origin "${origin}"`);
            callback(null, true);
        } else {
            console.error(`CORS BLOCKED: Request from unknown origin: "${origin}"`);
            console.error(`CORS BLOCKED: Allowed origins were: ${JSON.stringify(cleanedAllowedOrigins)}`);
            callback(new Error(`Not allowed by CORS: ${origin}`));
        }
    }
}));
// --- END ADVANCED DEBUGGING ---

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
    console.log("Server started at port " + port);
});
