import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../Api/userApi";

const OAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await userApi.getCurrentUser(); // call /me API

        if (data.user?.role === "admin") {
          navigate("/admin-dashboard", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } catch (err) {
        navigate("/login", { replace: true });
      }
    };

    fetchUser();
  }, []);

  return <div>Logging you in...</div>;
};

export default OAuthCallback;