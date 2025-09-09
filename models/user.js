// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true, trim: true },
    hashedPassword: { type: String, required: true }, // <-- must match controllers/auth.js
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
