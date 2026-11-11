import express from 'express';
import { getExhibitors, getExhibitorById, createExhibitor, updateExhibitor, updateExhibitorStatus } from '../controllers/exhibitorController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';

const router = express.Router();

router.get('/', getExhibitors);
router.get('/:id', getExhibitorById);
router.post('/', protect, createExhibitor);
router.put('/:id', protect, updateExhibitor);
router.put('/:id/status', protect, authorize('admin'), updateExhibitorStatus);

export default router;
