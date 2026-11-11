import express from 'express';
import { getNotifications, markAsRead, sendNotification } from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getNotifications);
router.put('/read', protect, markAsRead);
router.post('/', protect, sendNotification);

export default router;
