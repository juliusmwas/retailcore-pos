import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // <--- This is why the browser was complaining!
});

export default api;