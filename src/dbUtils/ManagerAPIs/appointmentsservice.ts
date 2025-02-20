import axiosInstance from "../axios";

export const getAppointments = async () => {
  const response = await axiosInstance.get("appointments");
  return response.data;
};

export const updateAppointmentStatus = async (
  appointmentId: number,
  status: string,
  reason?: string
) => {
  const url = `appointments/status-update/${appointmentId}?status=${status}`;
  const finalUrl = reason ? `${url}&reason=${reason}` : url;
  const response = await axiosInstance.put(finalUrl);
  return response.data;
};
