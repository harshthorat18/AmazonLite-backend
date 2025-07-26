const jwt = require('jsonwebtoken');
const User = require('../models/User');
const secretKey = process.env.SECRET_KEY;

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.AmazonClone;

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "No token provided"
      });
    }

    const verifyToken = jwt.verify(token, secretKey);

    const rootUser = await User.findById(verifyToken._id);

    if (!rootUser) {
      return res.status(404).json({
        status: false,
        message: "User not found"
      });
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userId = rootUser._id;

    next();

  } catch (error) {
    return res.status(401).json({
      status: false,
      message: "Unauthorized: Invalid token",
      error: error.message
    });
  }
};

module.exports = authenticate;
