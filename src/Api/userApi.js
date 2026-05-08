import { httpClient } from "./axiosInstance";

// MOCK: Local authentication for development without backend
const MOCK_USER = {
  name: "Admin User",
  email: "admin@example.com",
  role: "admin",
  avatar: { url: null },
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

  logout: async () => {
       await httpClient.post("/auth/logout")
   },
   
  getCurrentUser: async () => {
    const res = await httpClient.get("/user/get-user");
    return res.data;
  },

  // PRODUCT FETCHING
  getProducts: async (params) => {
    const res = await httpClient.get("/user/products", { params });
    return res.data;
  },

  getAllProducts: async () => {
    const res = await httpClient.get("/product/all-products");
    return res.data;
  },

  getProductById: async (id) => {
    const res = await httpClient.get(`/user/productss/${id}`);
    return res.data;
  },

  // CATEGORIES
  getCategories: async () => {
    const res = await httpClient.get("/user/categories");
    return res.data;
  },

  // PROFILE MANAGEMENT
  updateAccount: async (data) => {
    const res = await httpClient.put("/user/update-account", data);
    return res.data;
  },

  updatePassword: async (data) => {
    const res = await httpClient.put("/user/update-password", data);
    return res.data;
  },

  updateAvatar: async (formData) => {
    console.warn("updateAvatar backend not attached");
    return { success: true, avatar: { url: "path/to/new/avatar" } };
  },

  // GOOGLE OAUTH
  googleLogin: () => {
    const BACKEND_URL = "https://nut-backend-production-73f0.up.railway.app";

    window.location.href = `${BACKEND_URL}/api/v1/auth/google`;
  },

  handleGoogleCallback: async (code, state) => {
    const res = await httpClient.get("/auth/google/callback", {
      params: { code, state },
    });
    return res.data;
  },
};

export { userApi };
