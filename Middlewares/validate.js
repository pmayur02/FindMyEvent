/**
 * Validation Middleware
 * 
 * This middleware validates request data against Joi schemas
 * Usage: validate(schema, 'body') or validate(schema, 'params') or validate(schema, 'query')
 */

/**
 * Generic validation middleware factory
 * @param {Object} schema - Joi validation schema
 * @param {String} property - The property to validate ('body', 'params', 'query')
 * @returns {Function} Express middleware function
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false, // Return all errors, not just the first one
      stripUnknown: true // Remove unknown keys from the validated data
    });

    if (error) {
      // Extract error messages
      const errorMessages = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        message: 'Validation error',
        errors: errorMessages
      });
    }

    // Replace request property with validated value
    req[property] = value;
    next();
  };
};

module.exports = {validate};