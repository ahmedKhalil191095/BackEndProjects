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
    role:{ // "customer", "restaurant_owner", or "admin"
        type: String,
        required: true,
        default: 'customer'
    },
    phone: {
        type: String,
        required: true
    },
    addresses: {
        type : String,
        required: true
    }
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