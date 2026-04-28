# Lifeline Server

Simple Express server for SOS emergency creation (in-memory store).

Run locally:

```bash
cd server
npm install
npm start
```

API:

- POST `/api/emergencies` - body: `{ type, lat, lng, userId }` (lat/lng as numbers). Returns created emergency.
- GET `/api/emergencies` - list all emergencies (debug)
- GET `/api/emergencies/:id` - get emergency by id
