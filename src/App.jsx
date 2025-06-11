import React from "react";
import AppRouter from "./AppRouter";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    document.documentElement.setAttribute("data-bs-theme", storedTheme);
  }, []);
  return (
    <div>
      <AppRouter />
    </div>
  );
}

export default App;
