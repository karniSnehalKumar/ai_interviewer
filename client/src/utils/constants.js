// Shared app-wide constants

// Base URL for all API requests to the backend server.
// Set VITE_SERVER_URL in your hosting platform's env config for production
// (e.g. https://your-api.onrender.com). Falls back to localhost for local dev.
export const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";