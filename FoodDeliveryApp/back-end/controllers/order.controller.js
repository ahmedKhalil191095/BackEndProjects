const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const User = require("../models/user.model");
const Restaurant = require("../models/restaurant.model");

// Place order from cart
const placeOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { restaurantId, deliveryAddress, paymentMethod } = req.body;

        if (!restaurantId || !deliveryAddress) {
            return res.status(400).json({
                success: false,
                message: "restaurantId and deliveryAddress are required"
            });
        }

        // Get user's cart
        const cart = await Cart.findOne({ userId });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }

        // Validate all cart items belong to the specified restaurant
        const MenuItem = require("../models/menuItems.model");
        for (const cartItem of cart.items) {
            const menuItem = await MenuItem.findById(cartItem.menuItemId);
            if (!menuItem) {
                return res.status(404).json({
                    success: false,
                    message: `Menu item ${cartItem.name} not found`
                });
            }
            if (menuItem.restaurantId.toString() !== restaurantId) {
                return res.status(400).json({
                    success: false,
                    message: `All items in cart must be from the same restaurant. Item "${cartItem.name}" is from a different restaurant.`
                });
            }
        }

        // Get restaurant details for delivery fee
        const restaurant = await Restaurant.findById(restaurantId);

        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            });
        }

        // Check if restaurant is open
        if (!restaurant.isOpen) {
            return res.status(400).json({
                success: false,
                message: "Restaurant is currently closed"
            });
        }

        // Calculate pricing breakdown
        const subtotal = cart.totalPrice;
        const TAX_RATE = 0.08; // 8% tax
        const tax = parseFloat((subtotal * TAX_RATE).toFixed(2));
        const deliveryFee = restaurant.deliveryFee || 5.00;
        const total = parseFloat((subtotal + tax + deliveryFee).toFixed(2));

        // Check if order meets minimum order requirement
        if (subtotal < restaurant.minimumOrder) {
            return res.status(400).json({
                success: false,
                message: `Minimum order amount is $${restaurant.minimumOrder}`
            });
        }

        // Create order from cart
        const order = new Order({
            userId,
            restaurantId,
            items: cart.items,
            pricing: {
                subtotal,
                tax,
                deliveryFee,
                total
            },
            deliveryAddress,
            paymentMethod: paymentMethod || "cash",
            status: "pending"
        });

        await order.save();

        // Clear cart after successful order
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error placing order",
            error: error.message
        });
    }
};

// Get order by ID
const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        const order = await Order.findOne({ orderId })
            .populate("userId", "name email phone")
            .populate("restaurantId", "name phone address")
            .populate("items.menuItemId", "name category");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Check if user is authorized to view this order
        if (userRole !== "admin" && order.userId._id.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to view this order"
            });
        }

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving order",
            error: error.message
        });
    }
};

// Get all orders for a user
const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        const orders = await Order.find({ userId })
            .populate("restaurantId", "name phone address")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving orders",
            error: error.message
        });
    }
};

// Get all orders (admin only)
const getAllOrders = async (req, res) => {
    try {
        const userRole = req.user.role;

        if (userRole !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin only."
            });
        }

        const orders = await Order.find()
            .populate("userId", "name email phone")
            .populate("restaurantId", "name phone address")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving orders",
            error: error.message
        });
    }
};

// Update order status
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const userRole = req.user.role;

        // Only admin and restaurant owners can update order status
        if (userRole !== "admin" && userRole !== "restaurant_owner") {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update order status"
            });
        }

        const validStatuses = ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"];

        if (!status || !validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Invalid status. Valid statuses are: ${validStatuses.join(", ")}`
            });
        }

        const order = await Order.findOne({ orderId });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        order.status = status;
        await order.save();

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating order status",
            error: error.message
        });
    }
};

// Update payment status
const updatePaymentStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { paymentStatus } = req.body;
        const userRole = req.user.role;

        if (userRole !== "admin" && userRole !== "restaurant_owner") {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update payment status"
            });
        }

        const validPaymentStatuses = ["pending", "paid", "failed"];

        if (!paymentStatus || !validPaymentStatuses.includes(paymentStatus)) {
            return res.status(400).json({
                success: false,
                message: `Invalid payment status. Valid statuses are: ${validPaymentStatuses.join(", ")}`
            });
        }

        const order = await Order.findOne({ orderId });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        order.paymentStatus = paymentStatus;
        await order.save();

        res.status(200).json({
            success: true,
            message: "Payment status updated successfully",
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating payment status",
            error: error.message
        });
    }
};

// Cancel order
const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        const order = await Order.findOne({ orderId });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Check if user is authorized to cancel this order
        if (userRole !== "admin" && order.userId.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to cancel this order"
            });
        }

        // Only allow cancellation if order is pending or confirmed
        if (order.status !== "pending" && order.status !== "confirmed") {
            return res.status(400).json({
                success: false,
                message: "Cannot cancel order at this stage"
            });
        }

        order.status = "cancelled";
        await order.save();

        res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error cancelling order",
            error: error.message
        });
    }
};

module.exports = {
    placeOrder,
    getOrderById,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
    updatePaymentStatus,
    cancelOrder
};
