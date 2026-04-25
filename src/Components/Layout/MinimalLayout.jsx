// Components/Layout/MinimalLayout.jsx
import { Outlet } from "react-router-dom";
import ScrollToTop from "../ScrollToTop";

const MinimalLayout = () => {
  return (
    <>
      <ScrollToTop />
      <Outlet />
    </>
  );
};

export default MinimalLayout;
