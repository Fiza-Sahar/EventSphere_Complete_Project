import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  speakerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Speaker' },
  speakerName: { type: String, default: '' },
  expoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Expo', required: true },
  category: { type: String, default: 'General' },
  date: { type: String, required: true }, // Format YYYY-MM-DD
  startTime: { type: String, required: true }, // e.g. "10:00 AM"
  endTime: { type: String, required: true },   // e.g. "11:30 AM"
  location: { type: String, default: 'Main Stage' },
  capacity: { type: Number, default: 200 },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

export default mongoose.model('Session', sessionSchema);
