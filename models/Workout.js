const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
  name: { type: String, required: true },
  notes: String,
  date: { type: Date, required: true },
  duration: Number,
  exercises: [
    {
      name: String,
      sets: Number,
      reps: Number,
      weight: Number,
    },
  ],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

// Fix OverwriteModelError:
module.exports = mongoose.models.Workout || mongoose.model("Workout", workoutSchema);