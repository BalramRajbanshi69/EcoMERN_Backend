const express = require("express");
const router = express.Router();
const CartModel = require("../model/Cart_model");
const FetchUser = require("../middleware/FetchUser");
const ProductModel = require("../model/ProductModal"); // Assuming a Product model exists

// Get user's cart
router.get("/", FetchUser, async (req, res) => {
  try {
    const cart = await CartModel.findOne({ user: req.user.id }).populate(
      "items.productId"
    );
    if (!cart) {
      return res.json({ success: true, items: [], cartCount: 0 });
    }
    const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    res.json({ success: true, items: cart.items, cartCount });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// Add item to cart
router.post("/add-item", FetchUser, async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const userId = req.user.id;

  try {
    let cart = await CartModel.findOne({ user: userId });
    if (!cart) {
      cart = new CartModel({ user: userId, items: [] });
    }

    const product = await ProductModel.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, error: "Product not found" });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({
        productId: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        quantity,
        inStock: product.inStock,
      });
    }

    await cart.save();
    const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    res.json({ success: true, items: cart.items, cartCount });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// Remove item from cart
router.delete("/remove-item/:productId", FetchUser, async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.id;

  try {
    const cart = await CartModel.findOne({ user: userId });
    if (!cart) {
      return res.json({ success: true, items: [], cartCount: 0 });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );
    await cart.save();
    const cartCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    res.json({ success: true, items: cart.items, cartCount });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// Update item quantity
router.put("/update-item", FetchUser, async (req, res) => {
  const { productId, quantity } = req.body;
  const userId = req.user.id;

  try {
    const cart = await CartModel.findOne({ user: userId });
    if (!cart) {
      return res.json({ success: true, items: [], cartCount: 0 });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      const cartCount = cart.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      res.json({ success: true, items: cart.items, cartCount });
    } else {
      res.status(404).json({ success: false, error: "Item not found in cart" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// Clear cart
router.delete("/clear", FetchUser, async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await CartModel.findOne({ user: userId });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ success: true, items: [], cartCount: 0 });
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
});

module.exports = router;
