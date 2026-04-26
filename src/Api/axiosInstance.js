import axios from "axios";
import Cookies from "js-cookie";

export const httpClient = axios.create({
  baseURL: "https://nut-backend-production-73f0.up.railway.app/api/v1",
  timeout: 14000,
});

httpClient.interceptors.request.use(
  (config) => {
    // Check Cookies first, then localStorage as fallback
    const token = Cookies.get("token") || localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "API Error:",
      error.response?.data || error.message
    );

    if (error.response?.status === 401) {
      handleSessionExpiration();
    }

    return Promise.reject(error);
  }
);

// 👉 Handle session expiration
function handleSessionExpiration() {
  Cookies.remove("token", { path: '/' });
  localStorage.removeItem("token");

  // Only redirect if not already on login or register pages to avoid loops
  const publicPaths = ["/login", "/register"];
  const isPublicPath = publicPaths.some(path => window.location.pathname.startsWith(path));

  if (!isPublicPath) {
    window.location.href = "/login";
  }
}