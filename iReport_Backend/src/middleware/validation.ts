import { body, validationResult, param } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Validation middleware
export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Validation failed', details: errors.array() });
  }
  next();
};

// Auth validations
export const validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase, and number'),
  body('role').isIn(['student', 'teacher', 'admin', 'staff']).withMessage('Invalid role'),
  validateRequest
];

export const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validateRequest
];

export const validateCreateStudent = [
  body('name').trim().notEmpty().isLength({ min: 2 }).withMessage('Valid name is required'),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase, and number'),
  body('studentId').trim().notEmpty().withMessage('Student ID is required'),
  body('class').trim().notEmpty().withMessage('Class is required'),
  body('section').trim().notEmpty().withMessage('Section is required'),
  body('parentEmail').optional().isEmail(),
  body('parentPhone').optional().isMobilePhone('any'),
  validateRequest
];

export const validateCreateReport = [
  body('studentId').isMongoId().withMessage('Valid student ID is required'),
  body('reportType').isIn(['academic', 'behavior', 'incident', 'health']).withMessage('Invalid report type'),
  body('title').trim().notEmpty().isLength({ min: 3 }).withMessage('Title is required (min 3 characters)'),
  body('description').trim().notEmpty().isLength({ min: 10 }).withMessage('Description is required (min 10 characters)'),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  validateRequest
];

export const validateCreateLiveReport = [
  body('studentId').isMongoId(),
  body('reportType').isIn(['incident', 'emergency', 'observation']),
  body('title').trim().notEmpty().isLength({ min: 3 }),
  body('description').trim().notEmpty().isLength({ min: 10 }),
  body('severity').isIn(['low', 'medium', 'high', 'critical']),
  validateRequest
];

export const validatePagination = [
  param('page').optional().isInt({ min: 1 }).toInt(),
  param('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  validateRequest
];

// Add comment validation
export const validateAddComment = [
  body('text').trim().notEmpty().isLength({ min: 1, max: 1000 }).withMessage('Comment must be between 1-1000 characters'),
  validateRequest
];

// Building validation
export const validateCreateBuilding = [
  body('name').trim().notEmpty().withMessage('Building name is required'),
  body('location').optional().trim(),
  validateRequest
];

// Update profile validation
export const validateUpdateProfile = [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('phone').optional().isMobilePhone('any'),
  validateRequest
];
