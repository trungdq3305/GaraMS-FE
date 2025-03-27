import axiosInstance from "../axios";

export const getServices = async () => {
  const response = await axiosInstance.get("service/services");
  return response.data;
};

export const getServiceById = async (serviceId: number) => {
  const response = await axiosInstance.get(`service/service/${serviceId}`);
  return response.data;
};

export const addService = async (serviceData: {
  serviceId: number;
  serviceName: string;
  servicePrice: number;
  description: string;
  warrantyPeriod: number;
}) => {
  const response = await axiosInstance.post("service/service", serviceData);
  return response.data;
};

export const updateService = async (
  serviceId: number,
  serviceData: {
    serviceId: number;
    serviceName: string;
    servicePrice: number;
    description: string;
    warrantyPeriod: number;
  }
) => {
  const response = await axiosInstance.put(
    `service/service/${serviceId}`,
    serviceData
  );
  return response.data;
};

export const deleteService = async (serviceId: number) => {
  await axiosInstance.delete(`service/service/${serviceId}`);
};