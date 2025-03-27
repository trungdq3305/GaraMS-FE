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

export const initiatePayPalPayment = async (total: number) => {
    try {
      const response = await axiosInstance.post('inventoryinvoices/payment', { 
        total 
      });
      return response.data; // Should return { checkoutUrl: 'https://www.sandbox.paypal.com/checkoutnow?token=...' }
    } catch (error) {
      console.error('PayPal payment initiation failed', error);
      throw error;
    }
  };