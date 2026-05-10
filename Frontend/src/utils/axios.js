import axios from "axios";

// Hardcoding for absolute certainty in production debugging
const API_BASE_URL = "https://luminai-qdrn.onrender.com";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
