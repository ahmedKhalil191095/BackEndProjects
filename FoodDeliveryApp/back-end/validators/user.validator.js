const Joi = require('joi');

// Validation schema for user signup
const userSignupSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.min': 'Name must be at least 2 characters long',
            'string.max': 'Name cannot exceed 50 characters',
            'any.required': 'Name is required'
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

    password: Joi.string()
        .min(8)
        .max(100)
        .required()
        .messages({
            'string.min': 'Password must be at least 8 characters long',
            'any.required': 'Password is required'
        }),

    phone: Joi.string()
        .pattern(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/)
        .required()
        .messages({
            'string.pattern.base': 'Please provide a valid phone number',
            'any.required': 'Phone number is required'
        }),

    addresses: Joi.string()
        .min(5)
        .max(200)
        .required()
        .messages({
            'string.min': 'Address must be at least 5 characters long',
            'any.required': 'Address is required'
        }),

    // CRITICAL SECURITY: Don't allow users to set their own role!
    // Role will be set to "customer" by default in the controller
    role: Joi.string()
        .valid('customer')
        .default('customer')
        .messages({
            'any.only': 'Invalid role. Only "customer" role is allowed during signup'
        })
});

// Validation schema for user login
const userLoginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .lowercase()
        .trim()
        .messages({
            'string.email': 'Please provide a valid email address',
            'any.required': 'Email is required'
        }),

    password: Joi.string()
        .required()
        .messages({
            'any.required': 'Password is required'
        })
});

// Validation schema for updating user
const userUpdateSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(50)
        .optional()
        .messages({
            'string.min': 'Name must be at least 2 characters long',
            'string.max': 'Name cannot exceed 50 characters'
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

    addresses: Joi.string()
        .min(5)
        .max(200)
        .optional()
        .messages({
            'string.min': 'Address must be at least 5 characters long'
        }),

    // Don't allow users to update their own role
    role: Joi.forbidden().messages({
        'any.unknown': 'You cannot update your role'
    })
}).min(1).messages({
    'object.min': 'At least one field must be provided for update'
});

// Validation schema for MongoDB ObjectId parameters
const objectIdSchema = Joi.object({
    id: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'Invalid ID format',
            'any.required': 'ID is required'
        })
});

module.exports = {
    userSignupSchema,
    userLoginSchema,
    userUpdateSchema,
    objectIdSchema
};
