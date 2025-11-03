const User = require('../models/user.model');
const TokenBlacklist = require('../models/tokenBlacklist.model');
const bcrypt = require('bcrypt');
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

        // Create Access Token (expires in 15 minutes)
        const accessToken = jwt.sign({
            id: user._id,
            userId: user.userId,
            email: user.email,
            role: user.role
        }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '60m'  // Token expires in 15 minutes
        });

        // Create Refresh Token (expires in 7 days)
        const refreshToken = jwt.sign({
            id: user._id,
            userId: user.userId,
            email: user.email,
            role: user.role
        }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '7d'  // Token expires in 7 days
        });

        res.json({
            accessToken: accessToken,
            refreshToken: refreshToken,
            expiresIn: 900  // 15 minutes in seconds (optional, for client info)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }   

}

// Refresh access token using refresh token
const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token is required'
            });
        }

        // Check if token is blacklisted (user logged out)
        const blacklistedToken = await TokenBlacklist.findOne({ token: refreshToken });

        if (blacklistedToken) {
            return res.status(403).json({
                success: false,
                message: 'Token has been revoked. Please login again.'
            });
        }

        // Verify refresh token
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: 'Invalid or expired refresh token'
                });
            }

            // Get user from database to ensure they still exist
            const user = await User.findById(decoded.id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Create new Access Token (expires in 15 minutes)
            const newAccessToken = jwt.sign({
                id: user._id,
                userId: user.userId,
                email: user.email,
                role: user.role
            }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '60m'
            });

            // Create new Refresh Token (expires in 7 days)
            const newRefreshToken = jwt.sign({
                id: user._id,
                userId: user.userId,
                email: user.email,
                role: user.role
            }, process.env.REFRESH_TOKEN_SECRET, {
                expiresIn: '7d'
            });

            res.json({
                success: true,
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
                expiresIn: 900
            });
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Logout - blacklist refresh token
const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token is required'
            });
        }

        // Verify the token is valid before blacklisting
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                // Even if token is invalid/expired, we can still try to blacklist it
                return res.status(200).json({
                    success: true,
                    message: 'Logged out successfully'
                });
            }

            // Check if already blacklisted
            const existingBlacklist = await TokenBlacklist.findOne({ token: refreshToken });

            if (existingBlacklist) {
                return res.status(200).json({
                    success: true,
                    message: 'Already logged out'
                });
            }

            // Add token to blacklist
            const blacklistEntry = new TokenBlacklist({
                token: refreshToken,
                userId: decoded.id,
                reason: 'logout',
                expiresAt: new Date(decoded.exp * 1000) // Convert JWT exp to Date
            });

            await blacklistEntry.save();

            res.json({
                success: true,
                message: 'Logged out successfully'
            });
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    login,
    refreshAccessToken,
    logout
}