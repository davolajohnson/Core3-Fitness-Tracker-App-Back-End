# Core3 Fitness Tracker – Backend

## Overview
Express + MongoDB backend for the Core3 fitness tracker project.  
Features:
- User authentication with JWT (sign-up, sign-in, protected routes).
- CRUD operations for workouts (create, list, update, delete).
- Ownership enforced (users can only modify their own workouts).

## Requirements
- Node.js (>=18)
- MongoDB instance (local or Atlas)
- Environment variables set in `.env`

## Installation
```bash
git clone <repo-url>
cd core3-backend
npm install
```

## Environment Variables
Create a `.env` file in the root:

```
PORT=3001
MONGO_URI=mongodb://localhost:27017/core3
JWT_SECRET=supersecret
```

## Running the Server
```bash
npm run dev
```
Server will start at `http://localhost:3001`.

## API Endpoints

### Auth
- **POST** `/auth/sign-up` → Create account (username + password).
- **POST** `/auth/sign-in` → Log in and get JWT.
- **GET** `/auth/me` → Get current user (requires `Authorization: Bearer <token>`).

### Workouts
- **GET** `/workouts` → List all workouts.
- **POST** `/workouts` → Create workout (requires auth).
- **PUT** `/workouts/:id` → Update own workout (requires auth).
- **DELETE** `/workouts/:id` → Delete own workout (requires auth).

## Notes
- “Sign out” is client-side: just delete the JWT.  
- Use Postman or curl to test endpoints.  
