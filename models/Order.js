import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: String,
  items: Array,
  amount: Number,
  status: {
    type: String,
    default: 'pending'
  }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
