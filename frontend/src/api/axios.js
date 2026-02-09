import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // change later when deployed
  withCredentials: true,
});

export default api;
