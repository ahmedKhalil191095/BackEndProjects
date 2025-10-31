const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
    menuItemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MenuItem",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    }
});

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },
    items: [cartItemSchema],
    totalPrice: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
});

// Method to calculate total price
cartSchema.methods.calculateTotal = function() {
    this.totalPrice = this.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
    return this.totalPrice;
};

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
