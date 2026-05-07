import { httpClient } from "./axiosInstance";

const ratingApi = {
  submitProductRating: async ({ userId, productId, rating, title, comment }) => {
    const payload = {
      rating: Number(rating),
      title,
      comment,
    };
    const url = `/product/user/${userId}/${rating}/${productId}`;
    console.log("[ratingApi] POST", url, payload);
    const res = await httpClient.post(url, payload);
    return res.data;
  },

  getProductReviews: async (productId) => {
    const res = await httpClient.get(`/product/${productId}/reviews`);
    return res.data;
  },
};

export { ratingApi };
