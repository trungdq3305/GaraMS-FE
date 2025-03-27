import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    "https://garamsapi.lemoncliff-682dfe26.southeastasia.azurecontainerapps.io/api/",
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
  },
  // Tắt withCredentials nếu không cần thiết
  withCredentials: false,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Log request để debug
    console.log("Request Config:", config);
    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log("Response:", response);
    return response;
  },
  (error) => {
    console.error("Response Error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
