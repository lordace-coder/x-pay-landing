// src/context/DashboardContext.js
import React, { createContext, useContext, useState, useMemo, useCallback } from "react";

const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [state, setState] = useState({});

  // Memoize setDashboardData to prevent recreating on every render
  const setDashboardData = useCallback((key, value) => {
    setState((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // Memoize getDashboardData to prevent recreating on every render
  const getDashboardData = useCallback((key) => {
    return state[key];
  }, [state]);

  // Memoize the context value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({ state, setDashboardData, getDashboardData }),
    [state, setDashboardData, getDashboardData]
  );

  return (
    <DashboardContext.Provider value={value}>
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
