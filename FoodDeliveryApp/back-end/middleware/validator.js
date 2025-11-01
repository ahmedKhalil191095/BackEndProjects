// Validation middleware to validate request data against Joi schemas

const validate = (schema) => {
    return (req, res, next) => {
        // Validate request body against the schema
        const { error, value } = schema.validate(req.body, {
            abortEarly: false, // Return all errors, not just the first one
            stripUnknown: true // Remove fields that aren't in the schema (security)
        });

        if (error) {
            // Format error messages
            const errorMessages = error.details.map(detail => detail.message);

            return res.status(400).json({
                success: false,
                message: "Validation error",
                errors: errorMessages
            });
        }

        // Replace req.body with validated and sanitized data
        req.body = value;
        next();
    };
};

// Validate URL parameters (like :id)
const validateParams = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.params, {
            abortEarly: false
        });

        if (error) {
            const errorMessages = error.details.map(detail => detail.message);

            return res.status(400).json({
                success: false,
                message: "Invalid parameters",
                errors: errorMessages
            });
        }

        req.params = value;
        next();
    };
};

// Validate query parameters (like ?page=1&limit=10)
const validateQuery = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.query, {
            abortEarly: false
        });

        if (error) {
            const errorMessages = error.details.map(detail => detail.message);

            return res.status(400).json({
                success: false,
                message: "Invalid query parameters",
                errors: errorMessages
            });
        }

        req.query = value;
        next();
    };
};

module.exports = {
    validate,
    validateParams,
    validateQuery
};
