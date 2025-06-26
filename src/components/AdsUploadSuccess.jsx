import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  MessageSquare,
  Shield,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function AdUploadSuccess() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 3);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const steps = [
    {
      icon: Shield,
      title: "Ad Validation",
      description: "Your ad will be reviewed for quality and compliance",
    },
    {
      icon: MessageSquare,
      title: "Pricing Discussion",
      description: "We'll discuss the best pricing package for your goals",
    },
    {
      icon: CheckCircle,
      title: "Go Live",
      description: "Your ad goes live once everything is finalized",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div
        className={`max-w-2xl w-full transition-all duration-1000 transform ${
          isVisible
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-8 opacity-0 scale-95"
        }`}
      >
        {/* Main Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-teal-500/10 border border-emerald-100/50 p-8 mb-6 relative overflow-hidden">
          {/* Animated background gradient */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 animate-pulse"></div>

          {/* Success Icon with Animation */}
          <div className="text-center mb-8">
            <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full animate-ping opacity-20"></div>
              <div className="relative bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full p-6 shadow-lg">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 animate-bounce" />
            </div>

            <h1 className="text-4xl font-bold text-gray-800 mb-3">
              Upload Complete! 🎉
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              Your ad has been successfully submitted and is now in our review
              queue.
            </p>
          </div>

          {/* What's Next Section */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-emerald-600" />
              What Happens Next?
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our team will now review your ad submission. You'll receive a call
              from our admin team within
              <span className="font-semibold text-emerald-700">
                {" "}
                24-48 hours
              </span>{" "}
              to discuss:
            </p>

            <div className="grid gap-3">
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                <span>Pricing packages tailored to your advertising goals</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                <span>Payment options and billing preferences</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                <span>Campaign optimization strategies</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                <span>Final ad validation and approval</span>
              </div>
            </div>
          </div>

          {/* Process Steps */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Your Ad Journey
            </h3>
            <div className="grid gap-4">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = currentStep === index;
                const isCompleted = index === 0;

                return (
                  <div
                    key={index}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${
                      isActive
                        ? "bg-gradient-to-r from-emerald-100 to-teal-100 shadow-md scale-105"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCompleted
                          ? "bg-emerald-600 text-white"
                          : isActive
                          ? "bg-teal-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">
                        {step.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {step.description}
                      </p>
                    </div>
                    {isActive && (
                      <ArrowRight className="w-5 h-5 text-emerald-600 animate-pulse" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-6 text-white mb-6">
            <h4 className="text-xl font-semibold mb-3 flex items-center gap-2 text-white">
              <MessageSquare className="w-6 h-6" />
              Need Immediate Assistance?
            </h4>
            <p className="text-gray-200 mb-4">
              For instant support, click the{" "}
              <span className="font-semibold text-emerald-300">chat icon</span>{" "}
              at the bottom right of your screen. Our team is ready to help with
              any questions about your ad submission.
            </p>
           
          </div>

          {/* Chat Icon Pointer */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">
                  💬 Look for the floating chat icon in the bottom-right corner
                </p>
                <p className="text-xs text-gray-600">
                  Click it anytime for instant support from our team
                </p>
              </div>
              <div className="text-2xl animate-bounce">👉</div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-gray-600">
          <p className="text-sm">
            Ad ID:{" "}
            <span className="font-mono font-semibold">
              #AD{Math.random().toString(36).substr(2, 9).toUpperCase()}
            </span>
          </p>
          <p className="text-xs mt-1 opacity-75">
            Keep this ID for future reference
          </p>
        </div>
      </div>
    </div>
  );
}
