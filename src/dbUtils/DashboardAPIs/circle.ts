import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axios";

export interface TopService {
  serviceId: number;
  serviceName: string;
  bookingCount: number;
  revenue: number;
}

const fetchCircle = async (): Promise<TopService[]> => {
  const response = await axiosInstance.get<TopService[]>(
    "dashboard/top-services"
  );
  return response.data;
};
export const useCircle = () => {
  return useQuery<TopService[], Error>({
    queryKey: ["top-services"],
    queryFn: fetchCircle,
  });
};
