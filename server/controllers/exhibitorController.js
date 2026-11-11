import Exhibitor from '../models/Exhibitor.js';
import User from '../models/User.js';

export const getExhibitors = async (req, res, next) => {
  try {
    const { expoId, status, category, search } = req.query;
    let query = {};
    if (expoId) query.expoId = expoId;
    if (status) query.status = status;
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const exhibitors = await Exhibitor.find(query).populate('userId', 'name email phone').populate('boothId');
    res.json(exhibitors);
  } catch (error) {
    next(error);
  }
};

export const getExhibitorById = async (req, res, next) => {
  try {
    const exhibitor = await Exhibitor.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('boothId')
      .populate('expoId');
    if (!exhibitor) return res.status(404).json({ message: 'Exhibitor profile not found' });
    res.json(exhibitor);
  } catch (error) {
    next(error);
  }
};

export const createExhibitor = async (req, res, next) => {
  try {
    const { companyName, logo, description, category, website, contactEmail, contactPhone, products, services, expoId } = req.body;

    const existing = await Exhibitor.findOne({ userId: req.user._id, expoId });
    if (existing) {
      return res.status(400).json({ message: 'You have already registered as an exhibitor for this expo' });
    }

    const exhibitor = await Exhibitor.create({
      userId: req.user._id,
      expoId,
      companyName,
      logo,
      description,
      category,
      website,
      contactEmail: contactEmail || req.user.email,
      contactPhone,
      products: products || [],
      services: services || [],
      status: 'pending'
    });

    res.status(201).json(exhibitor);
  } catch (error) {
    next(error);
  }
};

export const updateExhibitor = async (req, res, next) => {
  try {
    const exhibitor = await Exhibitor.findById(req.params.id);
    if (!exhibitor) return res.status(404).json({ message: 'Exhibitor not found' });

    Object.assign(exhibitor, req.body);
    await exhibitor.save();
    res.json(exhibitor);
  } catch (error) {
    next(error);
  }
};

export const updateExhibitorStatus = async (req, res, next) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    const exhibitor = await Exhibitor.findById(req.params.id);
    if (!exhibitor) return res.status(404).json({ message: 'Exhibitor not found' });

    exhibitor.status = status;
    await exhibitor.save();

    res.json({ message: `Exhibitor status updated to ${status}`, exhibitor });
  } catch (error) {
    next(error);
  }
};
