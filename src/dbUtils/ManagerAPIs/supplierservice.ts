import axiosInstance from "../axios";

export const getSuppliers = async () => {
    const response = await axiosInstance.get("supplier/suppliers");
    return response.data;
};

export const addSupplier = async (serviceData: {
    supplierId: number;
    name: string;
    phone: string;
    email: string;
}) => {
    console.log(serviceData);
    const response = await axiosInstance.post("supplier/supplier", serviceData);
    return response.data;
};

export const updateSupplier = async (id: number, serviceData: {
    supplierId: number;
    name: string;
    phone: string;
    email: string;
}) => {
    const response = await axiosInstance.put(`supplier/supplier/${id}`, serviceData);
    return response.data;
};

export const deleteSupplier = async (id: number) => {
    await axiosInstance.delete(`supplier/supplier/${id}`);
};