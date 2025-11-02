import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BannerAdSlider from "./BannerAdSlider";
import { useRef } from "react";
import DashboardNav from "./DashboardNav";
import db from "../services/cocobase";

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const navCountRef = useRef(0);

  const user = db.user;
  return (
    <>
      <DashboardNav />

      {user ? children : <Navigate to="/login" />}
    </>
  );
};

export default PrivateRoute;
