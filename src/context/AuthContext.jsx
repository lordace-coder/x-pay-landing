// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "../components/Loading";
import AdminChatPopup from "../components/AdminChat";
import db from "../services/cocobase";
import { GoogleOAuthProvider } from "@react-oauth/google";
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // controls app-wide loading state
  const [authInitialized, setAuthInitialized] = useState(false);
  const navigate = useNavigate();

  // On app load → check if token exists in localStorage
  useEffect(() => {
    if (!authInitialized) {
      initAuth();
    }
  }, [authInitialized]);

  // Register auth event listeners once (after mount).
  // Keep registration inside useEffect so we can clean up on unmount
  // and avoid duplicate handlers during hot-reload/rehydration.
  useEffect(() => {
    try {
      // Register auth events; the library does not return an unsubscribe
      db.auth.onAuthEvent({
        onLogin: (user) => {
          console.log("User logged in:", user);
          setUser(user);
          // Only navigate if not already on dashboard to avoid extra history entries
          if (window.location.pathname !== "/dashboard") {
            navigate("/dashboard");
          }
        },
        onLogout: () => {
          setUser(null);
          // Keep logout navigation explicit
          if (window.location.pathname !== "/login") {
            navigate("/login");
          }
        },
      });
    } catch (err) {
      console.warn("Failed to register auth events:", err);
    }

    return () => {
      try {
        if (db && db.auth && typeof db.auth.clearAuthEvents === "function") {
          db.auth.clearAuthEvents();
        }
      } catch (err) {
        console.warn("Error during auth event cleanup:", err);
      }
    };
  }, [navigate]);

  const login = async (email, password) => {
    await db.login(email, password);
    return;
  };

  const signup = async (email, password, data) => {
    await db.register(email, password, data);
  };
  // Logout → clear everything
  const logout = () => {
    db.logout();
  };

  const initAuth = async () => {
    try {
      setAuthInitialized(true); // Prevent multiple calls
      await db.auth.initAuth();

      if (db.user) {
        setUser(db.user);
      setLoading(false);

        return;
      }
      logout();
      setLoading(false);
    } catch (error) {
      console.error("initAuth error:", error);
      logout();
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signup,
        login,
        logout,
      }}
    >
      <GoogleOAuthProvider clientId="186441653465-23temfushrlnkfg9l4lco2n3ru2fgeah.apps.googleusercontent.com">
        {loading && <LoadingComponent />}
        {!loading && children}
        {user && <AdminChatPopup />}
      </GoogleOAuthProvider>
    </AuthContext.Provider>
  );
};

export default AuthProvider;
