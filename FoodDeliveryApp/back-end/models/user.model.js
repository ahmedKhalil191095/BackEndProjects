const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({

    userId: {
        type: Number,
        unique: true,  // Ensure uniqueness
    },
    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    role:{ // "customer", "admin"
        type: String,
        required: true,
        default: 'customer'
    },
    phone: {
        type: String,
        required: true
    },
    addresses: [{
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
        label: {
            type: String,
            enum: ['Home', 'Work', 'Other'],
            default: 'Home'
        },
        isDefault: {
            type: Boolean,
            default: false
        },
        // For delivery routing and distance calculation
        coordinates: {
            latitude: Number,
            longitude: Number
        }
    }]
  },
  {
    timestamps: true
  }
);

// Auto-increment userId before saving
userSchema.pre("validate", async function (next) {
    if (this.userId) return next();

    // Find the last user based on userId (sorted in descending order)
    const lastUser = await this.constructor.findOne().sort({ userId: -1 });

    // Ensure userId is always a number
    this.userId = lastUser && lastUser.userId ? lastUser.userId + 1 : 1;

    console.log(`Generated userId: ${this.userId}`); // Debugging log
    next();
});
const User = mongoose.model('Users', userSchema);
module.exports = User;