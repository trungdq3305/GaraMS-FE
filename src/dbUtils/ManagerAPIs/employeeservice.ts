import axiosInstance from "../axios";

export const getEmployees = async () => {
    const response = await axiosInstance.get("/employee");
    return response.data;
};

export const addEmployee = async (employeeData: {
    salary: number;
    specializedId: number;
    userId: number;
}) => {
    const response = await axiosInstance.post("/employee", employeeData);
    return response.data;
};

export const updateEmployee = async (id: number, employeeData: {
    salary: number;
    specializedId: number;
}) => {
    const response = await axiosInstance.put(`/employee/${id}`, employeeData);
    return response.data;
};
export const getSpecializations = async () => {
    const response = await axiosInstance.get("/employee/1/specialization");
    console.log(response.data)
    return response.data;
};
export const assignServiceToEmployee = async (id: number, serviceId: number) => {
    const response = await axiosInstance.post(`/employee/${id}/services/${serviceId}`);
    return response.data;
};
