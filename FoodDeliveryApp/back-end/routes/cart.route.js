const express = require("express");
const router = express.Router();
const { authentecateToken } = require("../middleware/authentication");
const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} = require("../controllers/cart.controller");

// All cart routes require authentication
router.get("/", authentecateToken, getCart);
router.post("/add", authentecateToken, addToCart);
router.put("/update/:itemId", authentecateToken, updateCartItem);
router.delete("/remove/:itemId", authentecateToken, removeFromCart);
router.delete("/clear", authentecateToken, clearCart);

module.exports = router;
