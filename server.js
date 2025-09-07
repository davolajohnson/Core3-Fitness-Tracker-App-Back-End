// npm
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');


// Import routers
const authRouter = require('./controllers/auth');
const testJwtRouter = require('./controllers/test-jwt');
const usersRouter = require('./controllers/users');

//New routers
const workoutsRouter = require('./controllers/workouts')
const exercisesRouter = require('./controllers/exercises')
const setsRouter = require('./controllers/sets')

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(logger('dev'));

// Routes
app.get('/', (req, res) => {
  res.send('Core3 Backend is running 🚀');
});

app.use('/auth', authRouter);
app.use('/test-jwt', testJwtRouter);
app.use('/users', usersRouter);
app.use('/workouts', workoutsRouter) // /workouts & /workouts/:id
app.use('/', exercisesRouter)        // /workouts/:id/exercises, /exercises/:id
app.use('/', setsRouter)        // /exercises/:id/sets, /sets/:id
// Start the server and listen on port 3000
app.listen(3000, () => {
  console.log('The express app is ready!');
});
