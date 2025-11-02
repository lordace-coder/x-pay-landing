// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BASEURL } from "../utils/utils";
import LoadingComponent from "../components/Loading";
import AdminChatPopup from "../components/AdminChat";
import db from "../services/cocobase";
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API_BASE = BASEURL;

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // controls app-wide loading state
  const navigate = useNavigate();

  // On app load → check if token exists in localStorage
  useEffect(() => {
    db.initAuth().then(() => {
      if (db.isAuthenticated()) {
        setUser(db.user);
        setLoading(false);
      }
    });
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
      {loading && <LoadingComponent />}
      {!loading && children}
      {user && <AdminChatPopup />}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
