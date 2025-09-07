const express = require('express')
const router = express.Router()
const Workout = require('../models/Workout')
const Exercise = require('../models/Exercise')
const verifyToken = require('../middleware/verify-token')

router.use(verifyToken)

// POST /workouts/:id/exercises
router.post('/workouts/:id/exercises', async (req, res) => {
  const { name, type } = req.body
  if (!name) return res.status(400).json({ error: 'name is required' })

  const w = await Workout.findById(req.params.id)
  if (!w) return res.sendStatus(404)
  if (String(w.user) !== String(req.user._id)) return res.sendStatus(403)

  const created = await Exercise.create({ workout: w._id, name, type })
  res.status(201).json(created)
})

// PUT /exercises/:id Update
router.put('/exercises/:id', async (req, res) => {
  const ex = await Exercise.findById(req.params.id).populate('workout')
  if (!ex) return res.sendStatus(404)
  if (String(ex.workout.user) !== String(req.user._id)) return res.sendStatus(403)

  const { name, type } = req.body
  if (name !== undefined) ex.name = name
  if (type !== undefined) ex.type = type
  await ex.save()
  res.json(ex)
})

// DELETE /exercises/:id  Delete
router.delete('/exercises/:id', async (req, res) => {
  const ex = await Exercise.findById(req.params.id).populate('workout')
  if (!ex) return res.sendStatus(404)
  if (String(ex.workout.user) !== String(req.user._id)) return res.sendStatus(403)

  await ex.deleteOne()
  res.sendStatus(204)
})

module.exports = router
