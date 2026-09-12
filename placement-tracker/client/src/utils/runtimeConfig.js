const configuredApiUrl = process.env.REACT_APP_API_URL;

export const API_BASE_URL = (
  configuredApiUrl ||
  (process.env.NODE_ENV === 'production'
    ? 'https://student-placement-tracker-1-m4i6.onrender.com'
    : 'http://localhost:5000')
).replace(/\/+$/, '');
