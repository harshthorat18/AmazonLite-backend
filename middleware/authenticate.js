const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Use the same environment variable name as in router.js for consistency
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key"; // Ensure this matches the secret used for signing

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.AmazonClone;

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "No token provided"
      });
    }

    // Verify the token using the consistent JWT_SECRET
    const verifyToken = jwt.verify(token, JWT_SECRET);

    // Access the user ID using 'id' as it was signed with 'id: savedUser._id'
    const rootUser = await User.findById(verifyToken.id);

    if (!rootUser) {
      return res.status(404).json({
        status: false,
        message: "User not found"
      });
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userId = rootUser._id; // Use rootUser._id for consistency with Mongoose documents

    next();

  } catch (error) {
    console.error("Authentication error:", error.message); // Log the actual error for debugging
    return res.status(401).json({
      status: false,
      message: "Unauthorized: Invalid token",
      error: error.message
    });
  }
};

module.exports = authenticate;
