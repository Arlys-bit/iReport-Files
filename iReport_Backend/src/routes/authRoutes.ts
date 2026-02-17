import { Router } from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validateRegister, validateLogin, validateUpdateProfile } from '../middleware/validation';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.post('/register', validateRegister, asyncHandler(register));
router.post('/login', validateLogin, asyncHandler(login));
router.get('/profile', authenticate, asyncHandler(getProfile));
router.put('/profile', authenticate, validateUpdateProfile, asyncHandler(updateProfile));

export default router;
