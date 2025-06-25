import React from "react";
import logo from "../assets/img/xpay-logo.png";

const LoadingComponent = () => {
  return (
    <div className="fixed inset-0 bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center">
        {/* App Logo with Bouncy Animation */}
        <div className="animate-bounce">
          <img src={logo} alt="" className="w-32" />
        </div>

        {/* Optional Loading Text */}
        <div className="mt-6">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-teal-600 rounded-full animate-pulse"></div>
            <div
              className="w-2 h-2 bg-teal-600 rounded-full animate-pulse"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-teal-600 rounded-full animate-pulse"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingComponent;
