# MoodVerse API Documentation

Base URL: `/api`

## Authentication

### `POST /auth/register`
Creates a new user account.
- **Body**: `{ username, email, password, fullName }`
- **Response**: `{ _id, username, email, fullName, token }`

### `POST /auth/login`
Authenticates a user.
- **Body**: `{ identifier, password }` *(identifier can be email or username)*
- **Response**: `{ _id, username, email, fullName, token }`

### `GET /auth/me`
Retrieves the authenticated user's profile.
- **Headers**: `Authorization: Bearer <token>`
- **Response**: User object (without password hash)

---

## Mood Tracking

### `POST /mood`
Logs a new emotional state.
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ emotion: "Happy", intensity: 8, note?: "Great day!" }`
- **Response**: `{ message, pointsAwarded, totalPoints, newStreak }`

### `GET /mood`
Retrieves mood history for the authenticated user.
- **Headers**: `Authorization: Bearer <token>`
- **Query Params**: `limit` (default: 10), `skip` (default: 0)
- **Response**: Array of `MoodEntry` objects.

---

## AI & Intelligence

### `GET /ai/recommendations`
Fetches personalized entertainment recommendations based on the user's latest mood.
- **Headers**: `Authorization: Bearer <token>`
- **Response**: 
  ```json
  {
    "success": true,
    "basedOn": "Happy",
    "recommendations": {
      "movies": [...],
      "music": [...]
    }
  }
  ```

### `GET /ai/insights`
Generates a deep psychological analysis based on the user's recent mood history.
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ success: true, insights: "..." }`

---

## Socket.io Events

- `user:online` (Emitted by client) - Registers user as online.
- `friend:online` (Emitted by server) - Broadcasts to friends when someone connects.
- `mood:update` (Emitted by client) - Broadcasts a real-time mood change.
- `friend:mood_updated` (Emitted by server) - Notifies friends of the mood change.
- `chat:message` (Bi-directional) - Handles private messaging.
