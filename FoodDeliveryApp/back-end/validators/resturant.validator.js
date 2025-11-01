const Joi = require('joi');

// Validation schema for creating restaurant
const createRestaurantSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.min': 'Restaurant name must be at least 2 characters long',
            'string.max': 'Restaurant name cannot exceed 100 characters',
            'any.required': 'Restaurant name is required'
        }),

    description: Joi.string()
        .min(10)
        .max(500)
        .required()
        .messages({
            'string.min': 'Description must be at least 10 characters long',
            'string.max': 'Description cannot exceed 500 characters',
            'any.required': 'Description is required'
        }),

    email: Joi.string()
        .email()
        .required()
        .lowercase()
        .trim()
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        }),

    phone: Joi.string()
        .pattern(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/)
        .required()
        .messages({
            'string.pattern.base': 'Please provide a valid phone number',
            'any.required': 'Phone number is required'
        }),

    address: Joi.string()
        .min(10)
        .max(300)
        .required()
        .messages({
            'string.min': 'Address must be at least 10 characters long',
            'string.max': 'Address cannot exceed 300 characters',
            'any.required': 'Address is required'
        })
});

// Validation schema for updating restaurant
const updateRestaurantSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .optional()
        .messages({
            'string.min': 'Restaurant name must be at least 2 characters long',
            'string.max': 'Restaurant name cannot exceed 100 characters'
        }),

    description: Joi.string()
        .min(10)
        .max(500)
        .optional()
        .messages({
            'string.min': 'Description must be at least 10 characters long',
            'string.max': 'Description cannot exceed 500 characters'
        }),

    email: Joi.string()
        .email()
        .optional()
        .lowercase()
        .trim()
        .messages({
            'string.email': 'Please provide a valid email address'
        }),

    phone: Joi.string()
        .pattern(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/)
        .optional()
        .messages({
            'string.pattern.base': 'Please provide a valid phone number'
        }),

    address: Joi.string()
        .min(10)
        .max(300)
        .optional()
        .messages({
            'string.min': 'Address must be at least 10 characters long',
            'string.max': 'Address cannot exceed 300 characters'
        })
}).min(1).messages({
    'object.min': 'At least one field must be provided for update'
});

module.exports = {
    createRestaurantSchema,
    updateRestaurantSchema
};
