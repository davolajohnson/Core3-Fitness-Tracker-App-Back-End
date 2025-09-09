const express = require('express')
const router = express.Router()
const Workout = require('../models/Workout')
const Exercise = require('../models/Exercise')
const Set = require('../models/Set')
const verifyToken = require('../middleware/verify-token')

router.use(verifyToken)

// GET /workouts 
router.get('/', async (req, res) => {
  const items = await Workout.find({ user: req.user._id }).sort({ date: -1 })
  res.json(items)
})

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
  const [w, code] = await ensureOwner(req.params.id, req.user._id)
  if (!w) return res.sendStatus(code)

  const exercises = await Exercise.find({ workout: w._id }).sort({ createdAt: 1 })
  const exIds = exercises.map(e => e._id)
  const sets = await Set.find({ exercise: { $in: exIds } }).sort({ createdAt: 1 })

  const setsByExercise = sets.reduce((m, s) => {
    const k = String(s.exercise)
    ;(m[k] = m[k] || []).push(s)
    return m
  }, {})

  res.json({
    _id: w._id,
    date: w.date,
    notes: w.notes,
    duration: w.duration,
    exercises: exercises.map(e => ({
      _id: e._id,
      name: e.name,
      type: e.type,
      sets: setsByExercise[String(e._id)] || []
    }))
  })
})

// PUT /workouts/:id — Update
router.put('/:id', async (req, res) => {
  const [w, code] = await ensureOwner(req.params.id, req.user._id)
  if (!w) return res.sendStatus(code)
  const { date, notes, duration } = req.body
  if (!date) return res.status(400).json({ error: 'date is required' })
  w.date = date
  if (notes !== undefined) w.notes = notes
  if (duration !== undefined) w.duration = duration
  await w.save()
  res.json(w)
})

// DELETE /workouts/:id 
router.delete('/:id', async (req, res) => {
  const [w, code] = await ensureOwner(req.params.id, req.user._id)
  if (!w) return res.sendStatus(code)
  const exercises = await Exercise.find({ workout: w._id })
  const exIds = exercises.map(e => e._id)
  await Set.deleteMany({ exercise: { $in: exIds } })
  await Exercise.deleteMany({ workout: w._id })
  await w.deleteOne()
  res.sendStatus(204)
})

module.exports = router
