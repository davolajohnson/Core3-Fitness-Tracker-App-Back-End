// controllers/workouts.js
const express = require('express');
const { isValidObjectId } = require('mongoose');
const router = express.Router();
const requireAuth = require('../middleware/verify-token');
const Workout = require('../models/Workout'); // NOTE: lowercase filename

router.use(requireAuth);

// Helper to validate Mongo ObjectId
function assertValidId(id) {
  return isValidObjectId(id);
}

// GET /workouts — list my workouts
router.get('/', async (req, res) => {
  try {
    const items = await Workout.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error('GET /workouts error:', err);
    res.status(500).json({ err: 'Server error' });
  }
});

// GET /workouts/:id — show if I own it
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!assertValidId(id)) return res.status(400).json({ err: 'Invalid id' });

    const doc = await Workout.findOne({ _id: id, user: req.user._id });
    if (!doc) return res.status(404).json({ err: 'Not found' });
    res.json(doc);
  } catch (err) {
    console.error(`GET /workouts/${req.params.id} error:`, err);
    res.status(500).json({ err: 'Server error' });
  }
});

// POST /workouts — create
router.post('/', async (req, res) => {
  try {
    const doc = await Workout.create({
      name: req.body.name,
      notes: req.body.notes || '',
      date: req.body.date,            
      duration: req.body.duration,    
      exercises: req.body.exercises,  
      user: req.user._id,
    });
    res.status(201).json(doc);
  } catch (err) {
    console.error('POST /workouts error:', err);
    res.status(400).json({ err: err.message || 'Bad request' });
  }
});

// PUT /workouts/:id — update if I own it
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!assertValidId(id)) return res.status(400).json({ err: 'Invalid id' });

    const doc = await Workout.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { name: req.body.name, notes: req.body.notes },
      { new: true }
    );
    if (!doc) return res.status(404).json({ err: 'Not found' });
    res.json(doc);
  } catch (err) {
    console.error(`PUT /workouts/${req.params.id} error:`, err);
    res.status(500).json({ err: 'Server error' });
  }
});

// DELETE /workouts/:id — delete if I own it
router.delete('/:id', async (req, res) => {
  try {
    const workout = await Workout.findOne({ _id: req.params.id, user: req.user._id });
    if (!workout) return res.status(404).json({ err: 'Workout not found' });

    await workout.deleteOne();
    res.sendStatus(204);
  } catch (err) {
    console.error('DELETE /workouts error:', err);
    res.status(500).json({ err: 'Server error' });
  }
});

module.exports = router;



