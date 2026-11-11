import mongoose from 'mongoose';

const floorSchema = new mongoose.Schema({
  expoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Expo', required: true },
  name: { type: String, required: true }, // e.g. 'Ground Floor', '1st Floor', '2nd Floor', 'VIP Floor'
  level: { type: Number, required: true, default: 0 },
  description: { type: String, default: '' },
  totalBooths: { type: Number, default: 50 },
  sectors: [{ type: String }], // ['A', 'B', 'C', 'D']
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Floor', floorSchema);
