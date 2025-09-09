const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/verify-token');
const Workout = require('../models/Workout');

// Require auth for all workout routes (you can move the GET / public if you want)
router.use(requireAuth);

// GET /workouts (only my workouts)
router.get('/', async (req, res) => {
  const items = await Workout.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(items);
});

// GET /workouts/:id (only if I own it)
router.get('/:id', async (req, res) => {
  const doc = await Workout.findOne({ _id: req.params.id, user: req.user._id });
  if (!doc) return res.status(404).json({ err: 'Not found' });
  res.json(doc);
});

// POST /workouts (create)
router.post('/', async (req, res) => {
  const doc = await Workout.create({
    name: req.body.name,
    notes: req.body.notes || '',
    user: req.user._id,
  });
  res.status(201).json(doc);
});

module.exports = router;

