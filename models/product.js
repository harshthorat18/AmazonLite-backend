const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: Number,
  url: {
    type: String,
    required: true,
  },
  resUrl: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  accValue: {
    type: Number,
    required: false, // optional field; set true if mandatory
  },
  discount: {
    type: String,
    required: true,
  },
  mrp: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  points: [
    {
      type: String,
    }
  ]
});

// Note: collection name will be "products"
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
