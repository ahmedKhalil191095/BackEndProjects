const User = require('../models/user.model');
const bcrypt = require('bcrypt');
require('dotenv').config()
// const jwt = require('jsonwebtoken');
const mySecret = process.env.MY_SECRET;
const saltRounds = parseInt(process.env.SALT_ROUNDS);

// Show all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort({userId: 1}); 
        if (!users) {
            return res.status(404).json({ message: 'No users found' });
        }
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Show a user by id
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Create user (POST)
const createUser = async (req, res) => {
    try {   
        // Hash the password
        const hashedPassword = await bcrypt.hash((mySecret+req.body.password), saltRounds);
        req.body.password = hashedPassword;
        // Create the user
        const user = await User.create(req.body);
        const newUser = await User.findById(user._id);
        if (!newUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Update user (PUT)
const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
// Delete user (DELETE)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};