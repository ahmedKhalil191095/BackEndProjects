const express = require("express");
const router = express.Router();
const { authentecateToken } = require("../middleware/authentication");
const { validate, validateParams } = require("../middleware/validator");
const { addToCartSchema, updateCartItemSchema, cartItemIdSchema } = require("../validators/cart.validator");
const { orderLimiter } = require("../middleware/rateLimiter");
const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} = require("../controllers/cart.controller");

// All cart routes require authentication, validation, and rate limiting
router.get("/", authentecateToken, getCart);
router.post("/add", orderLimiter, authentecateToken, validate(addToCartSchema), addToCart);
router.put("/update/:itemId", orderLimiter, authentecateToken, validateParams(cartItemIdSchema), validate(updateCartItemSchema), updateCartItem);
router.delete("/remove/:itemId", orderLimiter, authentecateToken, validateParams(cartItemIdSchema), removeFromCart);
router.delete("/clear", orderLimiter, authentecateToken, clearCart);

module.exports = router;
