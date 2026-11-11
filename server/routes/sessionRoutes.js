import express from 'express';
import { getSessions, getSessionById, createSession, updateSession, deleteSession, registerForSession } from '../controllers/sessionController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';

const router = express.Router();

router.get('/', getSessions);
router.get('/:id', getSessionById);
router.post('/', protect, authorize('admin'), createSession);
router.put('/:id', protect, authorize('admin'), updateSession);
router.delete('/:id', protect, authorize('admin'), deleteSession);
router.post('/:id/register', protect, registerForSession);

export default router;
