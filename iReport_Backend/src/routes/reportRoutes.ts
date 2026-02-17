import { Router } from 'express';
import {
  getAllReports,
  getReportById,
  createReport,
  updateReport,
  addComment,
  deleteReport,
  getAllLiveReports,
  createLiveReport,
  updateLiveReport
} from '../controllers/reportController';
import { authenticate, authorize } from '../middleware/auth';
import { validateCreateReport, validateCreateLiveReport, validateAddComment } from '../middleware/validation';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

// Regular Reports
router.get('/', authenticate, asyncHandler(getAllReports));
router.get('/:id', authenticate, asyncHandler(getReportById));
router.post('/', authenticate, validateCreateReport, asyncHandler(createReport));
router.put('/:id', authenticate, authorize(['admin', 'teacher']), asyncHandler(updateReport));
router.post('/:id/comments', authenticate, validateAddComment, asyncHandler(addComment));
router.delete('/:id', authenticate, authorize(['admin']), asyncHandler(deleteReport));

// Live Reports
router.get('/live/all', authenticate, asyncHandler(getAllLiveReports));
router.post('/live/create', authenticate, validateCreateLiveReport, asyncHandler(createLiveReport));
router.put('/live/:id', authenticate, authorize(['admin', 'teacher']), asyncHandler(updateLiveReport));

export default router;
