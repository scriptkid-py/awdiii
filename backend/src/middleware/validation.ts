import { body, query, param, ValidationChain } from 'express-validator';

// User Profile Validation
export const validateCreateProfile: ValidationChain[] = [
  body('uid').notEmpty().withMessage('UID is required'),
  body('displayName')
    .notEmpty()
    .withMessage('Display name is required')
    .isLength({ max: 100 })
    .withMessage('Display name must be less than 100 characters'),
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio must be less than 500 characters'),
  body('skills')
    .isArray()
    .withMessage('Skills must be an array'),
  body('skills.*')
    .isString()
    .withMessage('Each skill must be a string'),
  body('interests')
    .optional()
    .isArray()
    .withMessage('Interests must be an array'),
  body('interests.*')
    .isString()
    .withMessage('Each interest must be a string'),
  body('availability')
    .isArray()
    .withMessage('Availability must be an array'),
  body('availability.*')
    .isString()
    .withMessage('Each availability item must be a string'),
  body('university')
    .optional()
    .isLength({ max: 100 })
    .withMessage('University name must be less than 100 characters'),
  body('year')
    .optional()
    .isString()
    .withMessage('Year must be a string'),
  body('contactInfo.email')
    .optional()
    .isEmail()
    .withMessage('Contact email must be valid'),
  body('contactInfo.phone')
    .optional()
    .isString()
    .withMessage('Phone must be a string'),
  body('contactInfo.social.linkedin')
    .optional()
    .isURL()
    .withMessage('LinkedIn URL must be valid'),
  body('contactInfo.social.instagram')
    .optional()
    .isURL()
    .withMessage('Instagram URL must be valid')
];

export const validateUpdateProfile: ValidationChain[] = [
  param('id').isMongoId().withMessage('Invalid profile ID'),
  body('displayName')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Display name must be less than 100 characters'),
  body('email')
    .optional()
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio must be less than 500 characters'),
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  body('skills.*')
    .optional()
    .isString()
    .withMessage('Each skill must be a string'),
  body('interests')
    .optional()
    .isArray()
    .withMessage('Interests must be an array'),
  body('interests.*')
    .optional()
    .isString()
    .withMessage('Each interest must be a string'),
  body('availability')
    .optional()
    .isArray()
    .withMessage('Availability must be an array'),
  body('availability.*')
    .optional()
    .isString()
    .withMessage('Each availability item must be a string'),
  body('university')
    .optional()
    .isLength({ max: 100 })
    .withMessage('University name must be less than 100 characters'),
  body('year')
    .optional()
    .isString()
    .withMessage('Year must be a string'),
  body('contactInfo.email')
    .optional()
    .isEmail()
    .withMessage('Contact email must be valid'),
  body('contactInfo.phone')
    .optional()
    .isString()
    .withMessage('Phone must be a string'),
  body('contactInfo.social.linkedin')
    .optional()
    .isURL()
    .withMessage('LinkedIn URL must be valid'),
  body('contactInfo.social.instagram')
    .optional()
    .isURL()
    .withMessage('Instagram URL must be valid')
];

// Skill Validation
export const validateCreateSkill: ValidationChain[] = [
  body('name')
    .notEmpty()
    .withMessage('Skill name is required')
    .isLength({ max: 50 })
    .withMessage('Skill name must be less than 50 characters'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isLength({ max: 50 })
    .withMessage('Category must be less than 50 characters'),
  body('level')
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Level must be beginner, intermediate, or advanced'),
  body('description')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Description must be less than 200 characters')
];

// Skill Category Validation
export const validateCreateSkillCategory: ValidationChain[] = [
  body('name')
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ max: 50 })
    .withMessage('Category name must be less than 50 characters'),
  body('description')
    .optional()
    .isLength({ max: 200 })
    .withMessage('Description must be less than 200 characters')
];

// Search Validation
export const validateSearch: ValidationChain[] = [
  query('skills')
    .optional()
    .custom((value) => {
      if (typeof value === 'string') {
        return true; // Single skill
      }
      if (Array.isArray(value)) {
        return value.every(skill => typeof skill === 'string');
      }
      return false;
    })
    .withMessage('Skills must be a string or array of strings'),
  query('availability')
    .optional()
    .custom((value) => {
      if (typeof value === 'string') {
        return true; // Single availability
      }
      if (Array.isArray(value)) {
        return value.every(avail => typeof avail === 'string');
      }
      return false;
    })
    .withMessage('Availability must be a string or array of strings'),
  query('university')
    .optional()
    .isString()
    .withMessage('University must be a string'),
  query('year')
    .optional()
    .isString()
    .withMessage('Year must be a string'),
  query('searchTerm')
    .optional()
    .isString()
    .withMessage('Search term must be a string'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
];

// Common Validations
export const validateMongoId: ValidationChain[] = [
  param('id').isMongoId().withMessage('Invalid ID format')
];
