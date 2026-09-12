const configuredApiUrl = typeof process !== 'undefined' && process.env
  ? process.env.REACT_APP_API_URL
  : '';

export const API_BASE_URL = (configuredApiUrl || (
  typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5000'
)).replace(/\/+$/, '');
