const express = require("express");
const router = express.Router();
const { authentecateToken } = require("../middleware/authentication");
const {
    placeOrder,
    getOrderById,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
    updatePaymentStatus,
    cancelOrder
} = require("../controllers/order.controller");

// All order routes require authentication
router.post("/place", authentecateToken, placeOrder);
router.get("/user", authentecateToken, getUserOrders);
router.get("/all", authentecateToken, getAllOrders);
router.get("/:orderId", authentecateToken, getOrderById);
router.put("/:orderId/status", authentecateToken, updateOrderStatus);
router.put("/:orderId/payment", authentecateToken, updatePaymentStatus);
router.put("/:orderId/cancel", authentecateToken, cancelOrder);

module.exports = router;
