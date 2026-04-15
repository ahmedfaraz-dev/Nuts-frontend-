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
        const res = await httpClient.post("/user/register", userData);
        return res.data;
    },

    login: async (credentials) => {
        const res = await httpClient.post("/auth/login", credentials);
        return res.data;
    },

    getCurrentUser: async () => {
        const res = await httpClient.get('/user/get-user');
        return res.data;
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

    // PROFILE MANAGEMENT (Frontend ready, backend to be added by user)
    updateAccount: async (data) => {
        console.warn("updateAccount backend not attached");
        return { success: true, message: "Profile updated (Local Only)" };
    },

    updatePassword: async (data) => {
        console.warn("updatePassword backend not attached");
        return { success: true, message: "Password updated (Local Only)" };
    },

    updateAvatar: async (formData) => {
        console.warn("updateAvatar backend not attached");
        return { success: true, avatar: { url: "path/to/new/avatar" } };
    },
};

export { userApi };

