import express from 'express';
import { getMessagesWithUser, sendMessage, getConversations } from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/conversations', protect, getConversations);
router.get('/:userId', protect, getMessagesWithUser);
router.post('/', protect, sendMessage);

export default router;
