const Joi = require('joi');

// Validation schema for creating a menu item
const createMenuItemSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.min': 'Item name must be at least 2 characters long',
            'string.max': 'Item name cannot exceed 100 characters',
            'any.required': 'Item name is required'
        }),

    description: Joi.string()
        .min(5)
        .max(500)
        .required()
        .messages({
            'string.min': 'Description must be at least 5 characters long',
            'string.max': 'Description cannot exceed 500 characters',
            'any.required': 'Description is required'
        }),

    // CRITICAL SECURITY: Price must be positive
    price: Joi.number()
        .positive()
        .precision(2)
        .required()
        .messages({
            'number.base': 'Price must be a number',
            'number.positive': 'Price must be greater than 0',
            'any.required': 'Price is required'
        }),

    image: Joi.string()
        .uri()
        .required()
        .messages({
            'string.uri': 'Image must be a valid URL',
            'any.required': 'Image URL is required'
        }),

    category: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.min': 'Category must be at least 2 characters long',
            'string.max': 'Category cannot exceed 50 characters',
            'any.required': 'Category is required'
        }),

    restaurantId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'Invalid restaurant ID format',
            'any.required': 'Restaurant ID is required'
        }),

    isAvailable: Joi.boolean()
        .default(true)
        .messages({
            'boolean.base': 'isAvailable must be true or false'
        })
});

// Validation schema for getting menu items with query parameters
const getMenuItemsSchema = Joi.object({
    restaurantId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .optional()
        .messages({
            'string.pattern.base': 'Invalid restaurant ID format'
        })
});

// Validation schema for updating a menu item
const updateMenuItemSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .optional()
        .messages({
            'string.min': 'Item name must be at least 2 characters long',
            'string.max': 'Item name cannot exceed 100 characters'
        }),

    description: Joi.string()
        .min(5)
        .max(500)
        .optional()
        .messages({
            'string.min': 'Description must be at least 5 characters long',
            'string.max': 'Description cannot exceed 500 characters'
        }),

    price: Joi.number()
        .positive()
        .precision(2)
        .optional()
        .messages({
            'number.base': 'Price must be a number',
            'number.positive': 'Price must be greater than 0'
        }),

    image: Joi.string()
        .uri()
        .optional()
        .messages({
            'string.uri': 'Image must be a valid URL'
        }),

    category: Joi.string()
        .min(2)
        .max(50)
        .optional()
        .messages({
            'string.min': 'Category must be at least 2 characters long',
            'string.max': 'Category cannot exceed 50 characters'
        }),

    restaurantId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .optional()
        .messages({
            'string.pattern.base': 'Invalid restaurant ID format'
        }),

    isAvailable: Joi.boolean()
        .optional()
        .messages({
            'boolean.base': 'isAvailable must be true or false'
        })
}).min(1).messages({
    'object.min': 'At least one field must be provided for update'
});

module.exports = {
    createMenuItemSchema,
    updateMenuItemSchema,
    getMenuItemsSchema
};
