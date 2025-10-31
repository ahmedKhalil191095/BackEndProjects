const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const e = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const mySecret = process.env.MY_SECRET;
const saltRounds = parseInt(process.env.SALT_ROUNDS);

const login = async (req, res) => {

    try {
        // console.log(req.body);
        const {email} = req.body;
        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!(await bcrypt.compare(mySecret + req.body.password, user.password))) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const accessToken = await jwt.sign({
            id: user._id,
            userId: user.userId,
            email: user.email,
            role: user.role
        }, process.env.ACCESS_TOKEN_SECRET);
        res.json({ accessToken : accessToken });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }   

}

module.exports = {
    login
}