import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import dns from 'dns';

// Fix for Windows Node.js SRV query ECONNREFUSED on MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if custom DNS fails
}

export const connectDB = async (): Promise<void> => {
  const mongoURI = process.env.MONGODB_URI;

  if (mongoURI) {
    // A real URI was provided — try connecting
    try {
      await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 });
      console.log('✅ MongoDB Connected (Persistent Atlas/Remote Database)');
      return;
    } catch (error) {
      console.warn('⚠️ Could not connect to remote MONGODB_URI. Falling back to local/in-memory DB...', error);
    }
  }

  // No URI provided — try local MongoDB first, then fallback to in-memory
  try {
    await mongoose.connect('mongodb://localhost:27017/moodverse', { serverSelectionTimeoutMS: 2000 });
    console.log('✅ MongoDB Connected (Local Database)');
  } catch {
    console.warn(`
╔══════════════════════════════════════════════════════════════╗
║  ⚠️  USING IN-MEMORY DATABASE — DATA WILL NOT PERSIST!       ║
║                                                              ║
║  Your data will be erased every time the server restarts.    ║
║                                                              ║
║  To fix this, set MONGODB_URI in backend/.env:              ║
║                                                              ║
║  Option A — MongoDB Atlas (Free Cloud):                      ║
║    1. Go to https://cloud.mongodb.com                        ║
║    2. Create a free cluster                                  ║
║    3. Get your connection string                             ║
║    4. Add to backend/.env:                                   ║
║       MONGODB_URI=mongodb+srv://user:pass@cluster.net/mv     ║
║                                                              ║
║  Option B — Local MongoDB:                                   ║
║    Install MongoDB and start it on port 27017                ║
╚══════════════════════════════════════════════════════════════╝
    `);
    try {
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log('✅ Connected to in-memory fallback database.');
    } catch (fallbackError) {
      console.error('❌ Error connecting to fallback MongoDB:', fallbackError);
      process.exit(1);
    }
  }
};

