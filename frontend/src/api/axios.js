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
      try {
        const parsed = JSON.parse(authData);

        // This is the fix: It looks for 'token' inside the object you just showed me
        const token = parsed.token;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          console.warn("Auth data found, but no token field exists inside it.");
        }
      } catch (e) {
        console.error("Error parsing authData from localStorage", e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// --- RESPONSE: Catch expired tokens ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Session expired. Logging out...");
      localStorage.removeItem("auth");
      window.location.href = "/login?reason=expired";
    }
    return Promise.reject(error);
  },
);

export default api;
