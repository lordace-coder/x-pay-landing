// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "../components/Loading";
import AdminChatPopup from "../components/AdminChat";
import db from "../services/cocobase";
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);


const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // controls app-wide loading state
  const navigate = useNavigate();

  // On app load → check if token exists in localStorage
  useEffect(() => {
    initAuth();
  }, []);

  const login = async (email, password) => {
    await db.login(email, password);
    setUser(db.user);
    return;
  };

  const signup = async (email, password, data) => {
    await db.register(email, password, data);
    setUser(db.user);
  };
  // Logout → clear everything
  const logout = () => {
    db.logout();
    navigate("/login");
  };

  const initAuth = async () => {
    try {
      await db.initAuth();
      if (db.user) {
        setUser(db.user);
        setLoading(false);
        return;
      }
      const user = await db.getCurrentUser();
      console.log(user, "user");

      if (user) setUser(user);
      setLoading(false);
    } catch (error) {}
    setLoading(false);
    logout();
  };

  const completeGoogleAuth = async (token) => {
    try {
      setLoading(true);
    } catch (error) {
      console.error("Google Auth Error:", error);
    } finally {
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
        completeGoogleAuth,
        logout,
      }}
    >
      {loading && <LoadingComponent />}
      {!loading && children}
      {user && <AdminChatPopup />}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
