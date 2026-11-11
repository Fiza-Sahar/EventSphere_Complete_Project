import express from 'express';
import { getMyItinerary, addItineraryItem, updateItineraryItem, deleteItineraryItem } from '../controllers/itineraryController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getMyItinerary)
  .post(addItineraryItem);

router.route('/:id')
  .put(updateItineraryItem)
  .delete(deleteItineraryItem);

export default router;
