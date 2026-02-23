import { Router } from 'express';
import {
  getAllBuildings,
  getBuildingById,
  createBuilding,
  updateBuilding,
  deleteBuilding,
  addRoom
} from '../controllers/buildingController';
import { authenticate, authorize } from '../middleware/auth';
import { validateCreateBuilding } from '../middleware/validation';
import { asyncHandler } from '../middleware/asyncHandler';

const router = Router();

router.get('/', authenticate, asyncHandler(getAllBuildings));
router.get('/:id', authenticate, asyncHandler(getBuildingById));
router.post('/', authenticate, authorize(['admin']), validateCreateBuilding, asyncHandler(createBuilding));
router.put('/:id', authenticate, authorize(['admin']), asyncHandler(updateBuilding));
router.delete('/:id', authenticate, authorize(['admin']), asyncHandler(deleteBuilding));
router.post('/:id/rooms', authenticate, authorize(['admin']), asyncHandler(addRoom));

export default router;
