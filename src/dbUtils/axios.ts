import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://localhost:7102/api/",
  headers: {
    "Content-Type": "application/json",
  },
});
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token"); // Lấy token từ localStorage (hoặc từ Redux, Zustand...)
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
