import Session from '../models/Session.js';
import Attendee from '../models/Attendee.js';

export const getSessions = async (req, res, next) => {
  try {
    const { expoId, category, date, search } = req.query;
    let query = {};
    if (expoId) query.expoId = expoId;
    if (category) query.category = category;
    if (date) query.date = date;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { speakerName: { $regex: search, $options: 'i' } }
      ];
    }

    const sessions = await Session.find(query).populate('speakerId').sort({ date: 1, startTime: 1 });
    res.json(sessions);
  } catch (error) {
    next(error);
  }
};

export const getSessionById = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id).populate('speakerId');
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json(session);
  } catch (error) {
    next(error);
  }
};

export const createSession = async (req, res, next) => {
  try {
    const session = await Session.create(req.body);
    res.status(201).json(session);
  } catch (error) {
    next(error);
  }
};

export const updateSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    Object.assign(session, req.body);
    await session.save();
    res.json(session);
  } catch (error) {
    next(error);
  }
};

export const deleteSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    await session.deleteOne();
    res.json({ message: 'Session deleted' });
  } catch (error) {
    next(error);
  }
};

export const registerForSession = async (req, res, next) => {
  try {
    const session = await Session.findById(req.params.id);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    if (session.attendees.includes(req.user._id)) {
      // Toggle off / bookmark removal
      session.attendees = session.attendees.filter(id => id.toString() !== req.user._id.toString());
      await session.save();

      await Attendee.findOneAndUpdate(
        { userId: req.user._id },
        { $pull: { savedSessions: session._id } }
      );

      return res.json({ message: 'Session removed from schedule', registered: false, session });
    }

    // Check conflict for same user on same date & time
    const userAttendee = await Attendee.findOne({ userId: req.user._id }).populate('savedSessions');
    if (userAttendee && userAttendee.savedSessions) {
      const conflict = userAttendee.savedSessions.find(s => s.date === session.date && s.startTime === session.startTime);
      if (conflict) {
        return res.status(400).json({ 
          message: `Schedule conflict with session: "${conflict.title}" at ${conflict.startTime}` 
        });
      }
    }

    session.attendees.push(req.user._id);
    await session.save();

    await Attendee.findOneAndUpdate(
      { userId: req.user._id },
      { $addToSet: { savedSessions: session._id } },
      { upsert: true }
    );

    res.json({ message: 'Successfully registered for session', registered: true, session });
  } catch (error) {
    next(error);
  }
};
