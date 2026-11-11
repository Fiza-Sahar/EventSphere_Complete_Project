import Meeting from '../models/Meeting.js';
import Exhibitor from '../models/Exhibitor.js';

export const getMeetings = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'attendee') {
      query.attendeeId = req.user._id;
    } else if (req.user.role === 'exhibitor') {
      const exhibitor = await Exhibitor.findOne({ userId: req.user._id });
      if (exhibitor) {
        query.exhibitorId = exhibitor._id;
      }
    }

    const meetings = await Meeting.find(query)
      .populate('attendeeId', 'name email company avatar')
      .populate('exhibitorId', 'companyName logo category boothNumber')
      .sort({ createdAt: -1 });

    res.json(meetings);
  } catch (err) {
    next(err);
  }
};

export const createMeeting = async (req, res, next) => {
  try {
    const { exhibitorId, expoId, date, time, purpose, boothNumber, location } = req.body;
    const meeting = await Meeting.create({
      attendeeId: req.user._id,
      exhibitorId,
      expoId: expoId || '660000000000000000000001',
      date,
      time,
      purpose,
      boothNumber: boothNumber || 'Assigned Booth',
      location: location || 'Exhibitor Booth',
      status: 'pending'
    });

    const populated = await Meeting.findById(meeting._id)
      .populate('attendeeId', 'name email company')
      .populate('exhibitorId', 'companyName logo');

    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
};

export const updateMeetingStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const meeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      { status, ...(notes && { notes }) },
      { new: true }
    )
    .populate('attendeeId', 'name email company')
    .populate('exhibitorId', 'companyName logo');

    res.json(meeting);
  } catch (err) {
    next(err);
  }
};
