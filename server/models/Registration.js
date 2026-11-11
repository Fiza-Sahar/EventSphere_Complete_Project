import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Expo', required: true },
  ticketType: { type: String, enum: ['VIP Pass', 'Standard Pass', 'Exhibitor Pass', 'Press Pass'], default: 'Standard Pass' },
  ticketCode: { type: String, required: true },
  status: { type: String, enum: ['active', 'cancelled', 'checked-in'], default: 'active' },
  qrCodeData: { type: String, default: '' }
}, { timestamps: true });

export default mongoose.model('Registration', registrationSchema);
