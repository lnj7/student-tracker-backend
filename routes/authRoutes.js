import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();


// ✅ Register new user (fixed)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    // ✅ Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    // ✅ Create JWT
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '2d' }
    );

    console.log('✅ [REGISTER ROUTE] Issuing token:', token);

    // ✅ Send token in response
    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});


// ✅ Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('LOGIN: Got email:', email);
      console.log('🪵 Incoming login body:', req.body);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials (no user)' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ error: 'Invalid credentials (bad password)' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2d' });
    console.log('✅ [LOGIN ROUTE] Issuing token:', token);

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Get current user's profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('❌ Get profile error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Update current user's profile
router.patch('/me', auth, async (req, res) => {
  try {
    const updates = {};
    if (req.body.name) updates.name = req.body.name;
    if (req.body.email) updates.email = req.body.email;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
    console.log('✅ [/ME ROUTE] req.user:', req.user);

  } catch (err) {
    console.error('❌ Update profile error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
