const MenuItem = require('../models/menuItems.model');

const getAllmenuItemsForSpeecificRestaurant = async (req, res) => {
    try {
        // Build query filter - if restaurantId is provided, filter by it
        const filter = {};
        if (req.query.restaurantId) {
            filter.restaurantId = req.query.restaurantId;
        } else {
            return res.status(400).json({ message: 'restaurantId query parameter is required' });
        } 
        const items = await MenuItem.find(filter)
            .populate('restaurantId', 'name address phone rating');

        if (!items || items.length === 0) {
            return res.status(404).json({ message: 'No food items found' });
        }
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getItemById = async (req, res) => {
    try {
        const Item = await MenuItem.findById(req.params.id)
            .populate('restaurantId', 'name address phone rating operatingHours isOpen');
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
        const Item = await MenuItem.create(req.body);
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
        const Item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
        const Item = await MenuItem.findByIdAndDelete(req.params.id);
        if (!Item) {
            return res.status(404).json({ message: 'No food items found' });
        }
        res.json({ message: 'Food item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports = {
    getAllmenuItemsForSpeecificRestaurant,
    getItemById,
    addFoodItem,
    updateFoodItem,
    deleteFoodItem
}