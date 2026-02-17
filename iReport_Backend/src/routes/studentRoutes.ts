import { Router } from 'express';
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentsByClass
} from '../controllers/studentController';
import { authenticate, authorize } from '../middleware/auth';
import { validateCreateStudent } from '../middleware/validation';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.get('/', authenticate, asyncHandler(getAllStudents));
router.get('/class/:className', authenticate, asyncHandler(getStudentsByClass));
router.get('/:id', authenticate, asyncHandler(getStudentById));
router.post('/', authenticate, authorize(['admin']), validateCreateStudent, asyncHandler(createStudent));
router.put('/:id', authenticate, authorize(['admin']), asyncHandler(updateStudent));
router.delete('/:id', authenticate, authorize(['admin']), asyncHandler(deleteStudent));

export default router;
