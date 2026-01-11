import axios from "axios";

const apiUrl = import.meta.env.VITE_SERVER_API_URL;

const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: { "Content-Type": "application/json" },
});

// מוסיף token אוטומטית לכל בקשה
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// אם קיבלנו 401 — token פג/לא תקין → מוחקים ומפנים ללוגין
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      localStorage.removeItem("token");

      // אם יש לך AuthContext עם logout עדיף לקרוא אליו במקום:
      // authDispatch({ type: "LOGOUT" })
      // אבל להאקתון זה מספיק:
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
