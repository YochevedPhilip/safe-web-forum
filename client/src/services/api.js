import axios from "axios";

const apiUrl = import.meta.env.VITE_SERVER_API_URL;

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: { "Content-Type": "application/json" },
});

// Automatically adds token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// If we received 401 — token expired/invalid → remove and redirect to login
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      localStorage.removeItem("token");

      // If you have AuthContext with logout, prefer calling it instead:
      // authDispatch({ type: "LOGOUT" })
      // But for hackathon this is enough:
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
