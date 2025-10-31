const Cart = require("../models/cart.model");
const MenuItem = require("../models/menuItems.model");

// Get user's cart
const getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        let cart = await Cart.findOne({ userId }).populate("items.menuItemId");

        if (!cart) {
            // Create empty cart if it doesn't exist
            cart = new Cart({ userId, items: [], totalPrice: 0 });
            await cart.save();
        }

        res.status(200).json({
            success: true,
            cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving cart",
            error: error.message
        });
    }
};

// Add item to cart
const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { menuItemId, quantity } = req.body;

        if (!menuItemId || !quantity) {
            return res.status(400).json({
                success: false,
                message: "menuItemId and quantity are required"
            });
        }

        // Verify menu item exists
        const menuItem = await MenuItem.findById(menuItemId);
        if (!menuItem) {
            return res.status(404).json({
                success: false,
                message: "Menu item not found"
            });
        }

        if (!menuItem.isAvailable) {
            return res.status(400).json({
                success: false,
                message: "Menu item is not available"
            });
        }

        // Find or create cart
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [], totalPrice: 0 });
        }

        // Check if item already exists in cart
        const existingItemIndex = cart.items.findIndex(
            item => item.menuItemId.toString() === menuItemId
        );

        if (existingItemIndex > -1) {
            // Update quantity if item exists
            cart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item to cart
            cart.items.push({
                menuItemId: menuItem._id,
                name: menuItem.name,
                price: menuItem.price,
                quantity
            });
        }

        // Calculate total price
        cart.calculateTotal();

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Item added to cart",
            cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error adding item to cart",
            error: error.message
        });
    }
};

// Update item quantity in cart
const updateCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 0) {
            return res.status(400).json({
                success: false,
                message: "Valid quantity is required"
            });
        }

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        const itemIndex = cart.items.findIndex(
            item => item._id.toString() === itemId
        );

        if (itemIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Item not found in cart"
            });
        }

        if (quantity === 0) {
            // Remove item if quantity is 0
            cart.items.splice(itemIndex, 1);
        } else {
            // Update quantity
            cart.items[itemIndex].quantity = quantity;
        }

        // Calculate total price
        cart.calculateTotal();

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Cart updated successfully",
            cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating cart",
            error: error.message
        });
    }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { itemId } = req.params;

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        cart.items = cart.items.filter(
            item => item._id.toString() !== itemId
        );

        // Calculate total price
        cart.calculateTotal();

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Item removed from cart",
            cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error removing item from cart",
            error: error.message
        });
    }
};

// Clear entire cart
const clearCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        cart.items = [];
        cart.totalPrice = 0;

        await cart.save();

        res.status(200).json({
            success: true,
            message: "Cart cleared successfully",
            cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error clearing cart",
            error: error.message
        });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};
