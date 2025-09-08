# CORE3 API CRUD Test Template

Use this table to track all CRUD operations tested in Postman.  


| Resource  | Action     | Method | Endpoint                          | Request Body Example                              | Expected Response             | Status |
|-----------|------------|--------|-----------------------------------|--------------------------------------------------|-------------------------------|--------|
| Auth      | Sign Up    | POST   | `/auth/sign-up`                   | `{ "username": "testuser", "password": "123" }`  | `{ "token": "<jwt>" }`        | Pass/Fail |
| Auth      | Sign In    | POST   | `/auth/sign-in`                   | `{ "username": "testuser", "password": "123" }`  | `{ "token": "<jwt>" }`        | Pass/Fail |
| Workout   | Create     | POST   | `/workouts`                       | `{ "date": "2025-09-07", "notes": "Chest" }`     | Workout object with `_id`     | Pass/Fail |
| Workout   | List       | GET    | `/workouts`                       | –                                                | `[ { "_id": "...", ... } ]`   | Pass/Fail |
| Workout   | Get Detail | GET    | `/workouts/:id`                   | –                                                | Workout with exercises & sets | Pass/Fail |
| Workout   | Update     | PUT    | `/workouts/:id`                   | `{ "notes": "Updated notes" }`                   | Updated workout object        | Pass/Fail |
| Workout   | Delete     | DELETE | `/workouts/:id`                   | –                                                | `204 No Content`              | Pass/Fail |
| Exercise  | Create     | POST   | `/workouts/:id/exercises`         | `{ "name": "Bench Press", "type": "Chest" }`     | Exercise object with `_id`    | Pass/Fail |
| Exercise  | Update     | PUT    | `/exercises/:id`                  | `{ "name": "Incline Bench" }`                    | Updated exercise object       | Pass/Fail |
| Exercise  | Delete     | DELETE | `/exercises/:id`                  | –                                                | `204 No Content`              | Pass/Fail |
| Set       | Create     | POST   | `/exercises/:id/sets`             | `{ "weight": 60, "reps": 8, "rpe": 8 }`          | Set object with `_id`         | Pass/Fail |
| Set       | Update     | PUT    | `/sets/:id`                       | `{ "reps": 10 }`                                 | Updated set object            | Pass/Fail |
| Set       | Delete     | DELETE | `/sets/:id`                       | –                                                | `204 No Content`              | Pass/Fail |
