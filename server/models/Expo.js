import mongoose from 'mongoose';

const expoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  theme: { type: String, default: 'Technology & Innovation' },
  location: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  image: { type: String, default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200' },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { 
    type: String, 
    enum: ['draft', 'published', 'completed', 'cancelled'], 
    default: 'published' 
  },
  capacity: { type: Number, default: 5000 },
  category: { type: String, default: 'Tech & Trade' }
}, { timestamps: true });

export default mongoose.model('Expo', expoSchema);
