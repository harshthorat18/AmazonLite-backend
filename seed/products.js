import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "../models/product.js";
import connectDB from "../config/db.js";

dotenv.config();
connectDB();

const sampleProducts = [
  {
    name: "T-Shirt",
    price: 499,
    description: "Comfortable cotton t-shirt",
    image: "https://via.placeholder.com/150"
  },
  {
    name: "Headphones",
    price: 1299,
    description: "Wireless Bluetooth headphones",
    image: "https://via.placeholder.com/150"
  },
  {
    name: "Backpack",
    price: 899,
    description: "Stylish waterproof backpack",
    image: "https://via.placeholder.com/150"
  }
];

const importData = async () => {
  try {
    await Product.deleteMany();
    await Product.insertMany(sampleProducts);
    console.log("Sample products added!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

importData();
