import express from 'express';
import { getSpeakers, getSpeakerById, createSpeaker, updateSpeaker, deleteSpeaker } from '../controllers/speakerController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleCheck.js';

const router = express.Router();

router.get('/', getSpeakers);
router.get('/:id', getSpeakerById);
router.post('/', protect, authorize('admin'), createSpeaker);
router.put('/:id', protect, authorize('admin'), updateSpeaker);
router.delete('/:id', protect, authorize('admin'), deleteSpeaker);

export default router;
