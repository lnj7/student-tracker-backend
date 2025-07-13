const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../models/User');
const auth = require('../middleware/auth');

// ✅ Register new user
// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const newUser = new User({ name, email, password }); // Don't hash here!
    await newUser.save();

    res.status(201).json({ message: 'User created' });
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

    const user = await User.findOne({ email });
    console.log('LOGIN: User found:', user);

    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials (no user)' });
    }
    console.log('LOGIN: Plain password:', password);
console.log('LOGIN: Hashed in DB:', user.password);

    const valid = await bcrypt.compare(password, user.password);
    console.log('LOGIN: Password valid?', valid);

    if (!valid) {
      return res.status(400).json({ error: 'Invalid credentials (bad password)' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2d' });
   console.log('✅ [LOGIN ROUTE] Issuing token:', token);
console.log('✅ [LOGIN ROUTE] Signing with JWT_SECRET:', process.env.JWT_SECRET);

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

module.exports = router;
