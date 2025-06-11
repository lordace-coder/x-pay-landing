import React, { useState, useEffect } from "react";
import { Wifi, WifiOff } from "lucide-react";

import logo from "../assets/img/xpay-logo.png";
import { Link } from "react-router-dom";

export default function NotFound() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [animateNumbers, setAnimateNumbers] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Trigger number animation
    setTimeout(() => setAnimateNumbers(true), 500);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden"
      style={{ fontFamily: "Inter, system-ui, -apple-system, sans-serif" }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Floating Decorative Elements */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-slate-400 rounded-full animate-ping opacity-60"></div>
      <div className="absolute bottom-32 right-32 w-1 h-1 bg-slate-500 rounded-full animate-pulse"></div>
      <div className="absolute top-1/3 right-20 w-3 h-3 bg-slate-300 rounded-full animate-bounce opacity-40"></div>

      {/* Main Content */}
      <div className="relative text-center max-w-2xl mx-auto">
        {/* Logo */}
        <div className=" transform transition-transform duration-300 hover:scale-105">
          <img
            src={logo}
            alt="X-Pay Logo"
            className="w-28  mx-auto drop-shadow-lg"
          />
        </div>

        {/* 404 Numbers with Animation */}
        <div className="mb-8 relative">
          <div className="flex justify-center items-center space-x-4 sm:space-x-6">
            {["4", "0", "4"].map((digit, index) => (
              <div
                key={index}
                className={`text-8xl sm:text-9xl lg:text-[12rem] font-bold bg-gradient-to-b from-slate-800 via-slate-600 to-slate-800 bg-clip-text text-transparent transform transition-all duration-1000 ${
                  animateNumbers
                    ? "translate-y-0 opacity-100"
                    : "translate-y-10 opacity-0"
                }`}
                style={{
                  transitionDelay: `${index * 200}ms`,
                  textShadow: "0 0 30px rgba(0,0,0,0.1)",
                }}
              >
                {digit}
              </div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8 space-y-4">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-lg mx-auto">
            The page you're looking for seems to have taken an unexpected
            detour. Don't worry, we'll help you get back on track.
          </p>

          {/* Connection Status */}
          <div className="flex items-center justify-center space-x-2 mt-6 mb-6">
            {isOnline ? (
              <>
                <Wifi className="h-5 w-5 text-green-500" />
                <span className="text-sm text-green-600 font-medium">
                  Connected
                </span>
              </>
            ) : (
              <>
                <WifiOff className="h-5 w-5 text-red-500" />
                <span className="text-sm text-red-600 font-medium">
                  No Internet Connection
                </span>
              </>
            )}
          </div>
          <Link
            to={"/"}
            className="bg-gray-800 px-5 py-3  text-white "
            style={{ textDecoration: "none" }}
          >
            Go Back Home
          </Link>
        </div>
      </div>

      {/* Additional Floating Elements */}
      <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-br from-red-200 to-orange-200 rounded-full blur-lg opacity-60 animate-pulse"></div>
      <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-gradient-to-br from-yellow-200 to-red-200 rounded-full blur-lg opacity-50 animate-pulse animation-delay-2000"></div>
      <div className="absolute top-1/4 -left-8 w-1 h-24 bg-gradient-to-b from-transparent via-slate-300 to-transparent opacity-40 rotate-12 animate-pulse animation-delay-4000"></div>
      <div className="absolute bottom-1/4 -right-8 w-1 h-32 bg-gradient-to-b from-transparent via-slate-300 to-transparent opacity-30 -rotate-12 animate-pulse animation-delay-6000"></div>
    </div>
  );
}
