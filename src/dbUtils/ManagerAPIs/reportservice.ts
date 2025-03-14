import axiosInstance from "../axios";

export const createReport = async (reportData: {
  problem: string;
  title: string;
  description: string;
  customerId: number;
}) => {
  const response = await axiosInstance.post("report/report", reportData);
  return response.data;
};
export const getReports = async () => {
    const response = await axiosInstance.get("report/reports");
    return response.data;
};
