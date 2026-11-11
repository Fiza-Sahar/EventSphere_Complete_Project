import mongoose from 'mongoose';

const facilitySchema = new mongoose.Schema({
  expoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Expo', required: true },
  name: { type: String, required: true }, // e.g. 'Executive Cafe & Food Court', 'Restroom Block North'
  type: { 
    type: String, 
    enum: [
      'Food & Cafes',
      'Restrooms',
      'Entrances',
      'Emergency Exits',
      'Meeting Rooms',
      'Stages',
      'Charging Stations',
      'Medical',
      'Parking',
      'Information Desks',
      'VIP Areas',
      'Stairs & Elevators'
    ], 
    required: true 
  },
  floor: { type: String, default: 'Ground Floor' },
  locationName: { type: String, default: 'Main Hall' },
  position: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    z: { type: Number, default: 0 }
  },
  icon: { type: String, default: 'Info' },
  description: { type: String, default: '' },
  capacity: { type: Number, default: 100 },
  availableSpaces: { type: Number, default: 100 }, // For parking
  status: { type: String, enum: ['Open', 'Busy', 'Maintenance'], default: 'Open' }
}, { timestamps: true });

export default mongoose.model('Facility', facilitySchema);
