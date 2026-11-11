import Speaker from '../models/Speaker.js';

export const getSpeakers = async (req, res, next) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } }
      ];
    }
    const speakers = await Speaker.find(query).sort({ name: 1 });
    res.json(speakers);
  } catch (error) {
    next(error);
  }
};

export const getSpeakerById = async (req, res, next) => {
  try {
    const speaker = await Speaker.findById(req.params.id);
    if (!speaker) return res.status(404).json({ message: 'Speaker not found' });
    res.json(speaker);
  } catch (error) {
    next(error);
  }
};

export const createSpeaker = async (req, res, next) => {
  try {
    const speaker = await Speaker.create(req.body);
    res.status(201).json(speaker);
  } catch (error) {
    next(error);
  }
};

export const updateSpeaker = async (req, res, next) => {
  try {
    const speaker = await Speaker.findById(req.params.id);
    if (!speaker) return res.status(404).json({ message: 'Speaker not found' });

    Object.assign(speaker, req.body);
    await speaker.save();
    res.json(speaker);
  } catch (error) {
    next(error);
  }
};

export const deleteSpeaker = async (req, res, next) => {
  try {
    const speaker = await Speaker.findById(req.params.id);
    if (!speaker) return res.status(404).json({ message: 'Speaker not found' });

    await speaker.deleteOne();
    res.json({ message: 'Speaker deleted' });
  } catch (error) {
    next(error);
  }
};
