import mongoose from 'mongoose';

const itinerarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Expo', required: true },
  time: { type: String, required: true }, // e.g. '10:00 AM'
  title: { type: String, required: true },
  location: { type: String, required: true }, // e.g. 'Hall A', 'Booth A-102'
  category: { type: String, default: 'General' },
  type: { type: String, enum: ['session', 'booth', 'meeting', 'meal', 'keynote', 'custom'], default: 'custom' },
  notes: { type: String, default: '' },
  orderIndex: { type: Number, default: 0 },
  completed: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Itinerary', itinerarySchema);
