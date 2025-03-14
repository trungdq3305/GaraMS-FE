// appointmentAPIs.ts
import axiosInstance from "../axios"; // Adjust the path as needed

// Types
export interface AppointmentCreateDTO {
  appointmentId: number;
  date: string;
  note: string;
  status: string;
  vehicleId: number;
  serviceIds: number[]; // Array of service IDs
}

export interface AppointmentResponse {
  isSuccess: boolean;
  code: number;
  data?: unknown;
  message: string;
}

export const createAppointment = async (
  appointment: AppointmentCreateDTO
): Promise<AppointmentResponse> => {
  try {
    const response = await axiosInstance.post("appointments", appointment);
    return response.data;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error; // Let the component handle the error
  }
};

export const updateAppointment = async (
  appointment: AppointmentCreateDTO
): Promise<AppointmentResponse> => {
  // Call createAppointment with the update data
  return createAppointment(appointment);
};

export const getAppointments = async (): Promise<AppointmentResponse> => {
  try {
    const response = await axiosInstance.get("appointments");
    return response.data;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error; // Let the component handle the error
  }
};
export const getAppointmentsByCustomer = async () => {
  const response = await axiosInstance.get("appointments/viewvehiclebylogin");
  return response.data;
};
