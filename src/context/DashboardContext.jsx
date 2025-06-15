// src/context/DashboardContext.js
import React, { createContext, useContext, useState } from "react";

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [state, setState] = useState({});

  const setDashboardData = (key, value) => {
    setState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const getDashboardData = (key) => {
    return state[key];
  };

  return (
    <DashboardContext.Provider
      value={{ state, setDashboardData, getDashboardData }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error(
      "useDashboardContext must be used within DashboardProvider"
    );
  }
  return context;
};
