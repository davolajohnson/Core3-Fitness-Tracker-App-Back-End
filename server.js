// server.js
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();

/* =========================
   CORS (Vite dev + optional prod)
   ========================= */
const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_ORIGIN, // e.g., https://core3.yourdomain.com
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // Allow same-origin tools (curl/Postman) where origin is undefined
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    return cb(new Error(`Origin not allowed: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));
app.options('*', cors()); // preflight

/* =========================
   Middleware
   ========================= */
app.use(express.json());
app.use(morgan('dev'));

/* =========================
   Database
   ========================= */
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/core3';
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

/* =========================
   Routers (match filenames exactly)
   ========================= */
const authRouter = require('./controllers/auth');          // ./controllers/auth.js
const testJwtRouter = require('./controllers/test-jwt');   // ./controllers/test-jwt.js
const usersRouter = require('./controllers/users');        // ./controllers/users.js
const workoutsRouter = require('./controllers/workouts');  // ./controllers/workouts.js
const exercisesRouter = require('./controllers/exercises'); // NOTE: plural
const setsRouter = require('./controllers/sets');          // ./controllers/sets.js

/* =========================
   Health check
   ========================= */
app.get('/', (_req, res) => res.send('Core3 Backend is running 🚀'));

/* =========================
   Mount routes
   ========================= */
app.use('/auth', authRouter);           // /auth/sign-in, /auth/sign-up, /auth/me
app.use('/test-jwt', testJwtRouter);    // test endpoints
app.use('/users', usersRouter);         // protected user routes
app.use('/workouts', workoutsRouter);   // protected workouts CRUD
app.use('/exercises', exercisesRouter); // protected exercises CRUD
app.use('/sets', setsRouter);           // protected sets CRUD

/* =========================
   404 – Not Found
   ========================= */
app.use((req, res, next) => {
  res.status(404).json({ err: 'Route not found' });
});

/* =========================
   Global Error Handler
   (keeps the process from crashing on unexpected errors)
   ========================= */
app.use((err, req, res, _next) => {
  // Log full error server-side
  console.error('Unhandled error:', {
    message: err.message,
    stack: err.stack,
  });

  // Choose a safe message for clients
  const status = err.status || 500;
  const payload = {
    err: err.expose ? err.message : 'Server error',
  };

  res.status(status).json(payload);
});

/* =========================
   Start server
   ========================= */
const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, () => {
  console.log(`✅ API listening on http://localhost:${PORT}`);
});
