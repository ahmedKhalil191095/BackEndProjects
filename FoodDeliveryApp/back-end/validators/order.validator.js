const Joi = require('joi');

// Validation schema for placing an order
const placeOrderSchema = Joi.object({
    restaurantId: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'Invalid restaurant ID format',
            'any.required': 'Restaurant ID is required'
        }),

    deliveryAddress: Joi.object({
        street: Joi.string()
            .required()
            .messages({
                'any.required': 'Street address is required'
            }),
        city: Joi.string()
            .required()
            .messages({
                'any.required': 'City is required'
            }),
        state: Joi.string()
            .required()
            .messages({
                'any.required': 'State is required'
            }),
        zipCode: Joi.string()
            .required()
            .messages({
                'any.required': 'Zip code is required'
            }),
        country: Joi.string()
            .default('USA'),
        coordinates: Joi.object({
            latitude: Joi.number(),
            longitude: Joi.number()
        })
    }).required()
    .messages({
        'any.required': 'Delivery address is required'
    }),

    paymentMethod: Joi.string()
        .valid('cash', 'card', 'online')
        .default('cash')
        .messages({
            'any.only': 'Payment method must be cash, card, or online'
        })
});

// Validation schema for updating order status
const updateOrderStatusSchema = Joi.object({
    status: Joi.string()
        .valid('pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled')
        .required()
        .messages({
            'any.only': 'Status must be one of: pending, confirmed, preparing, out_for_delivery, delivered, cancelled',
            'any.required': 'Status is required'
        })
});

// Validation schema for updating payment status
const updatePaymentStatusSchema = Joi.object({
    paymentStatus: Joi.string()
        .valid('pending', 'paid', 'failed')
        .required()
        .messages({
            'any.only': 'Payment status must be pending, paid, or failed',
            'any.required': 'Payment status is required'
        })
});

// Validation schema for order ID parameter
const orderIdSchema = Joi.object({
    orderId: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            'number.base': 'Order ID must be a number',
            'number.integer': 'Order ID must be a whole number',
            'number.positive': 'Order ID must be positive',
            'any.required': 'Order ID is required'
        })
});

module.exports = {
    placeOrderSchema,
    updateOrderStatusSchema,
    updatePaymentStatusSchema,
    orderIdSchema
};
