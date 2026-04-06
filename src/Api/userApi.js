import { httpClient } from "./axiosInstance";

// MOCK: Local authentication for development without backend
const MOCK_USER = {
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    avatar: { url: null }
};

const userApi = {
    register: async (userData) => {
        console.log("Mock Register:", userData);
        return { success: true, message: "Registered successfully (Mock)" };
    },

    login: async (credentials) => {
        console.log("Mock Login:", credentials);
        return { success: true, message: "Logged in successfully (Mock)" };
    },

    getCurrentUser: async () => {
        // Return null if you want to test logged out state
        return { success: true, data: MOCK_USER };
    },

    logout: async () => {
        console.log("Mock Logout");
        return { success: true };
    },

    // PRODUCT FETCHING
    getProducts: async (params) => {
        const res = await httpClient.get('/user/products', { params });
        return res.data;
    },

    getAllProducts: async () => {
        const res = await httpClient.get('/product/all-products');
        return res.data;
    },

    getProductById: async (id) => {
        const res = await httpClient.get(`/user/productss/${id}`);
        return res.data;
    },
};

export { userApi };

