# Known Limitations (v1.0)

While MoodVerse is production-ready, the following architectural and feature limitations exist in the 1.0 Release Candidate. These represent opportunities for future phases (v1.1+).

## 1. Datasets & Memory
- The application parses over 100,000 embedded CSV records (`indian movies.csv` and `spotify_tracks.csv`) on backend initialization.
- **Limitation**: While the O(N) search was optimized to an early-termination loop, keeping ~20MB of JSON datasets in Node.js RAM limits horizontal scaling density.
- **Future Solution**: Migrate the CSV datasets into a dedicated MongoDB collection and utilize full-text search or vector embeddings.

## 2. Recommendation Diversity
- The recommendation engine relies on static heuristic mappings (e.g., "Sad" maps to `valence < 0.4`).
- **Limitation**: The fallback AI does not actually learn from user behavior (e.g., it will not notice if a user always rejects Action movies when Angry).
- **Future Solution**: Implement collaborative filtering or fine-tune an ML model based on user click-through rates.

## 3. Real-Time Chat Persistence
- **Limitation**: The Socket.io chat system currently acts as an ephemeral communication layer. Messages are pushed to connected clients but are not saved to a `Messages` collection in MongoDB.
- **Future Solution**: Add a `Message` schema and a REST endpoint to fetch chat history, allowing users to view messages sent while they were offline.

## 4. Friend System
- **Limitation**: The current system simulates a global friend pool or relies on hardcoded demographic matching for demo purposes. True bi-directional friend requests (Pending, Accepted, Rejected) are mocked.
- **Future Solution**: Implement a robust Friend graph in MongoDB.

## 5. Rate Limiting
- **Limitation**: The Express backend currently lacks a rate-limiting middleware (like `express-rate-limit`).
- **Future Solution**: Implement Redis-backed rate limiting on all public API endpoints to prevent API abuse, especially on the `POST /auth/login` and Gemini AI endpoints.
