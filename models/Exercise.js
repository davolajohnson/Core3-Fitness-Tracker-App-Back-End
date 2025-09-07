const mongoose = require('mongoose')
const { Schema } = mongoose

const exerciseSchema = new Schema(
  {
    workout: { type: Schema.Types.ObjectId, ref: 'Workout', required: true },
    name: { type: String, required: true, trim: true },
    type: { type: String, trim: true }, // optional
  },
  { timestamps: true }
)

module.exports = mongoose.model('Exercise', exerciseSchema)
