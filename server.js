// server.js

// 1) Load environment variables first
require('dotenv').config();

// 2) Imports
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

// 3) App + core middleware
const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'https://your-frontend-domain'], // add prod FE later
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// 4) Database connection (logs success or clear error)
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/core3';
mongoose.connect(MONGO_URI)
  .then(() => console.log('Mongo connected'))
  .catch(err => console.error('MongoDB connection error:', err.message));

// 5) Routers
const authRouter = require('./controllers/auth');
const testJwtRouter = require('./controllers/test-jwt');
const usersRouter = require('./controllers/users');
const workoutsRouter = require('./controllers/workouts');
const exercisesRouter = require('./controllers/exercises');
const setsRouter = require('./controllers/sets');

// 6) Health check
app.get('/', (_req, res) => {
  res.send('Core3 Backend is running 🚀');
});

// 7) Mount routes
app.use('/auth', authRouter);         // /auth/sign-in, /auth/sign-up, /auth/me
app.use('/test-jwt', testJwtRouter);  // optional test route
app.use('/users', usersRouter);
app.use('/workouts', workoutsRouter); // /workouts, /workouts/:id
app.use('/exercises', exercisesRouter);
app.use('/sets', setsRouter);

// 8) Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API listening on :${PORT}`);
});