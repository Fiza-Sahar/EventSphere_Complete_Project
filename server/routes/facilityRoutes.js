import express from 'express';
import { getFacilities, createFacility } from '../controllers/facilityController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getFacilities)
  .post(protect, authorize('admin'), createFacility);

export default router;
