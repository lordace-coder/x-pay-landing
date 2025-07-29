import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BannerAdSlider from "./BannerAdSlider";
import { useRef } from "react";
import DashboardNav from "./DashboardNav";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navCountRef = useRef(0);

  return (
    <>
      <DashboardNav />

      {user ? children : <Navigate to="/login" />}
    </>
  );
};

export default PrivateRoute;
