const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
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
        min: 1
    }
});

const orderSchema = new mongoose.Schema({
    orderId: {
        type: Number,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant",
        required: true
    },
    items: [orderItemSchema],
    pricing: {
        subtotal: {
            type: Number,
            required: true
        },
        tax: {
            type: Number,
            required: true,
            default: 0
        },
        deliveryFee: {
            type: Number,
            required: true,
            default: 0
        },
        total: {
            type: Number,
            required: true
        }
    },
    deliveryAddress: {
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        zipCode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            default: 'USA'
        },
        coordinates: {
            latitude: Number,
            longitude: Number
        }
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"],
        default: "pending"
    },
    statusHistory: [{
        status: {
            type: String,
            enum: ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"],
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        note: String
    }],
    paymentMethod: {
        type: String,
        enum: ["cash", "card", "online"],
        default: "cash"
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    }
}, {
    timestamps: true
});

// Auto-increment orderId
orderSchema.pre("save", async function(next) {
    if (this.isNew) {
        try {
            const lastOrder = await this.constructor.findOne().sort({ orderId: -1 });
            this.orderId = lastOrder ? lastOrder.orderId + 1 : 1;

            // Add initial status to history
            this.statusHistory.push({
                status: this.status,
                timestamp: new Date(),
                note: "Order created"
            });
        } catch (error) {
            return next(error);
        }
    } else if (this.isModified('status')) {
        // Track status changes
        this.statusHistory.push({
            status: this.status,
            timestamp: new Date()
        });
    }
    next();
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
