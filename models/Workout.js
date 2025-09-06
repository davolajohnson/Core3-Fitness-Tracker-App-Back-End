const mongoose = require('mongoose')
const { Schema } = mongoose

const workoutSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    notes: { type: String, default: '' },
    // optional stretch fields you sketched; safe to leave for later
    duration: { type: Number }, // minutes
  },
  { timestamps: true }
)

module.exports = mongoose.model('Workout', workoutSchema)
