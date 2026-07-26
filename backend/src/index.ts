import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectDB } from './config/database.js';
import authRoutes from './routes/auth.js';
import moodRoutes from './routes/mood.js';
import friendRoutes from './routes/friends.js';
import aiRoutes from './routes/ai.routes.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

// Security & Performance Middleware
app.use(helmet({ contentSecurityPolicy: false })); // CSP off: handled by frontend
app.use(compression());
// CORS configuration (allow Vercel frontend or fallback to *)
const allowedOrigins = process.env.CLIENT_URL 
  ? [process.env.CLIENT_URL, 'https://moodverse-chi.vercel.app'] 
  : '*';

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: '1mb' })); // Prevent oversized payloads

// Database Connection
// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/ai', aiRoutes);

// Root & Health check
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ status: 'healthy', message: 'MoodVerse 2.0 API is running 🚀' });
});

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'healthy', message: 'MoodVerse API is running' });
});

// -------------------------------------------
// Socket.IO - Real-time features
// -------------------------------------------

// Map: userId -> socketId
const onlineUsers = new Map<string, string>();

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  // User comes online — they identify themselves
  socket.on('user:online', (userId: string) => {
    onlineUsers.set(userId, socket.id);
    // Broadcast online presence
    socket.broadcast.emit('friend:online', { userId });
    console.log(`User ${userId} is online`);
  });

  // User broadcasts their current mood to friends
  socket.on('mood:update', (data: { userId: string; emotion: string; intensity: number }) => {
    // Broadcast mood update to all connected sockets (friends will filter on client)
    socket.broadcast.emit('friend:mood_updated', data);
  });

  // Handle private chat messages between two users
  socket.on('chat:message', (data: { to: string; from: string; message: string; timestamp: string }) => {
    const recipientSocketId = onlineUsers.get(data.to);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('chat:message', data);
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    // Remove from online users map
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        socket.broadcast.emit('friend:offline', { userId });
        break;
      }
    }
    console.log('Socket disconnected:', socket.id);
  });
});

const startServer = async () => {
  await connectDB();

  const PORT = process.env.PORT || 5000;
  httpServer.listen(PORT, () => {
    console.log(`🚀 MoodVerse Server running on port ${PORT}`);
  });
};

startServer();

// Global unhandled error handler (prevents process crashes in production)
process.on('unhandledRejection', (reason: any) => {
  console.error('⚠️ Unhandled Rejection:', reason?.message || reason);
});
process.on('uncaughtException', (err) => {
  console.error('⚠️ Uncaught Exception:', err.message);
});

export { io };
