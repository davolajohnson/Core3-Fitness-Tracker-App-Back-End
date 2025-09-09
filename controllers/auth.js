const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const saltRounds = 12;

// =======================
// SIGN UP
// =======================
router.post('/sign-up', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ err: 'username and password are required' });
    }

    // Check if username is already taken
    const userInDatabase = await User.findOne({ username });
    if (userInDatabase) {
      return res.status(409).json({ err: 'Username already taken.' });
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    // Create new user
    const user = await User.create({
      username,
      hashedPassword
    });

    // Create token
    const payload = { _id: user._id, username: user.username };
    const token = jwt.sign({ payload }, process.env.JWT_SECRET, { expiresIn: '24h' });

    // Respond with token + user
    return res.status(201).json({
      token,
      user: { _id: user._id, username: user.username }
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
});

// =======================
// SIGN IN
// =======================
router.post('/sign-in', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ err: 'username and password are required' });
    }

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ err: 'Invalid credentials.' });
    }

    // Compare password
    const isPasswordCorrect = bcrypt.compareSync(password, user.hashedPassword);
    if (!isPasswordCorrect) {
      return res.status(401).json({ err: 'Invalid credentials.' });
    }

    // Create token
    const payload = { _id: user._id, username: user.username };
    const token = jwt.sign({ payload }, process.env.JWT_SECRET, { expiresIn: '24h' });

    // Respond with token + user
    return res.status(200).json({
      token,
      user: { _id: user._id, username: user.username }
    });
  } catch (err) {
    return res.status(500).json({ err: err.message });
  }
});

// =======================
// WHO AM I (Optional)
// =======================
router.get('/me', (req, res) => {
  try {
    const auth = req.headers.authorization || '';
    const [, token] = auth.split(' ');
    if (!token) return res.status(401).json({ err: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return res.json(decoded.payload);
  } catch (err) {
    return res.status(401).json({ err: 'Invalid or expired token' });
  }
});

module.exports = router;