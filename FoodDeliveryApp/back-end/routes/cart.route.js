const express = require("express");
const router = express.Router();
const { authentecateToken } = require("../middleware/authentication");
const { validate, validateParams } = require("../middleware/validator");
const { addToCartSchema, updateCartItemSchema, cartItemIdSchema } = require("../validators/cart.validator");
const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} = require("../controllers/cart.controller");

// All cart routes require authentication and validation
router.get("/", authentecateToken, getCart);
router.post("/add", authentecateToken, validate(addToCartSchema), addToCart);
router.put("/update/:itemId", authentecateToken, validateParams(cartItemIdSchema), validate(updateCartItemSchema), updateCartItem);
router.delete("/remove/:itemId", authentecateToken, validateParams(cartItemIdSchema), removeFromCart);
router.delete("/clear", authentecateToken, clearCart);

module.exports = router;
