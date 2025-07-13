// server/server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import studentRoutes from './routes/studentRoutes.js';
import authRoutes from './routes/authRoutes.js';


// ✅ Load environment variables
dotenv.config();

// ✅ Initialize Express app
const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  // Mongoose v7+ ignores options like useNewUrlParser automatically
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// ✅ Routes
app.use('/api/students', studentRoutes);
app.use('/api/users', authRoutes);

// ✅ Root health check
app.get('/', (req, res) => {
  res.send('🌟 Student Tracker API is running');
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
console.log('✅ [SERVER STARTUP] JWT_SECRET:', process.env.JWT_SECRET);

app.listen(PORT, () => console.log(`✅ Server listening on port ${PORT}`));
