const Restaurant = require('../models/restaurant.model');

const addRestaurantDetails = async (req, res) => {
    try {
        const restaurant = await Restaurant.create(req.body);
        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateRestaurantDetails = async (req, res) => {
    try {
        const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getRestaurantDetails = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    addRestaurantDetails,
    updateRestaurantDetails,
    getRestaurantDetails
}