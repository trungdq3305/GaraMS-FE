import axiosInstance from "../axios";


interface RegisterUserRequest {
  userName: string;
  password: string;
  email: string;
  phoneNumber: string;
  fullName: string;
  address: string;
  roleId: number;
}

export const createUser = async (data: RegisterUserRequest) => {
  try {
    const response = await axiosInstance.post(`user/create-user`, data);
    return response.data;
  } catch (error: any) {
    console.error("Error creating user:", error.response || error);
    throw error.response?.data || error.message || "An error occurred";
  }
};
