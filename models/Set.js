const mongoose = require('mongoose')
const { Schema } = mongoose

const setSchema = new Schema(
  {
    exercise: { type: Schema.Types.ObjectId, ref: 'Exercise', required: true },
    weight: { type: Number, required: true },
    reps: { type: Number, required: true },
    rpe: { type: Number },     // optional
    time: { type: Number },    // seconds, optional
  },
  { timestamps: true }
)

module.exports = mongoose.model('Set', setSchema)
