import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  // Keep withCredentials if your backend is configured for CORS with cookies,
  // but usually, for JWT, the Header is the most important part.
  withCredentials: true, 
});

// 🚀 THE FIX: Add the Request Interceptor
api.interceptors.request.use(
  (config) => {
    // 1. Get the auth data from localStorage
    const authData = localStorage.getItem("auth");
    
    if (authData) {
      const { token } = JSON.parse(authData);
      
      // 2. Attach the token to the Authorization header
      // It MUST be in the format: Bearer <token>
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;