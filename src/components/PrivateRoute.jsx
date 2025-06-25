import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ImagePopupAd from "./PopupAds";
import { useEffect, useState, useRef } from "react";
import { BASEURL } from "../utils/utils";
import DashboardNav from "./DashboardNav";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [showAd, setShowAd] = useState(false);
  const [ads, setAds] = useState([]);
  const [selectedAd, setSelectedAd] = useState(null);
  const navCountRef = useRef(0);

  useEffect(() => {
    if (ads.length === 0) {
      fetchAds();
    }

    setShowAd(false);

    const randomAd = selectRandomAd();
    setSelectedAd(randomAd);
    setShowAd(true);
  }, [location.pathname]);

  const handleAdClose = () => {
    setShowAd(false);
  };

  const fetchAds = async () => {
    try {
      const req = await fetch(BASEURL + "/ads/random-banners?count=4");
      const res = await req.json();
      setAds(res);
    } catch (err) {
      console.error("Failed to fetch ads:", err);
    }
  };

  const selectRandomAd = () => {
    const index = Math.floor(Math.random() * ads.length);
    return ads[index];
  };

  return (
    <>
      {selectedAd && (
        <ImagePopupAd
          isOpen={showAd}
          onClose={handleAdClose}
          imageUrl={selectedAd.media_url}
          ctaUrl={selectedAd.target_url}
        />
      )}
      <DashboardNav />
      {user ? children : <Navigate to="/login" />}
    </>
  );
};

export default PrivateRoute;
