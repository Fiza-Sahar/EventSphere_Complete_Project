import mongoose from 'mongoose';

const boothSchema = new mongoose.Schema({
  boothNumber: { type: String, required: true },
  expoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Expo', required: true },
  exhibitorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exhibitor', default: null },
  category: { type: String, default: 'General' },
  sector: { type: String, enum: ['A', 'B', 'C', 'D'], default: 'A' },
  floor: { type: String, default: 'Ground Floor' },
  dimensions: { type: String, default: '20 x 20 ft' },
  size: { 
    width: { type: Number, default: 5 },
    height: { type: Number, default: 3.5 },
    depth: { type: Number, default: 4.5 }
  },
  position: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    z: { type: Number, default: 0 }
  },
  rotation: { type: Number, default: 0 },
  status: { 
    type: String, 
    enum: ['AVAILABLE', 'RESERVED', 'OCCUPIED', 'MAINTENANCE', 'UNAVAILABLE'], 
    default: 'AVAILABLE' 
  },
  companyName: { type: String, default: '' },
  description: { type: String, default: '' },
  products: [{ type: String }],
  staff: [{ type: String }],
  trafficScore: { type: Number, default: 50 } // Simulated footfall heatmap score 0-100
}, { timestamps: true });

export default mongoose.model('Booth', boothSchema);
