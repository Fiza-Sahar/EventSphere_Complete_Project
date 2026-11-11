import mongoose from 'mongoose';

const speakerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String, required: true },
  company: { type: String, required: true },
  bio: { type: String, required: true },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200' },
  email: { type: String, default: '' },
  topic: { type: String, default: 'Keynote' }
}, { timestamps: true });

export default mongoose.model('Speaker', speakerSchema);
