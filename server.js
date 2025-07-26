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

// --- CRITICAL CHANGE FOR CORS ORIGIN ---
const allowedOrigins = [
    'http://localhost:3000', // For local frontend development
    process.env.FRONTEND_URL // For deployed frontend
];


app.use(cors({
    credentials: true,
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        // or if the origin is in our allowed list
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            // Log the problematic origin for debugging
            console.error(`CORS blocked request from unknown origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    }
}));
// --- END CRITICAL CHANGE ---

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
    console.log("✅ Server started at port " + port);
});
