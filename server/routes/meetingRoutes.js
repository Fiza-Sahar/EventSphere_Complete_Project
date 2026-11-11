import express from 'express';
import { getMeetings, createMeeting, updateMeetingStatus } from '../controllers/meetingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getMeetings)
  .post(createMeeting);

router.route('/:id/status')
  .put(updateMeetingStatus);

export default router;
