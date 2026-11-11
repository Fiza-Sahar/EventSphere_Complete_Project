import Favorite from '../models/Favorite.js';

export const getMyFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ userId: req.user._id });
    res.json(favorites);
  } catch (err) {
    next(err);
  }
};

export const addFavorite = async (req, res, next) => {
  try {
    const { itemType, itemId, title, subtitle, location, category, metadata } = req.body;
    
    // Check if already favorited
    let fav = await Favorite.findOne({ userId: req.user._id, itemType, itemId });
    if (fav) {
      return res.json({ message: 'Already favorited', favorite: fav });
    }

    fav = await Favorite.create({
      userId: req.user._id,
      itemType,
      itemId,
      title,
      subtitle,
      location,
      category,
      metadata
    });

    res.status(201).json({ message: 'Added to favorites', favorite: fav });
  } catch (err) {
    next(err);
  }
};

export const removeFavorite = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Favorite.findOneAndDelete({ _id: id, userId: req.user._id });
    res.json({ message: 'Removed from favorites' });
  } catch (err) {
    next(err);
  }
};

export const toggleFavorite = async (req, res, next) => {
  try {
    const { itemType, itemId, title, subtitle, location, category, metadata } = req.body;
    const existing = await Favorite.findOne({ userId: req.user._id, itemType, itemId });

    if (existing) {
      await Favorite.findByIdAndDelete(existing._id);
      return res.json({ favorited: false, message: 'Removed from favorites' });
    }

    const fav = await Favorite.create({
      userId: req.user._id,
      itemType,
      itemId,
      title,
      subtitle,
      location,
      category,
      metadata
    });

    res.json({ favorited: true, message: 'Added to favorites', favorite: fav });
  } catch (err) {
    next(err);
  }
};
