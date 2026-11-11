import express from 'express';
import { 
  registerForExpo, 
  getMyRegistrations, 
  getAllRegistrations, 
  checkInAttendee 
} from '../controllers/registrationController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';

const router = express.Router();

router.post('/', protect, registerForExpo);
router.get('/my', protect, getMyRegistrations);
router.get('/', protect, authorize('admin'), getAllRegistrations);
router.put('/:id/check-in', protect, authorize('admin'), checkInAttendee);

export default router;
