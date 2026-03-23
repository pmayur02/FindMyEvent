const Joi = require('joi');

// ============================================
// AUTH VALIDATIONS
// ============================================

/**
 * Validation for user registration
 */
const registerValidation = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 50 characters',
    }),
  email: Joi.string().email().required().trim().lowercase().messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required'
    }),
  password: Joi.string().min(3).max(255).required().messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 3 characters long',
      'string.max': 'Password cannot exceed 255 characters',
    })
});

/**
 * Validation for user login
 */
const loginValidation = Joi.object({
  email: Joi.string().email().required().trim().lowercase().messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email address'
    }),
  password: Joi.string().required().messages({
      'string.empty': 'Password is required'
    })
});

/**
 * Validation for updating user profile
 */
const updateProfileValidation = Joi.object({
  name: Joi.string().min(2).max(50).messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 50 characters',
    }),
  email: Joi.string().email().trim().lowercase().messages({
      'string.email': 'Please provide a valid email address',
    })
});



/**
 * Validation for user ID parameter
 */
const userIdValidation = Joi.object({
  id: Joi.number().integer().positive().required().messages({
      'number.base': 'User ID must be a number',
      'number.integer': 'User ID must be an integer',
      'number.positive': 'User ID must be a positive number',
      'any.required': 'User ID is required'
    })
});

// ============================================
// EVENT VALIDATIONS
// ============================================

/**
 * Validation for creating an event
 */
const createEventValidation = Joi.object({
  title: Joi.string().min(3).max(50).required().trim().messages({
      'string.empty': 'Event title is required',
      'string.min': 'Event title must be at least 3 characters long',
      'string.max': 'Event title cannot exceed 200 characters',
      'any.required': 'Event title is required'
    }),
  description: Joi.string().min(10).max(150).required().trim().messages({
      'string.empty': 'Event description is required',
      'string.min': 'Event description must be at least 10 characters long',
      'string.max': 'Event description cannot exceed 150 characters',
      'any.required': 'Event description is required'
    }),
  event_date: Joi.string().pattern(/^\d{2}-\d{2}-\d{4}$/).required().messages({
      'date.base': 'Please provide a valid date',
      'any.required': 'Event date is required'
    }),
  event_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/).required().messages({
      'string.empty': 'Event time is required',
      'string.pattern.base': 'Please provide a valid time in HH:MM or HH:MM:SS format',
      'any.required': 'Event time is required'
    }),
  total_capacity: Joi.number().integer().min(1).max(10000).required().messages({
      'number.base': 'Total capacity must be a number',
      'number.integer': 'Total capacity must be an integer',
      'number.min': 'Total capacity must be at least 1',
      'number.max': 'Total capacity cannot exceed 100000',
      'any.required': 'Total capacity is required'
    })
});

/**
 * Validation for updating an event
 */
const updateEventValidation = Joi.object({
  title: Joi.string().min(3).max(50).trim().messages({
      'string.min': 'Event title must be at least 3 characters long',
      'string.max': 'Event title cannot exceed 50 characters'
    }),
  description: Joi.string().min(10).max(150).trim().messages({
      'string.min': 'Event description must be at least 10 characters long',
      'string.max': 'Event description cannot exceed 2000 characters'
    }),
  event_date: Joi.string().pattern(/^\d{2}-\d{2}-\d{4}$/).messages({
      'date.base': 'Please provide a valid date',
      'any.required': 'Event date is required'
    }),
  event_time: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/).messages({
      'string.pattern.base': 'Please provide a valid time in HH:MM or HH:MM:SS format'
    }),
  total_capacity: Joi.number().integer().min(1).max(1000).messages({
      'number.base': 'Total capacity must be a number',
      'number.integer': 'Total capacity must be an integer',
      'number.min': 'Total capacity must be at least 1',
      'number.max': 'Total capacity cannot exceed 1000'
    }),
  remaining_tickets: Joi.number().integer().min(0).messages({
      'number.base': 'Remaining tickets must be a number',
      'number.integer': 'Remaining tickets must be an integer',
      'number.min': 'Remaining tickets cannot be negative'
    })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

/**
 * Validation for event ID parameter
 */
const eventIdValidation = Joi.object({
  id: Joi.number().integer().positive().required().messages({
      'number.base': 'Event ID must be a number',
      'number.integer': 'Event ID must be an integer',
      'number.positive': 'Event ID must be a positive number',
      'any.required': 'Event ID is required'
    })
});

/**
 * Validation for booking a ticket
 */
const bookTicketValidation = Joi.object({
  eventId: Joi.number().integer().positive().required().messages({
      'number.base': 'Event ID must be a number',
      'number.integer': 'Event ID must be an integer',
      'number.positive': 'Event ID must be a positive number',
      'any.required': 'Event ID is required'
    }),
  noOfTicket: Joi.number().integer().min(1).max(10).required().messages({
      'number.base': 'Number of tickets must be a number',
      'number.integer': 'Number of tickets must be an integer',
      'number.min': 'You must book at least 1 ticket',
      'number.max': 'You cannot book more than 50 tickets at once',
      'any.required': 'Number of tickets is required'
    })
});

/**
 * Validation for ticket ID parameter
 */
const ticketIdValidation = Joi.object({
  ticketId: Joi.string().required().trim().messages({
      'string.empty': 'Ticket ID is required',
      'any.required': 'Ticket ID is required'
    })
});

// ============================================
// EXPORTS
// ============================================

module.exports = {
  // Auth validations
  registerValidation,
  loginValidation,
  updateProfileValidation,
  userIdValidation,
  
  // Event validations
  createEventValidation,
  updateEventValidation,
  eventIdValidation,
  bookTicketValidation,
  ticketIdValidation
};