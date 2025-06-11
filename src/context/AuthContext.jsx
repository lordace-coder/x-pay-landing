// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API_BASE = "https://your-fastapi-url.com";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("xpay_token");
    if (token) {
      setAccessToken(token);
      fetchProfile(token);
    } else {
      setLoading(false);
    }
  }, []);

const fetchProfile = async (token) => {
  try {
    const res = await fetch(`${API_BASE}/auth/profile`, {
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
  } catch (err) {
    if (err.name === "TypeError") {
      // TypeError is usually thrown by fetch when there’s a network issue
      console.error("Connectivity issue or server not reachable:", err.message);
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Login failed");
      const data = await res.json();
      const token = data.access_token;
      localStorage.setItem("xpay_token", token);
      setAccessToken(token);
      await fetchProfile(token);
      return true;
    } catch (err) {
      console.error("Login error:", err);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("xpay_token");
    setAccessToken(null);
    setUser(null);
    navigate("/login");
  };

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

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        accessToken,
        login,
        logout,
        authFetch,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
