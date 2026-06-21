import axios from 'axios';

// In development, use the local Flask server.
// In production (Vercel), API is served from the same origin via rewrites.
const BASE_URL = import.meta.env.PROD
  ? '/api'
  : import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor for error handling
API.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error('[API Error]', err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export const getProjects = () => API.get('/projects');
export const getSkills   = () => API.get('/skills');
export const postContact = (data) => API.post('/contact', data);

export default API;
