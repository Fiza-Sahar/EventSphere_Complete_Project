import Message from '../models/Message.js';
import User from '../models/User.js';

export const getMessagesWithUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: currentUserId, receiverId: userId },
        { senderId: userId, receiverId: currentUserId }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const { receiverId, content, expoId } = req.body;
    const senderId = req.user._id;

    const message = await Message.create({
      senderId,
      receiverId,
      expoId,
      content
    });

    const io = req.app.get('io');
    if (io) {
      io.to(receiverId.toString()).emit('new_message', message);
    }

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

export const getConversations = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    }).populate('senderId receiverId', 'name email role avatar company');

    const conversationUsersMap = {};
    messages.forEach(msg => {
      const otherUser = msg.senderId._id.toString() === userId.toString() ? msg.receiverId : msg.senderId;
      if (otherUser && otherUser._id) {
        conversationUsersMap[otherUser._id.toString()] = {
          user: otherUser,
          lastMessage: msg.content,
          updatedAt: msg.createdAt
        };
      }
    });

    const conversations = Object.values(conversationUsersMap);
    res.json(conversations);
  } catch (error) {
    next(error);
  }
};
