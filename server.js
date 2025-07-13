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


// ✅ Allow listed domains (local + deployed frontend)
const allowedOrigins = [
  'http://localhost:3000',
  'https://student-tracker-frontend-tau.vercel.app',
  'https://student-tracker-frontend-kdf5r8j3i-lnj7s-projects.vercel.app'
];

// ✅ Middleware for CORS
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin like mobile apps or curl
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('CORS not allowed for this origin'), false);
  },
  credentials: true,
}));

// ✅ Handle preflight requests
app.options('*', cors());

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
