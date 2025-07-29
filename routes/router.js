const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const authenticate = require('../middleware/authenticate');
const Product = require('../models/product'); // Adjust path as needed
const User = require('../models/User');     // Adjust path as needed
const productData = require('../database/product');


const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

// ===================== PRODUCTS =====================

// ✅ Get all products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find(); // Fetch from DB
    res.json(products);
  } catch (err) {
    console.error('Error fetching all products:', err); // Added error logging
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// ✅ Get individual product by ID
router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id); // Find product by ID
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (err) {
        console.error('Error fetching product by ID:', err);
        // If the ID format is invalid (e.g., not a valid ObjectId), Mongoose will throw a CastError
        if (err.name === 'CastError') {
            return res.status(400).json({ error: 'Invalid product ID format' });
        }
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// ===================== AUTH - REGISTER =====================

router.post('/register', [
  check('name').notEmpty().withMessage("Name can't be empty").trim().escape(),
  check('number')
    .notEmpty().withMessage("Number can't be empty")
    .isNumeric().withMessage("Number must be digits only")
    .isLength({ min: 10, max: 10 }).withMessage('Number must be exactly 10 digits'),
  check('email')
    .notEmpty().withMessage("Email can't be empty")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),
  check('password')
    .notEmpty().withMessage("Password can't be empty")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
    .matches(/\d/).withMessage("Password must contain a number")
    .isAlphanumeric().withMessage("Password can contain only letters and numbers"),
  check('confirmPassword')
    .notEmpty().withMessage("Confirm Password can't be empty")
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ status: false, message: errors.array() });

  const { name, number, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ status: false, message: [{ msg: "Passwords do not match" }] });
  }

  try {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(400).json({ status: false, message: [{ msg: "Email already registered" }] });

    const existingNumber = await User.findOne({ number });
    if (existingNumber) return res.status(400).json({ status: false, message: [{ msg: "Number already registered" }] });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, number, email, password: hashedPassword });
    const savedUser = await user.save();

    const token = jwt.sign({ id: savedUser._id, email: savedUser.email }, JWT_SECRET, { expiresIn: "1h" });

    res.cookie("AmazonClone", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 3600000),
    });

    res.status(201).json({
      status: true,
      message: "User registered successfully",
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: [{ msg: "Server error" }] });
  }
});

// ===================== AUTH - LOGIN =====================

router.post('/login', [
  check('email').notEmpty().withMessage("Email can't be empty")
    .isEmail().withMessage("Invalid email format").normalizeEmail(),
  check('password').notEmpty().withMessage("Password can't be empty")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
    .matches(/\d/).withMessage("Password must contain a number")
    .isAlphanumeric().withMessage("Password can only contain alphabets and numbers")
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ status: false, message: errors.array() });

  const { email, password } = req.body;

  try {
    const found = await User.findOne({ email });
    if (!found) return res.status(400).json({ status: false, message: [{ msg: "Incorrect Email or Password" }] });

    const isMatch = await bcrypt.compare(password, found.password);
    if (!isMatch) return res.status(400).json({ status: false, message: [{ msg: "Incorrect Email or Password" }] });

    const token = await found.generateAuthToken();

    res.cookie("AmazonClone", token, {
       httpOnly: true,
       secure: false,         // Set to true if using HTTPS
       sameSite: "Lax",       // Use "None" if frontend is on different domain + HTTPS
       maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    return res.status(201).json({
      status: true,
      message: "Logged in successfully!",
      token,
      user: {
        id: found._id,
        email: found.email,
        name: found.name
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: false, message: [{ msg: "Server error" }] });
  }
});

// ===================== CART =====================
router.post('/addtocart/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const productInfo = await Product.findById(id);
    const userInfo = await User.findById(req.userId);

    if (!productInfo) {
      return res.status(404).json({ status: false, message: "Product not found" });
    }

    if (userInfo) {
      let updated = false;

      for (let item of userInfo.cart) {
        if (item.id == id) {
          await User.updateOne(
            { _id: userInfo._id, 'cart.id': id },
            { $inc: { 'cart.$.qty': 1 } }
          );
          updated = true;
          break;
        }
      }

      if (!updated) {
        await userInfo.addToCart(id, productInfo);
      }

      res.status(201).json({ status: true, message: userInfo });
    } else {
      res.status(400).json({ status: false, message: "Invalid User" });
    }

  } catch (error) {
    console.error(error); // Added error logging
    res.status(500).json({ status: false, message: "Server error" });
  }
});


