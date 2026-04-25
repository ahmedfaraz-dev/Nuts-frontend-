import { httpClient } from "./axiosInstance";

const paymentApi = {
    // Check out / Create order
    createOrder: async (orderData) => {
        const res = await httpClient.post("/payment/order", orderData);
        return res.data;
    },

    // Get My Orders (for customers)
    getMyOrders: async () => {
        const res = await httpClient.get("/user/my-orders");
        return res;
    },

    // Get All Orders (for admin)
    getAllOrders: async () => {
        const res = await httpClient.get("/admin/orders");
        return res;
    },

    // Update Order Status (for admin)
    updateOrderStatus: async (orderId, newStatus) => {
        const res = await httpClient.put(`/admin/orders/${orderId}`, { orderStatus: newStatus });
        return res;
    }
};

export { paymentApi };
