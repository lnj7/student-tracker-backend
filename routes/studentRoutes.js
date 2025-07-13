import express from 'express';
import Student from '../models/Student.js';
import authMiddleware from '../middleware/authMiddleware.js';

// const express = require('express');
// const authMiddleware = require('../middleware/authMiddleware');
// const Student = require('../models/Student');
const router = express.Router();

// Auth-protected routes
router.get('/', authMiddleware, async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH update
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { lat, lon } = req.body;
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { lat, lon },
      { new: true }
    );
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST create (for testing)
router.post('/', async (req, res) => {
  try {
    const { name, lat, lon } = req.body;
    const student = new Student({ name, lat, lon });
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/students/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await Student.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Student not found' });
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});



export default router;
