import Itinerary from '../models/Itinerary.js';

export const getMyItinerary = async (req, res, next) => {
  try {
    let items = await Itinerary.find({ userId: req.user._id }).sort({ orderIndex: 1, createdAt: 1 });
    
    // Seed default starter itinerary if empty
    if (items.length === 0) {
      const defaultItems = [
        { userId: req.user._id, expoId: '660000000000000000000001', time: '10:00 AM', title: 'Keynote: The Future of Global AI', location: 'Hall A (Arena Main Stage)', category: 'Artificial Intelligence', type: 'keynote', orderIndex: 0 },
        { userId: req.user._id, expoId: '660000000000000000000001', time: '11:30 AM', title: 'Visit TechCorp Global AI Booth', location: 'Booth A-102 (Sector A)', category: 'Exhibitor', type: 'booth', orderIndex: 1 },
        { userId: req.user._id, expoId: '660000000000000000000001', time: '01:00 PM', title: 'Executive Networking Lunch', location: 'Executive Cafe & Food Court', category: 'Dining', type: 'meal', orderIndex: 2 },
        { userId: req.user._id, expoId: '660000000000000000000001', time: '02:30 PM', title: 'Cloud Native Infrastructure Workshop', location: 'Conference Breakout Hall 1', category: 'Cloud Computing', type: 'session', orderIndex: 3 }
      ];
      try {
        items = await Itinerary.insertMany(defaultItems);
      } catch (e) {
        items = defaultItems;
      }
    }

    res.json(items);
  } catch (err) {
    next(err);
  }
};

export const addItineraryItem = async (req, res, next) => {
  try {
    const item = await Itinerary.create({
      ...req.body,
      userId: req.user._id
    });
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
};

export const updateItineraryItem = async (req, res, next) => {
  try {
    const item = await Itinerary.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    res.json(item);
  } catch (err) {
    next(err);
  }
};

export const deleteItineraryItem = async (req, res, next) => {
  try {
    await Itinerary.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ message: 'Itinerary item removed' });
  } catch (err) {
    next(err);
  }
};
