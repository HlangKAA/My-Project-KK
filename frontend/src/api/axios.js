import axios from "axios";

// Create an Axios instance with default config
const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // To handle sessions/cookies if needed
});

// Interceptor for handling errors (e.g., global error logging)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  },
);

export default api;
