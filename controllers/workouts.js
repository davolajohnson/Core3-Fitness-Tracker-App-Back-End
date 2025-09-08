const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/verify-token');
const Workout = require('../models/Workout');

// Public: anyone can view workouts
router.get('/', async (req, res) => {
  const items = await Workout.find().sort({ createdAt: -1 });
  res.json(items);
});

// Everything below requires a valid JWT
router.use(requireAuth);

// Create workout (only signed-in users)
router.post('/', async (req, res) => {
  const workout = await Workout.create({
    ...req.body,
    user: req.user._id, // associate with logged-in user
  });
  res.status(201).json(workout);
});

// Update workout (only owner can update)
router.put('/:id', async (req, res) => {
  const updated = await Workout.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    req.body,
    { new: true }
  );
  if (!updated) return res.status(403).json({ err: 'Not allowed' });
  res.json(updated);
});

// Delete workout (only owner can delete)
router.delete('/:id', async (req, res) => {
  const deleted = await Workout.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });
  if (!deleted) return res.status(403).json({ err: 'Not allowed' });
  res.json({ ok: true });
});

module.exports = router;
