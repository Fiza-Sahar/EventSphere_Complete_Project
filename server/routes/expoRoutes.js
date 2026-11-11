import express from 'express';
import { getExpos, getExpoById, createExpo, updateExpo, deleteExpo } from '../controllers/expoController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';

const router = express.Router();

router.get('/', getExpos);
router.get('/:id', getExpoById);
router.post('/', protect, authorize('admin'), createExpo);
router.put('/:id', protect, authorize('admin'), updateExpo);
router.delete('/:id', protect, authorize('admin'), deleteExpo);

export default router;
