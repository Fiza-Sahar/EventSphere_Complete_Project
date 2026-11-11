import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import connectDB from './config/db.js';
import { initSocket } from './config/socket.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import expoRoutes from './routes/expoRoutes.js';
import boothRoutes from './routes/boothRoutes.js';
import exhibitorRoutes from './routes/exhibitorRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
import speakerRoutes from './routes/speakerRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import floorRoutes from './routes/floorRoutes.js';
import facilityRoutes from './routes/facilityRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import itineraryRoutes from './routes/itineraryRoutes.js';
import meetingRoutes from './routes/meetingRoutes.js';
import searchRoutes from './routes/searchRoutes.js';

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Socket.io
const io = initSocket(server);
app.set('io', io);

// Connect DB
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/expos', expoRoutes);
app.use('/api/booths', boothRoutes);
app.use('/api/exhibitors', exhibitorRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/speakers', speakerRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/floors', floorRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/itinerary', itineraryRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/search', searchRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', name: 'EventSphere API Platform', timestamp: new Date() });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`[EventSphere Server] Running on port ${PORT}`);
});
