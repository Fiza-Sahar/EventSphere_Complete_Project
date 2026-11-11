import Notification from '../models/Notification.js';

export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ userId: req.user._id, read: false }, { read: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
};

export const sendNotification = async (req, res, next) => {
  try {
    const { userId, title, message, type } = req.body;

    const notif = await Notification.create({
      userId,
      title,
      message,
      type: type || 'info'
    });

    const io = req.app.get('io');
    if (io) {
      io.to(userId.toString()).emit('new_notification', notif);
    }

    res.status(201).json(notif);
  } catch (error) {
    next(error);
  }
};
