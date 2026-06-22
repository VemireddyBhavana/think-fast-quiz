import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import connectDB from './config/db.js';

import http from 'http';
import { Server } from 'socket.io';

import path from 'path';
import express from 'express';

const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Serve frontend in production (for Docker)
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, 'public')));
  app.get('*', (req, res) => {
    // Only serve index.html for non-API routes
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
    }
  });
}

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? false : 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

import { registerRoomHandlers } from './sockets/roomHandler.js';

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  registerRoomHandlers(io, socket);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
