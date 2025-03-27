import axiosInstance from "../axios";


export const addInventoryToCart = async (inventoryId: number): Promise<any> => {
    try {
        console.log(inventoryId)
        const response = await axiosInstance.post(`inventoryinvoicedetails`, null, {
            params: { inventoryId }
        });
        return response.data;
    } catch (error) {
        console.error('Error adding inventory to cart:', error);
        throw error;
    }
};

export const getCartItems = async (): Promise<any> => {
    try {
        const response = await axiosInstance.get(`inventoryinvoicedetails`);
        return response.data;
    } catch (error) {
        console.error('Error fetching cart items:', error);
        throw error;
    }
};

export const removeCartItem = async (inventoryInvoiceDetailId: number): Promise<any> => {
    try {
        const response = await axiosInstance.delete(`inventoryinvoicedetails`, {
            params: { inventoryInvoiceDetailId }
        });
        return response.data;
    } catch (error) {
        console.error('Error removing cart item:', error);
        throw error;
    }
};

export const updateCartItemQuantity = async (inventoryInvoiceDetailId: number, quantity: number): Promise<any> => {
    try {
        const response = await axiosInstance.put(`inventoryinvoicedetails`, { 
            inventoryInvoiceDetailId, 
            quantity 
        });
        return response.data;
    } catch (error) {
        console.error('Error updating cart item quantity:', error);
        throw error;
    }
};

export const getCartTotal = async (): Promise<any> => {
    try {
        const response = await axiosInstance.get(`inventoryinvoicedetails/total`);
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error('Error fetching cart total:', error);
        throw error;
    }
};