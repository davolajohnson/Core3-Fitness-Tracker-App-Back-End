// controllers/sets.js
const express = require('express');
const router = express.Router();

const Exercise = require('../models/exercise'); // lowercase
const Set = require('../models/set');           // lowercase
const verifyToken = require('../middleware/verify-token');

router.use(verifyToken);

// POST /exercises/:id/sets — create set
router.post('/exercises/:id/sets', async (req, res) => {
  const ex = await Exercise.findById(req.params.id).populate('workout');
  if (!ex) return res.sendStatus(404);
  if (String(ex.workout.user) !== String(req.user._id)) return res.sendStatus(403);

  const { weight, reps, rpe, time } = req.body;
  if (weight == null || reps == null) {
    return res.status(400).json({ error: 'weight and reps are required' });
  }
  const created = await Set.create({ exercise: ex._id, weight, reps, rpe, time });
  res.status(201).json(created);
});

// PUT /sets/:id — update set
router.put('/sets/:id', async (req, res) => {
  const s = await Set.findById(req.params.id).populate({
    path: 'exercise',
    populate: { path: 'workout' }
  });
  if (!s) return res.sendStatus(404);
  if (String(s.exercise.workout.user) !== String(req.user._id)) return res.sendStatus(403);

  const { weight, reps, rpe, time } = req.body;
  if (weight != null) s.weight = weight;
  if (reps != null) s.reps = reps;
  if (rpe != null) s.rpe = rpe;
  if (time != null) s.time = time;
  await s.save();
  res.json(s);
});

// DELETE /sets/:id — delete set
router.delete('/sets/:id', async (req, res) => {
  const s = await Set.findById(req.params.id).populate({
    path: 'exercise',
    populate: { path: 'workout' }
  });
  if (!s) return res.sendStatus(404);
  if (String(s.exercise.workout.user) !== String(req.user._id)) return res.sendStatus(403);

  await s.deleteOne();
  res.sendStatus(204);
});

module.exports = router;

