const mongoose = require('mongoose');

const menuItemsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
}
});

const MenuItem = mongoose.model('MenuItem', menuItemsSchema);
module.exports = MenuItem;