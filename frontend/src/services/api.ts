import axios, { AxiosError } from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "Application/json",
  },
  timeout: 10000,
});

// request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with error
      const errorMessage = (error.response.data as any)?.error || "Something went wrong";
      return Promise.reject({
        message: errorMessage,
        statusCode: error.response.status,
      });
    } else if (error.request) {
      // Request made but no response
      return Promise.reject({
        message: "Network error. Please check your connection.",
        statusCode: 0,
      });
    } else {
      // Something else happened
      return Promise.reject({
        message: error.message || "An unexpected error occurred",
        statusCode: 0,
      });
    }
  },
);

export default api;
