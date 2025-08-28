// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BASEURL } from "../utils/utils";
import LoadingComponent from "../components/Loading";
import AdminChatPopup from "../components/AdminChat";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API_BASE = BASEURL;

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // stores logged-in user info
  const [accessToken, setAccessToken] = useState(null); // JWT token from backend
  const [loading, setLoading] = useState(true); // controls app-wide loading state
  const [verificationStatus, setVerificationStatus] = useState(null); // NEW: track email/phone verification
  const navigate = useNavigate();

  // On app load → check if token exists in localStorage
  useEffect(() => {
    const token = localStorage.getItem("xpay_token");
    if (token) {
      setAccessToken(token);
      fetchProfile(token); // also triggers verification fetch
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch user profile + verification status
  const fetchProfile = async (token) => {
    try {
      const res = await fetch(`${API_BASE}/auth/current-user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Unauthorized");
        } else {
          throw new Error("Failed to fetch profile");
        }
      }

      const data = await res.json();
      setUser(data);

      // After getting profile, fetch verification state
      fetchVerificationStatus(token);
    } catch (err) {
      if (err.name === "TypeError") {
        console.error(
          "Connectivity issue or server not reachable:",
          err.message
        );
      } else {
        console.error("Auth error:", err.message);
      }
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ username: email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.detail || "Login failed" };
      }

      const token = data.access_token;
      localStorage.setItem("xpay_token", token);
      setAccessToken(token);

      await fetchProfile(token);

      return { success: true, data };
    } catch (err) {
      console.error("Login error:", err);
      return { success: false, message: "Network error. Please try again." };
    }
  };

  // Logout → clear everything
  const logout = () => {
    localStorage.removeItem("xpay_token");
    setAccessToken(null);
    setUser(null);
    setVerificationStatus(null); // clear verification state too
    navigate("/login");
  };

  // Fetch helper that auto-attaches token
  const authFetch = async (url, options = {}) => {
    const token = accessToken;
    const headers = {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
    };

    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (res.status === 401) {
      logout();
      throw new Error("Unauthorized");
    }

    return res;
  };

  // ✅ NEW: Check email/phone verification status
  const fetchVerificationStatus = async (token) => {
    
    try {
      const res = await fetch(`${API_BASE}/auth/verification-status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setVerificationStatus(data);
        return data;
      }
    } catch (err) {
      console.error("Failed to fetch verification status:", err.message);
    }
  };

  const verifyEmail = async (email, otp) => {
    const res = await authFetch(`${API_BASE}/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();
    //  console.log(data);

    // if (!res.ok) {
    //   return {
    //     // success: false,
    //     message: data.detail || "Invalid or expired verification code",
    //   };
    // }

    fetchVerificationStatus();
    return data;
  };

  // NEW: Verify Phone
  const verifyPhone = async (phone_number, otp) => {
    const res = await authFetch(`${API_BASE}/auth/verify-phone`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone_number, otp }),
    });
    if (res.ok) fetchVerificationStatus();
    return res.ok;
  };

  //  NEW: Skip Phone Verification
  const skipPhoneVerification = async () => {
    const res = await authFetch(`${API_BASE}/auth/skip-phone-verification`, {
      method: "POST",
    });
    if (res.ok) fetchVerificationStatus();
    return res.ok;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        accessToken,
        login,
        logout,
        authFetch,
        verificationStatus, // 👈 expose verification state
        fetchVerificationStatus,
        verifyEmail,
        verifyPhone,
        skipPhoneVerification,
      }}
    >
      {loading && <LoadingComponent />}
      {!loading && children}
      {user && <AdminChatPopup />}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
