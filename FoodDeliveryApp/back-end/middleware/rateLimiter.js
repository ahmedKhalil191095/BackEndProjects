const rateLimit = require('express-rate-limit');

// STRICT Rate Limiter for Login Endpoint
// Prevents brute force password attacks
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: {
        success: false,
        message: 'Too many login attempts from this IP. Please try again after 15 minutes.'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    // Skip successful requests (only count failed login attempts)
    skipSuccessfulRequests: false,
    // Skip failed requests (count all requests)
    skipFailedRequests: false,
});

// MODERATE Rate Limiter for Signup Endpoint
// Prevents spam account creation
const signupLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // Limit each IP to 3 signups per hour
    message: {
        success: false,
        message: 'Too many accounts created from this IP. Please try again after an hour.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// MODERATE Rate Limiter for Password Reset/Refresh Token
// Prevents token abuse
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per 15 minutes
    message: {
        success: false,
        message: 'Too many requests from this IP. Please try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// GENERAL Rate Limiter for All API Endpoints
// Prevents DDoS and API abuse
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per 15 minutes
    message: {
        success: false,
        message: 'Too many requests from this IP. Please slow down and try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// STRICT Rate Limiter for Cart/Order Operations
// Prevents cart spam and fake orders
const orderLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Limit each IP to 50 order operations per 15 minutes
    message: {
        success: false,
        message: 'Too many order operations. Please try again after 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    loginLimiter,
    signupLimiter,
    authLimiter,
    generalLimiter,
    orderLimiter
};
