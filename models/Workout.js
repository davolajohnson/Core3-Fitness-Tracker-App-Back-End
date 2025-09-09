const mongoose = require('mongoose');
const { Schema } = mongoose; // <-- add this

const workoutSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    notes: { type: String, default: '' },
    duration: { type: Number },
    exercises: [
      {
        name: String,
        sets: Number,
        reps: Number,
        weight: Number,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.models.Workout || mongoose.model('Workout', workoutSchema);