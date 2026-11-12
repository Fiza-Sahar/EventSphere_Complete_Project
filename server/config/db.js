import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is missing in environment variables');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);

    isConnected = mongoose.connection.readyState === 1;

    console.log(`[MongoDB] Connected: ${mongoose.connection.host}`);
  } catch (error) {
    isConnected = false;
    console.error(`[MongoDB Error] ${error.message}`);
    throw error;
  }
};

export default connectDB;