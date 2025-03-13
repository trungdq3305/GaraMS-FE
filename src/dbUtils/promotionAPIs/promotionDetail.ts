import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axios";
import useAuthStore from "@/app/login/hooks/useAuthStore";

export interface ServicePromotionData {
  servicePromotionId: number;
  serviceId: number;
  promotionId: number;
  promotion: string;
  service: [];
}

export interface PromotionData {
  promotionId: number;
  promotionName: number;
  startDate: Date;
  endDate: Date;
  discountPercent: number;
  servicePromotions: ServicePromotionData[];
}

const fetchPromotionById = async (
  token: string | null,
  promotionId: number
): Promise<PromotionData> => {
  if (!token) {
    throw new Error("Authentication token not found");
  }

  const response = await axiosInstance.get(
    `promotion/promotion/${promotionId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data.data;
};

export const usePromotionDetail = (promotionId: number) => {
  const { token } = useAuthStore();

  return useQuery<PromotionData, Error>({
    queryKey: ["promotionDetail", promotionId, token],
    queryFn: () => fetchPromotionById(token, promotionId),
    enabled: !!token && !!promotionId,
    retry: false,
  });
};
