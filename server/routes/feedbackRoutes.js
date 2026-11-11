import express from 'express';
import { getFeedbacks, createFeedback } from '../controllers/feedbackController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getFeedbacks);
router.post('/', protect, createFeedback);

export default router;
