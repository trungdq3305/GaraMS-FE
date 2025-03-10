import axiosInstance from "../axios";

export const getPromotions = async () => {
    const response = await axiosInstance.get("promotion/promotions");
    return response.data.data.map((promotion: any) => ({
        promotionId: promotion.promotionId,
        promotionName: promotion.promotionName,
        startDate: promotion.startDate,
        endDate: promotion.endDate,
        discountPercent: promotion.discountPercent,
        serviceIds: promotion.servicePromotions.map((sp: any) => sp.serviceId),
    }));
};
export const updatePromotion = async (id: number, promotionData: {
    promotionName: string;
    startDate: string;
    endDate: string;
    discountPercent: number;
}) => {
    const response = await axiosInstance.put(`promotion/promotion/${id}`, promotionData);
    return response.data;
};

export const deletePromotion = async (id: number) => {
    await axiosInstance.delete(`promotion/promotion/${id}`);
};

export const createPromotion = async (promotionData: {
    promotionName: string;
    startDate: string;
    endDate: string;
    discountPercent: number;
    serviceIds: number[];
}) => {
    const formattedData = {
        promotionId: 0, // Backend có thể tự generate ID
        promotionName: promotionData.promotionName,
        startDate: promotionData.startDate,
        endDate: promotionData.endDate,
        discountPercent: promotionData.discountPercent,
        discountAmount: 0,
        servicePromotions: promotionData.serviceIds.map(serviceId => ({
            servicePromotionId: 0,
            serviceId: serviceId,
            promotionId: 0,
            originalPrice: 0,
            discountedPrice: 0,
        })),
    };

    const response = await axiosInstance.post("promotion/promotion", formattedData);
    return response.data;
};
