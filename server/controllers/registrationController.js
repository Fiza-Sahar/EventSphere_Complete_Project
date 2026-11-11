import Registration from '../models/Registration.js';
import Expo from '../models/Expo.js';
import Attendee from '../models/Attendee.js';

// Register for an Expo
export const registerForExpo = async (req, res, next) => {
  try {
    const { expoId, ticketType = 'Standard Pass' } = req.body;
    const userId = req.user._id;

    const expo = await Expo.findById(expoId);
    if (!expo) {
      return res.status(404).json({ message: 'Expo not found' });
    }

    // Check if already registered
    const existing = await Registration.findOne({ userId, expoId });
    if (existing) {
      return res.status(400).json({ 
        message: 'You are already registered for this expo!', 
        registration: existing 
      });
    }

    const ticketCode = `ESP-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const qrCodeData = `EVENTSPHERE_PASS_${userId}_${expoId}_${ticketCode}`;

    const registration = await Registration.create({
      userId,
      expoId,
      ticketType,
      ticketCode,
      status: 'active',
      qrCodeData
    });

    // Add to attendee registeredExpos
    await Attendee.findOneAndUpdate(
      { userId },
      { $addToSet: { registeredExpos: expoId } },
      { upsert: true }
    );

    const populated = await Registration.findById(registration._id)
      .populate('expoId', 'title location startDate endDate image category');

    res.status(201).json({
      message: 'Successfully registered for expo!',
      registration: populated
    });
  } catch (error) {
    next(error);
  }
};

// Get current user's registrations
export const getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find({ userId: req.user._id })
      .populate('expoId')
      .sort({ createdAt: -1 });
    res.json(registrations);
  } catch (error) {
    next(error);
  }
};

// Get all registrations (Admin)
export const getAllRegistrations = async (req, res, next) => {
  try {
    const registrations = await Registration.find()
      .populate('userId', 'name email phone company')
      .populate('expoId', 'title location startDate')
      .sort({ createdAt: -1 });
    res.json(registrations);
  } catch (error) {
    next(error);
  }
};

// Check in an attendee (Admin)
export const checkInAttendee = async (req, res, next) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: 'Registration pass not found' });
    }

    registration.status = registration.status === 'checked-in' ? 'active' : 'checked-in';
    await registration.save();

    res.json({ message: `Attendee status updated to ${registration.status}`, registration });
  } catch (error) {
    next(error);
  }
};
