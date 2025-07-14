import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import studentRoutes from './routes/studentRoutes.js';
import authRoutes from './routes/authRoutes.js';
const allowedOrigins = process.env.CORS_ORIGIN.split(',');

dotenv.config();

const app = express();

// const allowedOrigins = [
//   'http://localhost:3000',
//   'https://student-tracker-frontend-tau.vercel.app',
//   'https://student-tracker-frontend-kdf5r8j3i-lnj7s-projects.vercel.app'
// ];


const corsOptionsDelegate = function (req, callback) {
  let corsOptions;
  if (allowedOrigins.includes(req.header('Origin'))) {
    corsOptions = { origin: true, credentials: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

// const corsOptions = {
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('CORS not allowed for this origin'));
//     }
//   },
//   credentials: true,
// };

// app.use(cors(corsOptions));
app.use(cors(corsOptionsDelegate));
app.use(express.json());


// Add this ↓↓↓
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

app.use('/students', studentRoutes);
app.use('/users', authRoutes);

app.get('/', (req, res) => {
  res.send('🌟 Student Tracker API is running');
});

const PORT = process.env.PORT || 5000;
console.log('✅ [SERVER STARTUP] JWT_SECRET:', process.env.JWT_SECRET);

app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});
