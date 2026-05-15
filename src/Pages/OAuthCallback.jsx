import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Cookies from "js-cookie";
import { userApi } from "../Api/userApi";
import { useAuth } from "../contexts/AuthContext";

const storeAuthToken = (token) => {
  if (!token) return;
  Cookies.set("token", token, { expires: 7, path: "/" });
  localStorage.setItem("token", token);
};

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuth();

  useEffect(() => {
    let cancelled = false;

    const completeLogin = async () => {
      const tokenFromUrl = searchParams.get("token");
      const tokenFromCookie = Cookies.get("token");

      const token = tokenFromUrl || tokenFromCookie;
      if (token) {
        storeAuthToken(token);
      }

      // Remove token from address bar
      if (tokenFromUrl) {
        window.history.replaceState({}, "", "/auth/google/callback");
      }

      try {
        const data = await userApi.getCurrentUser();
        if (cancelled) return;

        const userData = data.user || data.data || data;
        if (userData && typeof userData === "object" && userData.email) {
          setUser(userData);
          if (userData.role === "admin") {
            navigate("/admin-dashboard", { replace: true });
          } else {
            navigate("/", { replace: true });
          }
          return;
        }
      } catch (err) {
        console.error("OAuth callback session error:", err);
      }

      if (!cancelled) {
        navigate("/auth/google/failed?error=session", { replace: true });
      }
    };

    completeLogin();
    return () => {
      cancelled = true;
    };
  }, [navigate, searchParams, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <p className="text-gray-600 text-sm font-medium">Signing you in with Google…</p>
    </div>
  );
};

export default OAuthCallback;
