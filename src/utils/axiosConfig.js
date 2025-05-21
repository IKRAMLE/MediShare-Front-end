import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with base URL
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

// Add request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    // Skip authentication for order creation
    if (config.url === '/orders' && config.method === 'post') {
      return config;
    }

    // Add auth token for other requests
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (token) {
      config.headers['x-auth-token'] = token;
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Clear auth data
        localStorage.removeItem('token');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        
        // Redirect to login if not already there and not creating an order
        if (!window.location.pathname.includes('/login') && 
            !(error.config.url === '/orders' && error.config.method === 'post')) {
          window.location.href = '/login2';
        }
      }
      // Return the error response for handling by the component
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;