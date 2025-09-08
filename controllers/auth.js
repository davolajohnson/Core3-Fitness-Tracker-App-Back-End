const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const saltRounds = 12;

// SIGN UP
router.post('/sign-up', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ err: 'username and password are required' });
    }

    const userInDatabase = await User.findOne({ username });
    if (userInDatabase) {
      return res.status(409).json({ err: 'Username already taken.' });
    }

    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    const user = await User.create({
      username,
      hashedPassword
    });

    const payload = { username: user.username, _id: user._id };
    const token = jwt.sign({ payload }, process.env.JWT_SECRET);

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

// SIGN IN
router.post('/sign-in', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ err: 'username and password are required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ err: 'Invalid credentials.' });
    }

    const isPasswordCorrect = bcrypt.compareSync(password, user.hashedPassword);
    if (!isPasswordCorrect) {
      return res.status(401).json({ err: 'Invalid credentials.' });
    }

    const payload = { username: user.username, _id: user._id };
    const token = jwt.sign({ payload }, process.env.JWT_SECRET);

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ err: err.message });
  }
});

module.exports = router;
