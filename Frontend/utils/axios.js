import axios from 'axios';

// Base URL for backend API. Adjust as needed for your deployment environment.
// In development, you may use a proxy or local backend URL.
const apiBaseUrl = process.env.REACT_APP_API_URL || '';

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Interceptor to handle 401 responses globally (optional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // You can implement logout or redirect logic here
      console.warn('Unauthorized - redirecting to login');
    }
    return Promise.reject(error);
  }
);

export default api;
