import { message } from "antd";
import axiosInstance from "../axios";


export const getUsers = async () => {
    const response = await axiosInstance.get("/user/get-all");
    return response.data;
};

export const updateUser = async (id: number, userData: {
    phone: string;
    email: string;
    fullName: string;
    address: string;
}) => {
    try {
        const response = await axiosInstance.put(`/user/get-all?id=${id}`, userData);
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error; // Re-throw the error to handle it in the calling function
    }
};

export const createUser = async (userData: {
    userName: string;
    password: string;
    email: string;
    phoneNumber: string;
    fullName: string;
    address: string;
    roleId: number;
}) => {
    try {
        const response = await axiosInstance.post("/user/create-user", userData);
        return response.data;
    } catch (error) {
        console.error("Error creating user:", error);
        message.error("Failed to add user.");
        throw error;
    }
};

export const confirmUserStatus = async (userId: number) => {
    try {
        const response = await axiosInstance.post(`/user/confirm-status?userId=${userId}`);
        console.log(response)
        return response.data;
    } catch (error) {
        console.error("Error confirming user status:", error);
        throw error;
    }
};
