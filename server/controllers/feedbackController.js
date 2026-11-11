import Feedback from '../models/Feedback.js';

export const getFeedbacks = async (req, res, next) => {
  try {
    const { expoId } = req.query;
    let query = {};
    if (expoId) query.expoId = expoId;

    const feedbacks = await Feedback.find(query).populate('userId', 'name avatar role').populate('expoId', 'title');
    res.json(feedbacks);
  } catch (error) {
    next(error);
  }
};

export const createFeedback = async (req, res, next) => {
  try {
    const { expoId, rating, comment } = req.body;
    const feedback = await Feedback.create({
      userId: req.user._id,
      expoId,
      rating,
      comment
    });
    res.status(201).json(feedback);
  } catch (error) {
    next(error);
  }
};
