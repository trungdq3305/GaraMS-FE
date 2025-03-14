import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axios";
import useAuthStore from "@/app/login/hooks/useAuthStore";

export interface ServiceData {
  serviceId: number;
  serviceName: string;
  description: string;
  servicePrice: number;
  inventoryPrice: number;
  promotion: number;
  totalPrice: number;
  estimatedTime: number;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  warrantyPeriod: number;
  categoryId: number;
  appointmentServices: [];
  category: number;
  serviceEmployees: [];
  serviceInventories: [];
  servicePromotions: [null];
  warrantyHistories: [];
}

export interface ServicePromotionData {
  servicePromotionId: number;
  serviceId: number;
  promotionId: number;
  promotion: string;
  service: ServiceData[];
}

export interface PromotionData {
  promotionId: number;
  promotionName: number;
  startDate: Date;
  endDate: Date;
  discountPercent: number;
  servicePromotions: ServicePromotionData[];
}

const fetchPromotion = async (
  token: string | null
): Promise<PromotionData[]> => {
  if (!token) {
    throw new Error("Authentication token not found");
  }

  const response = await axiosInstance.get("promotion/promotions", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
};

export const usePromotion = () => {
  const { token } = useAuthStore();

  return useQuery<PromotionData[], Error>({
    queryKey: ["promotions", token],
    queryFn: () => fetchPromotion(token),
    enabled: !!token,
    retry: false,
  });
};
