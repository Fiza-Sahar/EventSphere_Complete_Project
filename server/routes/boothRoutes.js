import express from 'express';
import { 
  getBooths, 
  getBoothById, 
  createBooth, 
  updateBooth, 
  deleteBooth, 
  assignBooth,
  applyOrReserveBooth
} from '../controllers/boothController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';

const router = express.Router();

router.get('/', getBooths);
router.get('/:id', getBoothById);
router.post('/', protect, authorize('admin'), createBooth);
router.post('/:id/apply', protect, applyOrReserveBooth);
router.put('/assign', protect, authorize('admin'), assignBooth);
router.put('/:id', protect, authorize('admin', 'exhibitor'), updateBooth);
router.delete('/:id', protect, authorize('admin'), deleteBooth);

export default router;
