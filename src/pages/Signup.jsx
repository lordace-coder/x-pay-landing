import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Mail,
  Lock,
  User,
  CheckCircle,
} from "lucide-react";
import logo from "../assets/img/xpay-logo.png";
import { Link, useNavigate } from "react-router-dom";
import { BASEURL } from "../utils/utils";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const handleSubmit = async () => {
    setIsLoading(true);
    const data = {
      email,
      full_name: fullName,
      password,
    };
    try {
      const res = await fetch(BASEURL + "/auth/", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        const completed = await login(email, password);
        if (completed) {
          navigate("/dashboard");
        } else {
          navigate("/login");
        }
      } else {
        const err = await res.json();
        toast("An Error occured please try again. " + err.detail, {
          type: "error",
        });
      }
    } catch (error) {
      toast("An Error occured " + error, { type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    fullName &&
    email &&
    password &&
    confirmPassword &&
    agreeToTerms &&
    password === confirmPassword;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative w-full max-w-md lg:max-w-lg">
        {/* Glassmorphism Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 sm:p-10 lg:p-12 shadow-2xl border border-white/20 transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl">
          {/* Logo & Header */}
          <div className="text-center mb-8 lg:mb-10">
            <div className="mb-6 transform transition-transform duration-300 hover:scale-105">
              <img
                src={logo}
                alt="X-Pay Logo"
                className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mx-auto drop-shadow-lg"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent mb-2 sm:mb-3 tracking-tight">
              Create Account
            </h1>
            <p className="text-slate-600 text-base sm:text-lg font-medium">
              Join X-Pay and start your journey
            </p>
          </div>

          {/* Form */}
          <div className="space-y-5 sm:space-y-6">
            {/* Full Name Field */}
            <div className="group">
              <label className="block text-sm font-semibold text-slate-700 mb-2 transition-colors group-focus-within:text-slate-900">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200">
                  <User className="h-5 w-5 text-slate-400 group-focus-within:text-slate-600" />
                </div>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 sm:py-4 bg-slate-50/50 border-2 border-slate-200/50 rounded-xl sm:rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900/30 transition-all duration-300 text-base sm:text-lg backdrop-blur-sm hover:bg-slate-50 hover:border-slate-300/50"
                  required
                />
                {fullName && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div className="group">
              <label className="block text-sm font-semibold text-slate-700 mb-2 transition-colors group-focus-within:text-slate-900">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200">
                  <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-slate-600" />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 sm:py-4 bg-slate-50/50 border-2 border-slate-200/50 rounded-xl sm:rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900/30 transition-all duration-300 text-base sm:text-lg backdrop-blur-sm hover:bg-slate-50 hover:border-slate-300/50"
                  required
                />
                {email && email.includes("@") && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div className="group">
              <label className="block text-sm font-semibold text-slate-700 mb-2 transition-colors group-focus-within:text-slate-900">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-slate-600" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-14 py-3 sm:py-4 bg-slate-50/50 border-2 border-slate-200/50 rounded-xl sm:rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900/30 transition-all duration-300 text-base sm:text-lg backdrop-blur-sm hover:bg-slate-50 hover:border-slate-300/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors duration-200 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center space-x-2 text-xs">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        password.length >= 8 ? "bg-green-500" : "bg-slate-300"
                      }`}
                    ></div>
                    <span
                      className={
                        password.length >= 8
                          ? "text-green-600"
                          : "text-slate-500"
                      }
                    >
                      At least 8 characters
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="group">
              <label className="block text-sm font-semibold text-slate-700 mb-2 transition-colors group-focus-within:text-slate-900">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-200">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-slate-600" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-14 py-3 sm:py-4 bg-slate-50/50 border-2 border-slate-200/50 rounded-xl sm:rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900/30 transition-all duration-300 text-base sm:text-lg backdrop-blur-sm hover:bg-slate-50 hover:border-slate-300/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors duration-200 focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
                {confirmPassword && password && (
                  <div className="absolute inset-y-0 right-12 flex items-center">
                    {password === confirmPassword ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-red-300"></div>
                    )}
                  </div>
                )}
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-xs text-red-600">
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Terms & Privacy */}
            <div className="flex items-start space-x-3 p-4 bg-slate-50/30 rounded-xl border border-slate-200/30">
              <label className="flex items-start cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded-md border-2 border-slate-300 text-slate-900 focus:ring-slate-900 focus:ring-2 transition-colors"
                  required
                />
                <span className="ml-3 text-sm leading-relaxed text-slate-600 group-hover:text-slate-900 transition-colors">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-slate-900 hover:text-slate-700 underline underline-offset-2 font-medium"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/policies"
                    className="text-slate-900 hover:text-slate-700 underline underline-offset-2 font-medium"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading || !isFormValid}
              className={`w-full py-4 px-6 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-slate-900/20 flex items-center justify-center group relative overflow-hidden ${
                isFormValid && !isLoading
                  ? "bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 hover:from-slate-800 hover:via-slate-700 hover:to-slate-800 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                  : "bg-slate-300 text-slate-500 cursor-not-allowed"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>
          </div>

          {/* Sign In Link */}
          <div className="text-center mt-8 pt-6 border-t border-slate-200/30">
            <p className="text-slate-600 text-base">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-slate-900 hover:text-slate-700 transition-colors font-semibold underline underline-offset-4 decoration-2 hover:decoration-slate-400"
              >
                Sign in instead
              </Link>
            </p>
          </div>
        </div>

        {/* Floating Decorative Elements */}
        <div className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-br from-violet-200 to-pink-200 rounded-full blur-lg opacity-60 animate-pulse"></div>
        <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-lg opacity-50 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/4 -left-8 w-1 h-24 bg-gradient-to-b from-transparent via-slate-300 to-transparent opacity-40 rotate-12 animate-pulse animation-delay-4000"></div>
        <div className="absolute bottom-1/4 -right-8 w-1 h-32 bg-gradient-to-b from-transparent via-slate-300 to-transparent opacity-30 -rotate-12 animate-pulse animation-delay-6000"></div>
      </div>
    </div>
  );
}
