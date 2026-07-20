import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/moodverse';
    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 2000 });
    console.log('MongoDB Connected successfully (Primary)');
  } catch (error) {
    console.warn('⚠️ Primary MongoDB connection failed. Initializing in-memory fallback database...');
    try {
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log('✅ MongoDB Connected successfully (In-Memory Fallback)');
    } catch (fallbackError) {
      console.error('❌ Error connecting to both primary and fallback MongoDB:', fallbackError);
      process.exit(1);
    }
  }
};
