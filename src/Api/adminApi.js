import { httpClient } from "./axiosInstance";

const adminApi = {
    // PRODUCTS
    getAllProducts: async () => {
        const res = await httpClient.get('/admin/products');
        return res.data;
    },
    createProduct: async (productData) => {
        const res = await httpClient.post('/admin/products', productData);
        return res.data;
    },
    editProduct: async (id, productData) => {
        const res = await httpClient.patch(`/admin/products/${id}`, productData);
        return res.data;
    },
    deleteProduct: async (id) => {
        const res = await httpClient.delete(`/admin/products/${id}`);
        return res.data;
    },

    // CATEGORIES
    getCategories: async () => {
        const res = await httpClient.get('/admin/categories');
        return res.data;
    },
    createCategory: async (categoryData) => {
        const res = await httpClient.post('/admin/categories', categoryData);
        return res.data;
    },
    editCategory: async (id, categoryData) => {
        const res = await httpClient.patch(`/admin/categories/${id}`, categoryData);
        return res.data;
    },
    deleteCategory: async (id) => {
        const res = await httpClient.delete(`/admin/categories/${id}`);
        return res.data;
    },

    // DEALS
    getDeals: async () => {
        const res = await httpClient.get('/admin/deals');
        return res.data;
    },
    createDeal: async (productId, dealData) => {
        const res = await httpClient.post(`/admin/products/${productId}/deals`, dealData);
        return res.data;
    },
    editDeal: async (productId, dealId, dealData) => {
        const res = await httpClient.patch(`/admin/products/${productId}/deals/${dealId}`, dealData);
        return res.data;
    },
    deleteDeal: async (productId, dealId) => {
        const res = await httpClient.delete(`/admin/products/${productId}/deals/${dealId}`);
        return res.data;
    },
    getCurrentProductDeal: async (productId) => {
        const res = await httpClient.get(`/admin/products/${productId}/deals/current`);
        return res.data;
    }
};


export { adminApi };
