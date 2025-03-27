import axiosInstance from "../axios";

export const getInventories = async () => {
  const response = await axiosInstance.get("inventory/inventories");
  return response.data;
};

export const getInventoryById = async (id: number) => {
  const response = await axiosInstance.get(`inventory/inventory/${id}`);
  return response.data;
};

export const addInventory = async (serviceData: {
  name: number;
  description: string;
  unit: string;
  price: number;
  status: string;
}) => {
  console.log(serviceData);
  const response = await axiosInstance.post("inventory/inventory", serviceData);
  return response.data;
};

export const updateInventory = async (
  id: number,
  serviceData: {
    name: number;
    description: string;
    unit: string;
    price: number;
    status: string;
  }
) => {
  const response = await axiosInstance.put(
    `inventory/inventory/${id}`,
    serviceData
  );
  return response.data;
};

export const deleteInventory = async (id: number) => {
  await axiosInstance.delete(`inventory/inventory/${id}`);
};
