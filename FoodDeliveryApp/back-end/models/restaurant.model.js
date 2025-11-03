const mongoose = require('mongoose');

// Sub-schema for daily operating hours
const dailyHoursSchema = new mongoose.Schema({
    open: {
        type: String,  // Format: "HH:MM" (24-hour format, e.g., "09:00")
        required: true
    },
    close: {
        type: String,  // Format: "HH:MM" (e.g., "22:00")
        required: true
    },
    isClosed: {
        type: Boolean,
        default: false  // true if restaurant is closed that day
    }
}, { _id: false });

const restaurantSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    description: {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    phone : {
        type : String,
        required : true
    },
    address : {
        type : String,
        required : true
    },
    // Operating hours for each day of the week
    operatingHours: {
        monday: {
            type: dailyHoursSchema,
            default: { open: "09:00", close: "22:00", isClosed: false }
        },
        tuesday: {
            type: dailyHoursSchema,
            default: { open: "09:00", close: "22:00", isClosed: false }
        },
        wednesday: {
            type: dailyHoursSchema,
            default: { open: "09:00", close: "22:00", isClosed: false }
        },
        thursday: {
            type: dailyHoursSchema,
            default: { open: "09:00", close: "22:00", isClosed: false }
        },
        friday: {
            type: dailyHoursSchema,
            default: { open: "09:00", close: "23:00", isClosed: false }
        },
        saturday: {
            type: dailyHoursSchema,
            default: { open: "09:00", close: "23:00", isClosed: false }
        },
        sunday: {
            type: dailyHoursSchema,
            default: { open: "10:00", close: "21:00", isClosed: false }
        }
    },
    // Current status
    isOpen: {
        type: Boolean,
        default: true  // Can be manually toggled
    },
    // Business settings
    minimumOrder: {
        type: Number,
        default: 0  // Minimum order amount in dollars
    },
    deliveryFee: {
        type: Number,
        default: 5.00  // Delivery fee in dollars
    },
    estimatedDeliveryTime: {
        type: Number,
        default: 30  // Estimated delivery time in minutes
    },
    // Additional info
    cuisine: {
        type: [String],  // Array of cuisines: ['Italian', 'Pizza', 'Pasta']
        default: []
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    totalReviews: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Helper method to check if restaurant is currently open
restaurantSchema.methods.isCurrentlyOpen = function() {
    if (!this.isOpen) {
        return false;  // Manually closed
    }

    const now = new Date();
    const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][now.getDay()];
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const todayHours = this.operatingHours[dayOfWeek];

    if (!todayHours || todayHours.isClosed) {
        return false;
    }

    return currentTime >= todayHours.open && currentTime <= todayHours.close;
};

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
module.exports = Restaurant;
