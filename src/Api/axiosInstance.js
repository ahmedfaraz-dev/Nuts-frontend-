// import axios from "axios";

// const api = axios.create({
//     baseURL: "http://localhost:8000/api/v1",
// });

// export {api};

// src/utils/httpClient.js

import axios from "axios";
import Cookies from "js-cookie";

// You can move this to .env
// const API_BASE_URL =
//   process.env.REACT_APP_API_BASE_URL ||
//   "http://localhost:8000/api/v1";

export const httpClient = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  timeout: 10000,
});

httpClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");

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
  Cookies.remove("token");
  // Optional: clear any other user-related items
  // localStorage.removeItem("user");

  // redirect user (React way)
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}