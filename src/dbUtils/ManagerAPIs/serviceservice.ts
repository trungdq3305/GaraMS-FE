import axiosInstance from "../axios";

export const getServices = async () => {
  const response = await axiosInstance.get("service/services");
  return response.data;
};

export const addService = async (serviceData: {
    serviceId: number;
    serviceName: string;
    price: number;
    description: string;
  }) => {
    console.log(serviceData);
    const response = await axiosInstance.post("service/service", serviceData);
    return response.data;
  };

  export const updateService = async (serviceId: number, serviceData: {
    serviceId: number;
    serviceName: string;
    price: number;
    description: string;
  }) => {
    const response = await axiosInstance.put(`service/service/${serviceId}`, serviceData);
    return response.data;
  };

  export const deleteService = async (serviceId: number) => {
    await axiosInstance.delete(`service/service/${serviceId}`);
  };