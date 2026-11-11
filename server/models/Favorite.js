import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemType: { 
    type: String, 
    enum: ['exhibitor', 'booth', 'event', 'speaker', 'session'], 
    required: true 
  },
  itemId: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  location: { type: String, default: '' },
  category: { type: String, default: '' },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: true });

favoriteSchema.index({ userId: 1, itemType: 1, itemId: 1 }, { unique: true });

export default mongoose.model('Favorite', favoriteSchema);
