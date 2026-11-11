import mongoose from 'mongoose';

const exhibitorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  expoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Expo', required: true },
  companyName: { type: String, required: true },
  logo: { type: String, default: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200' },
  description: { type: String, required: true },
  category: { type: String, required: true },
  website: { type: String, default: '' },
  contactEmail: { type: String, default: '' },
  contactPhone: { type: String, default: '' },
  products: [{
    name: { type: String },
    description: { type: String },
    image: { type: String }
  }],
  services: [{
    name: { type: String },
    description: { type: String }
  }],
  documents: [{
    title: { type: String },
    url: { type: String },
    uploadedAt: { type: Date, default: Date.now }
  }],
  boothId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booth', default: null },
  boothNumber: { type: String, default: 'Unassigned' },
  staff: [{
    name: { type: String },
    role: { type: String },
    email: { type: String }
  }],
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'approved' 
  }
}, { timestamps: true });

export default mongoose.model('Exhibitor', exhibitorSchema);
