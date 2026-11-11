import express from 'express';
import { getMyFavorites, addFavorite, removeFavorite, toggleFavorite } from '../controllers/favoriteController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getMyFavorites)
  .post(addFavorite);

router.post('/toggle', toggleFavorite);
router.delete('/:id', removeFavorite);

export default router;
