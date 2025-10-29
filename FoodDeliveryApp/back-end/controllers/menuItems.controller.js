const menuItems = require('../models/menuItems.model');

const getAllmenuItems = async (req, res) => {
    try {
        const menuItems = await menuItems.find();
        if (!menuItems) {
            return res.status(404).json({ message: 'No food items found' });
        }
        res.json(menuItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getItemById = async (req, res) => {
    try {
        const Item = await menuItems.findById(req.params.id);
        if (!Item) {
            return res.status(404).json({ message: 'No food items found' });
        }
        res.json(Item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const addFoodItem = async (req, res) => {
    try {
        const Item = await menuItems.create(req.body);
        if (!Item) {
            return res.status(404).json({ message: 'No food items found' });
        }
        res.json(Item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateFoodItem = async (req, res) => {
    try {
        const Item = await menuItems.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!Item) {
            return res.status(404).json({ message: 'No food items found' });
        }
        res.json(Item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const deleteFoodItem = async (req, res) => {
    try {
        const Item = await menuItems.findByIdAndDelete(req.params.id);
        if (!Item) {
            return res.status(404).json({ message: 'No food items found' });
        }
        res.json({ message: 'Food item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports = {
    getAllmenuItems,
    getItemById,
    addFoodItem,
    updateFoodItem,
    deleteFoodItem
}