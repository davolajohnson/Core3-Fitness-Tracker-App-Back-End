const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/verify-token');
const Workout = require('../models/Workout');
const Exercise = require('../models/Exercise')

// Require auth for all workout routes (you can move the GET / public if you want)
router.use(requireAuth);

// GET /workouts (only my workouts)
router.get('/', async (req, res) => {
  const items = await Workout.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(items);
});

// POST /workouts
router.post('/', async (req, res) => {
  const { date, notes, duration, exercises } = req.body
  if (!date) return res.status(400).json({ error: 'date is required' })
  const created = await Workout.create({
    user: req.user._id,
    date,
    notes: notes ?? '',
    duration, 
    exercises
  })
  const createdExercises = await Promise.all(
    exercises.map(async (ex) => {
      return Exercise.create({
        workout: created._id,
        name: ex.name,
        sets: ex.sets || 0,
        reps: ex.reps || 0,
        weight: ex.weight || 0,
        type: ex.type || "strength",
      });
    })
  );
 
  
  res.status(201).json({
    ...created.toObject(),
    exercises: createdExercises,
  });
});

// helper: owner
async function ensureOwner(workoutId, userId) {
  const w = await Workout.findById(workoutId)
  if (!w) return [null, 404]
  if (String(w.user) !== String(userId)) return [null, 403]
  return [w, 200]
}

// GET /workouts/:id 
router.get('/:id', async (req, res) => {
  const doc = await Workout.findOne({ _id: req.params.id, user: req.user._id });
  if (!doc) return res.status(404).json({ err: 'Not found' });
  res.json(doc);
});

router.delete('/:id', async (req, res) => {
  const [w, code] = await ensureOwner(req.params.id, req.user._id);
  if (!w) return res.sendStatus(code);
  await w.deleteOne();
  res.sendStatus(204);
});


module.exports = router;

