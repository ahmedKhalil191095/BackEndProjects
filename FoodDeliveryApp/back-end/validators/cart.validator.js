const Joi = require('joi');

// Validation schema for adding item to cart
const addToCartSchema = Joi.object({
    // MongoDB ObjectId validation
    menuItemId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'Invalid menu item ID format',
            'any.required': 'Menu item ID is required'
        }),

    // CRITICAL SECURITY: Quantity must be positive integer
    quantity: Joi.number()
        .integer()
        .positive()
        .min(1)
        .max(100)
        .required()
        .messages({
            'number.base': 'Quantity must be a number',
            'number.integer': 'Quantity must be a whole number',
            'number.positive': 'Quantity must be greater than 0',
            'number.min': 'Quantity must be at least 1',
            'number.max': 'Quantity cannot exceed 100',
            'any.required': 'Quantity is required'
        })
});

// Validation schema for updating cart item
const updateCartItemSchema = Joi.object({
    quantity: Joi.number()
        .integer()
        .min(0)
        .max(100)
        .required()
        .messages({
            'number.base': 'Quantity must be a number',
            'number.integer': 'Quantity must be a whole number',
            'number.min': 'Quantity cannot be negative',
            'number.max': 'Quantity cannot exceed 100',
            'any.required': 'Quantity is required'
        })
});

// Validation schema for cart item ID parameter
const cartItemIdSchema = Joi.object({
    itemId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'Invalid item ID format',
            'any.required': 'Item ID is required'
        })
});

module.exports = {
    addToCartSchema,
    updateCartItemSchema,
    cartItemIdSchema
};
