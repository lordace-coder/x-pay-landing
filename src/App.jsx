import React from "react";
import AppRouter from "./AppRouter";
import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

function App() {
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-bs-theme", storedTheme);
  }, []);
  return (
    <div>
      <AppRouter />
      <ToastContainer />
    </div>
  );
}

export default App;
