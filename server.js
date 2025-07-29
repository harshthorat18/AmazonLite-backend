require('dotenv').config(); // Load .env at the top

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const seedRoute = require('./seed');



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

// ✅ Allow multiple Vercel frontend URLs (static + preview builds)
const allowedOrigins = [
  "https://amazonlite-frontend.vercel.app",
  "https://amazonlite-frontend-git-main-harshthorat18s-projects.vercel.app",
  "https://amazonlite-frontend-67yick3p4-harshthorat18s-projects.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn("Blocked CORS origin:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

// API Routes
app.use('/api', router);
app.use('/api', seedRoute);

// Connect MongoDB
connectDB();

// Start server
app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
