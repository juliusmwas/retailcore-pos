import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, 
});

// --- REQUEST: Attach the token ---
api.interceptors.request.use(
  (config) => {
    const authData = localStorage.getItem("auth");
    if (authData) {
      const { token } = JSON.parse(authData);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- RESPONSE: Catch expired tokens ---
api.interceptors.response.use(
  (response) => response, 
  (error) => {
    // If the server sends 401, the token is dead
    if (error.response && error.response.status === 401) {
      console.warn("Session expired. Logging out...");
      
      // Clear the "auth" data so the app doesn't try to use the old token again
      localStorage.removeItem("auth"); 
      
      // Redirect to login page with a message in the URL
      window.location.href = "/login?reason=expired";
    }
    return Promise.reject(error);
  }
);

export default api;