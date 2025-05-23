const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
    unique: true, // Ensures one cart per user
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
      },
      name: String,
      description: String,
      price: Number,
      image: String,
      quantity: {
        type: Number,
        default: 1,
        min: 1,
      },
      inStock: Number,
    },
  ],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update `updatedAt` before saving
CartSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const CartModel = mongoose.model("cart", CartSchema);
module.exports = CartModel;
