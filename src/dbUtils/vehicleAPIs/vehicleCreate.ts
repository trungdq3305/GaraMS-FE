import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../axios";
import useAuthStore from "@/app/login/hooks/useAuthStore";

export interface VehicleInput {
  plateNumber: string;
  brand: string;
  model: string;
}

const createVehicle = async (
  token: string | null,
  vehicleData: { plateNumber: string; brand: string; model: string }
) => {
  if (!token) {
    throw new Error("Authentication token not found");
  }

  const response = await axiosInstance.post(
    "vehicle/createvehicle",
    vehicleData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const useCreateVehicle = () => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newVehicle: {
      plateNumber: string;
      brand: string;
      model: string;
    }) => createVehicle(token, newVehicle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["createvehicle"] });
    },
  });
};
