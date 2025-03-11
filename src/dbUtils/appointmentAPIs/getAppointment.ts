/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axios";
import useAuthStore from "@/app/login/hooks/useAuthStore";

export interface Service {
  serviceId: number;
  serviceName: string;
  description: string;
  servicePrice: number;
  inventoryPrice: number;
  promotion: number;
  totalPrice: number;
  estimatedTime: number;
  status: boolean;
}

export interface AppointmentService {
  appointmentServiceId: number;
  serviceId: number;
  appointmentId: number;
  service: Service;
}

export interface Appointment {
  appointmentId: number;
  date: string;
  note: string;
  status: string;
  vehicleId: number;
  waitingTime: number;
  rejectReason: string;
  appointmentServices: AppointmentService[];
}

export interface VehicleData {
  vehicleId: number;
  plateNumber: string;
  brand: string;
  model: string;
  customerId: number;
  appointments: Appointment[];
}

const fetchAppointment = async (
  token: string | null
): Promise<VehicleData[]> => {
  if (!token) {
    throw new Error("Authentication token not found");
  }

  const response = await axiosInstance.get("appointments", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const appointments = response.data.data;

  const vehicleMap: Record<number, VehicleData> = {};

  appointments.forEach((appointment: any) => {
    const vehicle = appointment.vehicle;

    if (!vehicleMap[vehicle.vehicleId]) {
      vehicleMap[vehicle.vehicleId] = {
        vehicleId: vehicle.vehicleId,
        plateNumber: vehicle.plateNumber,
        brand: vehicle.brand,
        model: vehicle.model,
        customerId: vehicle.customerId,
        appointments: [],
      };
    }

    vehicleMap[vehicle.vehicleId].appointments.push({
      appointmentId: appointment.appointmentId,
      date: appointment.date,
      note: appointment.note,
      status: appointment.status,
      vehicleId: appointment.vehicleId,
      waitingTime: appointment.waitingTime,
      rejectReason: appointment.rejectReason,
      appointmentServices: appointment.appointmentServices.map(
        (service: any) => ({
          appointmentServiceId: service.appointmentServiceId,
          serviceId: service.serviceId,
          appointmentId: service.appointmentId,
          service: {
            serviceId: service.service.serviceId,
            serviceName: service.service.serviceName,
            description: service.service.description,
            servicePrice: service.service.servicePrice,
            inventoryPrice: service.service.inventoryPrice,
            promotion: service.service.promotion,
            totalPrice: service.service.totalPrice,
            estimatedTime: service.service.estimatedTime,
            status: service.service.status,
          },
        })
      ),
    });
  });

  return Object.values(vehicleMap);
};

export const useAppointment = () => {
  const { token } = useAuthStore();

  return useQuery<VehicleData[], Error>({
    queryKey: ["vehicles", token],
    queryFn: () => fetchAppointment(token),
    enabled: !!token,
    retry: false,
  });
};
