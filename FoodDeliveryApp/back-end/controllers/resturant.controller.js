const resturent = require('../models/resturant.model');

const addResturantDetails = async (req, res) => {
    try {
        const resturant = await resturent.create(req.body);
        res.json(resturant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateResturantDetails = async (req, res) => {
    try {
        const resturant = await resturent.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(resturant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getResturantDetails = async (req, res) => {
    try {
        const resturant = await resturent.findById(req.params.id);
        res.json(resturant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    addResturantDetails,
    updateResturantDetails,
    getResturantDetails
}