// Note: The getSingleProduct function below is not a route itself.
// If it was intended to be a route, it needs to be wrapped in router.get() or similar.
// For now, it's just a standalone function.
const getSingleProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  res.status(200).json(product);
};


// ===================== DELETE ITEM FROM CART =====================

router.delete("/delete/:id", authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const userData = await User.findById(req.userId);

    userData.cart = userData.cart.filter(item => item.id != id);
    await userData.save();

    res.status(201).json({ status: true, message: "Item deleted successfully" });

  } catch (error) {
    console.error(error); // Added error logging
    res.status(400).json({ status: false, message: error.message });
  }
});

// ===================== LOGOUT (First instance) =====================

router.get("/logout", authenticate, async (req, res) => {
  try {
    // Check if req.rootUser exists and has a tokens array before filtering
    if (req.rootUser && req.rootUser.tokens) {
      req.rootUser.tokens = req.rootUser.tokens.filter(t => t.token !== req.token);
      await req.rootUser.save();
    } else {
        console.warn("req.rootUser or req.rootUser.tokens not found during logout. User might not be fully authenticated or session is already cleared.");
    }

    res.clearCookie("AmazonClone");
    res.status(201).json({ status: true, message: "Logged out successfully!" });
  } catch (error) {
    console.error(error); // Added error logging
    res.status(400).json({ status: false, message: error.message });
  }
});


// ===================== GET AUTH USER =====================

router.get('/getAuthUser', authenticate, async (req, res) => {
  try {
    const userData = await User.findById(req.userId);
    if (!userData) {
        return res.status(404).json({ status: false, message: "User not found" });
    }
    res.send(userData);
  } catch (err) {
    console.error(err); // Added error logging
    res.status(500).json({ status: false, message: "Server error" });
  }
});

// ===================== RAZORPAY =====================

router.get("/get-razorpay-key", (req, res) => {
  res.send({ key: process.env.RAZORPAY_KEY_ID });
});

router.post("/create-order", authenticate, async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET
    });

    const order = await razorpay.orders.create({
      amount: req.body.amount,
      currency: 'INR'
    });

    res.status(200).json({ order });
  } catch (error) {
    console.error(error); // Added error logging
    res.status(400).json(error);
  }
});

router.post("/pay-order", authenticate, async (req, res) => {
  try {
    const userInfo = await User.findById(req.userId);
    const { amount, razorpayPaymentId, razorpayOrderId, razorpaySignature, orderedProducts, dateOrdered } = req.body;

    const newOrder = {
      products: orderedProducts,
      date: dateOrdered,
      isPaid: true,
      amount,
      razorpay: {
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        signature: razorpaySignature
      }
    };

    if (userInfo) {
      await userInfo.addOrder(newOrder);
      res.status(200).json({ message: "Payment was successful" });
    } else {
      res.status(400).json({ message: "Invalid user" });
    }

  } catch (error) {
    console.error(error); // Added error logging
    res.status(400).json(error);
  }
});


// Route to verify login and get user details

router.get('/validuser', authenticate, async (req, res) => {
  try {
    const validUser = await User.findById(req.userId).select("-password");
    if (!validUser) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    return res.status(200).json({ status: true, user: validUser });
  } catch (err) {
    console.error(err); // Added error logging
    return res.status(500).json({ status: false, message: "Server error" });
  }
});


// ===================== LOGOUT (Second instance - consider removing one) =====================
// REMOVED THE STRAY '.' HERE
router.get('/logout', (req, res) => {
  res.clearCookie("AmazonClone", {
    httpOnly: true,
    secure: false,      
    sameSite: "Lax"     
  });
  return res.status(200).json({ status: true, message: "Logout successful" });
});

//=============================================================


router.get('/seed', async (req, res) => {
  try {
    await Product.deleteMany(); // Optional: clear existing
    await Product.insertMany(productData);
    res.send({ message: 'Seeding done!' });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

module.exports = router;

// Export the router AFTER all routes have been defined
module.exports = router;
