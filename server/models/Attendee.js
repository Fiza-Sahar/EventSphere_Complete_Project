import mongoose from 'mongoose';

const attendeeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bio: { type: String, default: '' },
  company: { type: String, default: '' },
  jobTitle: { type: String, default: '' },
  interests: [{ type: String }],
  registeredExpos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Expo' }],
  savedSessions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Session' }],
  favoriteExhibitors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Exhibitor' }]
}, { timestamps: true });

export default mongoose.model('Attendee', attendeeSchema);
