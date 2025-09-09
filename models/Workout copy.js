const mongoose = require('mongoose');
const { Schema } = mongoose; // <-- add this

const workoutSchema = new Schema(
  {
   
        name: String,
        sets: Number,
        reps: Number,
        weight: Number,
      },

  { timestamps: true }
);

module.exports = mongoose.model('Workout', workoutSchema);