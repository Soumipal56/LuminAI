import axios from "axios";
import API from "../config/api.config.js";

const axiosInstance = axios.create({
  baseURL: API.baseUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
