const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Product = require('./database/products');
const products = require('./products');

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to MongoDB Atlas");

    await Product.deleteMany(); // optional: clear existing
    await Product.insertMany(products);

    console.log("Data seeded successfully!");
    process.exit();
  })
  .catch((err) => {
    console.error("MongoDB connection failed", err);
    process.exit(1);
  });
