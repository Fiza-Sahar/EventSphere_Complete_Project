import express from 'express';
import { getFloors, createFloor } from '../controllers/floorController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getFloors)
  .post(protect, authorize('admin'), createFloor);

export default router;
