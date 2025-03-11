import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axios";
import useAuthStore from "@/app/login/hooks/useAuthStore";

export interface VehicleData {
  vehicleId: number;
  plateNumber: number;
  brand: string;
  model: string;
  customerId: number;
  appointments: [];
  customer: string;
}

const fetchVehicle = async (token: string | null): Promise<VehicleData[]> => {
  if (!token) {
    throw new Error("Authentication token not found");
  }

  const response = await axiosInstance.get("vehicle/viewvehiclebylogin", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
};

export const useVehicle = () => {
  const { token } = useAuthStore();

  return useQuery<VehicleData[], Error>({
    queryKey: ["viewvehiclebylogin", token],
    queryFn: () => fetchVehicle(token),
    enabled: !!token,
    retry: false,
  });
};
