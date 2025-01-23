import axios from 'axios';

// Function to retrieve the token from localStorage
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return '';
};

// Create an axios instance with a base URL
const instance = axios.create({
  baseURL: "https://localhost:7156/",
  headers: {
    "Content-Type": "application/json"
  }
});

// Use an interceptor to append the Authorization header before each request
instance.interceptors.request.use(
  config => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default instance;
