import axios from "axios";

axios.defaults.baseURL = "http://localhost:8000/api";

axios.defaults.headers.common["Accept"] = "application/json";

const token = localStorage.getItem("token");
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axios;
