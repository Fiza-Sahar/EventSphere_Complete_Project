import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema({
  attendeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exhibitorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exhibitor', required: true },
  expoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Expo', required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  purpose: { type: String, required: true },
  boothNumber: { type: String, default: '' },
  location: { type: String, default: 'Exhibitor Booth' },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'completed'], 
    default: 'pending' 
  },
  notes: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Meeting', meetingSchema);
