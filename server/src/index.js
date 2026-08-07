import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import apiRoutes from './routes/apiRoutes.js';
import { seedDatabase } from './utils/seedData.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Socket.io initialization
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.set('io', io);

// Security & Parsing Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors());
app.use(express.json());

// Public verification endpoint for QR code certificates
app.get('/api/public/verify/:certNumber', async (req, res) => {
  try {
    const Certificate = (await import('./models/Certificate.js')).default;
    const cert = await Certificate.findOne({ certNumber: req.params.certNumber });
    if (!cert) {
      return res.status(404).json({ valid: false, message: 'Certificate not found or invalid' });
    }
    res.json({ valid: true, certificate: cert });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

// Serve Client Static Build Files in Production / Render
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.join(__dirname, '../../client/dist');

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`⚡ Socket client connected: ${socket.id}`);
  socket.on('join_room', (room) => {
    socket.join(room);
    console.log(`Socket ${socket.id} joined room: ${room}`);
  });
  socket.on('disconnect', () => {
    console.log(`🔥 Socket client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/elh_crm';

// Handle port busy / occupied fallback gracefully
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const altPort = Number(PORT) + 1;
    console.log(`⚠️ Port ${PORT} occupied. Automatically failing over to port ${altPort}...`);
    server.listen(altPort, () => {
      console.log(`🚀 European Language Hub (ELH) Server running on port ${altPort}`);
    });
  } else {
    console.error('Server error:', err);
  }
});

mongoose
  .connect(MONGODB_URI, { serverSelectionTimeoutMS: 2000 })
  .then(async () => {
    console.log('✅ Connected to MongoDB successfully.');
    await seedDatabase();
    server.listen(PORT, () => {
      console.log(`🚀 European Language Hub (ELH) Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.warn('⚠️ MongoDB connection warning (will run with in-memory state fallback):', err.message);
    server.listen(PORT, () => {
      console.log(`🚀 European Language Hub (ELH) Server running on port ${PORT} (Standalone API mode)`);
    });
  });
