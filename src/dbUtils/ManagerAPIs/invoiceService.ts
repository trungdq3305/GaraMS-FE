import axiosInstance from "../axios";
  export const updateDeliveryType = async (diliverType: 'Shipping' | 'AtStore'): Promise<any> => {
    try {
        const response = await axiosInstance.put(`inventoryinvoices/dilivertype`, null, {
            params: { diliverType }
        });
        
        return response.data;
    } catch (error) {
        console.error('Error updating delivery type:', error);
        throw error;
    }
};

export const updatePaymentMethod = async (paymentMethod: 'PayNow' | 'AtStore'): Promise<any> => {
    try {
        const response = await axiosInstance.put(`inventoryinvoices/paymentmethod`, null, {
            params: { paymentMethod }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating payment method:', error);
        throw error;
    }
};