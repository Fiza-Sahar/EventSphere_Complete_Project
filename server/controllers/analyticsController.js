import Expo from '../models/Expo.js';
import Exhibitor from '../models/Exhibitor.js';
import Booth from '../models/Booth.js';
import Session from '../models/Session.js';
import User from '../models/User.js';
import Registration from '../models/Registration.js';

export const getDashboardAnalytics = async (req, res, next) => {
  try {
    const totalExpos = await Expo.countDocuments();
    const totalExhibitors = await Exhibitor.countDocuments();
    const totalAttendees = await User.countDocuments({ role: 'attendee' });
    const totalBooths = await Booth.countDocuments();

    const occupiedBooths = await Booth.countDocuments({ status: 'OCCUPIED' });
    const reservedBooths = await Booth.countDocuments({ status: 'RESERVED' });
    const availableBooths = await Booth.countDocuments({ status: 'AVAILABLE' });

    const totalRegistrations = await Registration.countDocuments();

    // Booth occupancy percentage
    const occupancyRate = totalBooths > 0 ? Math.round((occupiedBooths / totalBooths) * 100) : 0;

    // Booth distribution by category
    const boothCategories = await Booth.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Popular sessions by attendance
    const popularSessions = await Session.find()
      .sort({ attendees: -1 })
      .limit(5)
      .select('title category date startTime location attendees capacity');

    // Registration trends (dummy monthly grouping or aggregate)
    const registrationTrends = [
      { month: 'Jan', registrations: 120, checkIns: 95 },
      { month: 'Feb', registrations: 210, checkIns: 180 },
      { month: 'Mar', registrations: 340, checkIns: 290 },
      { month: 'Apr', registrations: 480, checkIns: 410 },
      { month: 'May', registrations: 620, checkIns: 530 },
      { month: 'Jun', registrations: 890, checkIns: 760 }
    ];

    res.json({
      metrics: {
        totalExpos,
        totalExhibitors,
        totalAttendees,
        totalBooths,
        occupiedBooths,
        reservedBooths,
        availableBooths,
        totalRegistrations,
        occupancyRate
      },
      boothCategories: boothCategories.map(c => ({ name: c._id || 'Unassigned', count: c.count })),
      popularSessions,
      registrationTrends
    });
  } catch (error) {
    next(error);
  }
};
