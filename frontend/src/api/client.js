import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
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
