import { ApiError } from '../utils/apiError.js';

/**
 * Middleware factory for validating incoming request payloads
 * @param {Function} validator - function returning { isValid: boolean, error: string }
 */
export const validateBody = (validator) => {
  return (req, res, next) => {
    const { isValid, error } = validator(req.body);
    if (!isValid) {
      return next(ApiError.badRequest(error));
    }
    next();
  };
};

/**
 * Message payload validator
 */
export const validateChatMessage = (body) => {
  if (!body || typeof body !== 'object') {
    return { isValid: false, error: 'Request body must be a JSON object' };
  }
  if (!body.message || typeof body.message !== 'string' || !body.message.trim()) {
    return { isValid: false, error: 'Message content is required and cannot be empty' };
  }
  return { isValid: true };
};
