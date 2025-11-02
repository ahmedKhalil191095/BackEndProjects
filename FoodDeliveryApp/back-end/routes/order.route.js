const express = require("express");
const router = express.Router();
const { authentecateToken } = require("../middleware/authentication");
const { validate, validateParams } = require("../middleware/validator");
const { orderLimiter } = require("../middleware/rateLimiter");
const {
    placeOrderSchema,
    updateOrderStatusSchema,
    updatePaymentStatusSchema,
    orderIdSchema
} = require("../validators/order.validator");
const {
    placeOrder,
    getOrderById,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
    updatePaymentStatus,
    cancelOrder
} = require("../controllers/order.controller");

// All order routes require authentication, validation, and rate limiting
router.post("/place", orderLimiter, authentecateToken, validate(placeOrderSchema), placeOrder);
router.get("/user", authentecateToken, getUserOrders);
router.get("/all", authentecateToken, getAllOrders);
router.get("/:orderId", authentecateToken, validateParams(orderIdSchema), getOrderById);
router.put("/:orderId/status", authentecateToken, validateParams(orderIdSchema), validate(updateOrderStatusSchema), updateOrderStatus);
router.put("/:orderId/payment", authentecateToken, validateParams(orderIdSchema), validate(updatePaymentStatusSchema), updatePaymentStatus);
router.put("/:orderId/cancel", authentecateToken, validateParams(orderIdSchema), cancelOrder);

module.exports = router;
