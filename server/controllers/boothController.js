import Booth from '../models/Booth.js';
import Exhibitor from '../models/Exhibitor.js';
import Notification from '../models/Notification.js';

export const getBooths = async (req, res, next) => {
  try {
    const { expoId, status, category } = req.query;
    let query = {};
    if (expoId) query.expoId = expoId;
    if (status) query.status = status;
    if (category) query.category = category;

    const booths = await Booth.find(query).populate('exhibitorId');
    res.json(booths);
  } catch (error) {
    next(error);
  }
};

export const getBoothById = async (req, res, next) => {
  try {
    const booth = await Booth.findById(req.params.id).populate('exhibitorId');
    if (!booth) return res.status(404).json({ message: 'Booth not found' });
    res.json(booth);
  } catch (error) {
    next(error);
  }
};

export const createBooth = async (req, res, next) => {
  try {
    const booth = await Booth.create(req.body);

    const io = req.app.get('io');
    if (io) {
      io.emit('booth_created', booth);
    }

    res.status(201).json(booth);
  } catch (error) {
    next(error);
  }
};

export const updateBooth = async (req, res, next) => {
  try {
    const booth = await Booth.findById(req.params.id);
    if (!booth) return res.status(404).json({ message: 'Booth not found' });

    Object.assign(booth, req.body);
    await booth.save();

    // If exhibitor is linked, sync boothNumber
    if (booth.exhibitorId) {
      await Exhibitor.findByIdAndUpdate(booth.exhibitorId, { 
        boothId: booth._id, 
        boothNumber: booth.boothNumber 
      });
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('booth_updated', booth);
    }

    res.json(booth);
  } catch (error) {
    next(error);
  }
};

export const deleteBooth = async (req, res, next) => {
  try {
    const booth = await Booth.findById(req.params.id);
    if (!booth) return res.status(404).json({ message: 'Booth not found' });

    await booth.deleteOne();

    const io = req.app.get('io');
    if (io) {
      io.emit('booth_deleted', { id: req.params.id });
    }

    res.json({ message: 'Booth deleted' });
  } catch (error) {
    next(error);
  }
};

export const assignBooth = async (req, res, next) => {
  try {
    const { boothId, exhibitorId } = req.body;

    const booth = await Booth.findById(boothId);
    if (!booth) return res.status(404).json({ message: 'Booth not found' });

    const exhibitor = await Exhibitor.findById(exhibitorId);
    if (!exhibitor) return res.status(404).json({ message: 'Exhibitor not found' });

    booth.exhibitorId = exhibitor._id;
    booth.companyName = exhibitor.companyName;
    booth.description = exhibitor.description;
    booth.category = exhibitor.category;
    booth.status = 'OCCUPIED';
    await booth.save();

    exhibitor.boothId = booth._id;
    exhibitor.boothNumber = booth.boothNumber;
    await exhibitor.save();

    const io = req.app.get('io');
    if (io) {
      io.emit('booth_updated', booth);
    }

    res.json({ message: 'Booth assigned successfully', booth, exhibitor });
  } catch (error) {
    next(error);
  }
};

// Apply or Reserve an AVAILABLE booth
export const applyOrReserveBooth = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { companyName, category, description, products } = req.body;
    const userId = req.user._id;

    const booth = await Booth.findById(id);
    if (!booth) return res.status(404).json({ message: 'Booth not found' });

    if (booth.status === 'OCCUPIED') {
      return res.status(400).json({ message: 'This booth is already occupied' });
    }

    booth.companyName = companyName || req.user.company || req.user.name;
    booth.category = category || booth.category;
    booth.description = description || `Reserved by ${booth.companyName}`;
    booth.status = 'RESERVED';
    if (products) booth.products = products;
    await booth.save();

    // Check if exhibitor record exists or create one
    let exhibitor = await Exhibitor.findOne({ userId, expoId: booth.expoId });
    if (!exhibitor) {
      exhibitor = await Exhibitor.create({
        userId,
        expoId: booth.expoId,
        companyName: booth.companyName,
        category: booth.category,
        description: booth.description,
        boothId: booth._id,
        boothNumber: booth.boothNumber,
        status: 'approved'
      });
    } else {
      exhibitor.boothId = booth._id;
      exhibitor.boothNumber = booth.boothNumber;
      await exhibitor.save();
    }

    booth.exhibitorId = exhibitor._id;
    await booth.save();

    // Create confirmation notification
    await Notification.create({
      userId,
      title: 'Booth Reservation Confirmed',
      message: `Your reservation application for Booth ${booth.boothNumber} has been received and confirmed.`,
      type: 'success'
    });

    const io = req.app.get('io');
    if (io) {
      io.emit('booth_updated', booth);
    }

    res.json({
      message: `Booth ${booth.boothNumber} reserved successfully!`,
      booth
    });
  } catch (error) {
    next(error);
  }
};
