# QuizMaster API Documentation

## Base URL
`/api`

## Authentication

### `POST /api/auth/register`
Register a new user.
- **Body**: `{ "name": "John", "email": "john@test.com", "password": "pass" }`

### `POST /api/auth/login`
Authenticate a user.
- **Body**: `{ "email": "john@test.com", "password": "pass" }`

### `GET /api/auth/me`
Get current user profile (Requires Bearer Token).

## Admin

All admin routes require a Bearer token for a user with `role: "admin"`.

### `GET /api/admin/users`
Get all users.

### `GET /api/admin/analytics`
Get aggregated dashboard statistics.

### `GET /api/admin/questions`
Get custom DB questions.

### `POST /api/admin/questions`
Add a custom question.

## Quizzes

### `POST /api/quiz-attempts`
Submit a quiz attempt to get XP, adjust streaks, and check achievements.
- **Body**: `{ "score": 8, "percentage": 80, "category": "Science", "difficulty": "medium", "totalQuestions": 10, "correctAnswers": 8 }`

## Leaderboard

### `GET /api/leaderboard/global`
Get top 100 users sorted by XP.

## Certificates

### `POST /api/certificates`
Generate a certificate after finishing a quiz.
- **Body**: `{ "quizCategory": "Science", "score": 80 }`

### `GET /api/certificates/verify/:id`
Verify the authenticity of a certificate ID.
