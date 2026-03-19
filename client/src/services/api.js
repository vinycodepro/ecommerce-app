// client/src/services/api.js
import axios from 'axios';

const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000/api"
    : "https://ecommerce-app-1-pxaw.onrender.com/api";



const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, 
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized access - logging out');
    }
    return Promise.reject(error);
  }
);

export default api;