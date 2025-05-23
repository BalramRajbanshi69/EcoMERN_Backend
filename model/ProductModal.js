const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required:true
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    inStock: {
      type: Number,
      required: true,
    },
    image: {
      type: [String],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const ProductModal = mongoose.model("product", productSchema);
module.exports = ProductModal;
