import axios from "axios";
import Cookies from "js-cookie";

export const httpClient = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  timeout: 14000,

  // IMPORTANT: enables cookie-based auth
  withCredentials: true,
});

// ==============================
// REQUEST INTERCEPTOR
// ==============================
httpClient.interceptors.request.use(
  (config) => {
    /**
     * SAFE HYBRID MODE:
     * - If backend still uses Bearer token for SOME routes → keep support
     * - If cookie auth is used → ignore token safely
     */

    const token =
      Cookies.get("token") || localStorage.getItem("token");

    // Only attach Authorization if token exists AND route explicitly needs it
    if (token && config.headers?.useAuthHeader) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Always clean up custom flag (avoid sending to backend)
    delete config.headers?.useAuthHeader;

    return config;
  },
  (error) => Promise.reject(error)
);

// ==============================
// RESPONSE INTERCEPTOR
// ==============================
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "API Error:",
      error.response?.data || error.message
    );

    // Handle only real auth failures (not all errors)
    if (error.response?.status === 401) {
      handleSessionExpiration();
    }

    return Promise.reject(error);
  }
);

// ==============================
// SESSION HANDLER
// ==============================
function handleSessionExpiration() {
  Cookies.remove("token", { path: "/" });
  localStorage.removeItem("token");

  const publicPaths = ["/login", "/register"];
  const isPublicPath = publicPaths.some((path) =>
    window.location.pathname.startsWith(path)
  );

  if (!isPublicPath) {
    window.location.href = "/login";
  }
}

export default httpClient;