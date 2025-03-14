import axiosInstance from "../axios";

export const getReports = async () => {
    const response = await axiosInstance.get("report/reports");
    return response.data;
};