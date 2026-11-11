import Expo from '../models/Expo.js';

export const getExpos = async (req, res, next) => {
  try {
    const { status, category, search } = req.query;
    let query = {};

    if (status) query.status = status;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const expos = await Expo.find(query).sort({ startDate: 1 });
    res.json(expos);
  } catch (error) {
    next(error);
  }
};

export const getExpoById = async (req, res, next) => {
  try {
    const expo = await Expo.findById(req.params.id);
    if (!expo) return res.status(404).json({ message: 'Expo not found' });
    res.json(expo);
  } catch (error) {
    next(error);
  }
};

export const createExpo = async (req, res, next) => {
  try {
    const { title, description, theme, location, startDate, endDate, image, capacity, category } = req.body;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();

    const expo = await Expo.create({
      title,
      slug,
      description,
      theme,
      location,
      startDate,
      endDate,
      image,
      capacity,
      category,
      organizer: req.user._id
    });

    res.status(201).json(expo);
  } catch (error) {
    next(error);
  }
};

export const updateExpo = async (req, res, next) => {
  try {
    const expo = await Expo.findById(req.params.id);
    if (!expo) return res.status(404).json({ message: 'Expo not found' });

    Object.assign(expo, req.body);
    await expo.save();
    res.json(expo);
  } catch (error) {
    next(error);
  }
};

export const deleteExpo = async (req, res, next) => {
  try {
    const expo = await Expo.findById(req.params.id);
    if (!expo) return res.status(404).json({ message: 'Expo not found' });

    await expo.deleteOne();
    res.json({ message: 'Expo deleted successfully' });
  } catch (error) {
    next(error);
  }
};
