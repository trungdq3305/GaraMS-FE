import axiosInstance from "../axios";

export const login = async (username: string, password: string) => {
  try {
    const response = await axiosInstance.post("controller/login", {
      username,
      password,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};
