import React from "react";
import { useState } from "react";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Mail,
  Lock,
  User,
  CheckCircle,
  Phone,
} from "lucide-react";
import logo from "../assets/img/xpay-logo.png";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
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
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const [searchParams] = useSearchParams();
  const ref = searchParams.get("ref");

  const handleSubmit = async () => {
    setIsLoading(true);

    const data = {
      email,
      full_name: fullName,
      password,
      phone_number: phoneNumber,
    };
    try {
      if (ref) {
        data.ref = ref;
      }
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
    phoneNumber &&
    agreeToTerms &&
    password === confirmPassword;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8 px-4">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100"></div>

      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100/50">
          <div className="text-center mb-8">
            <div className="mb-4">
              <img
                src={logo || "/placeholder.svg"}
                alt="X-Pay Logo"
                className="w-24 h-24 mx-auto"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
              Create Account
            </h1>
            <p className="text-gray-600 text-base">
              Join X-Pay and start your journey
            </p>
          </div>

          <div className="space-y-4">
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-gray-400 group-focus-within:text-gray-600" />
                </div>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                  required
                />
                {fullName && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                )}
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400 group-focus-within:text-gray-600" />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                  required
                />
                {email && email.includes("@") && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                )}
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-gray-400 group-focus-within:text-gray-600" />
                </div>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                  required
                />
                {phoneNumber && phoneNumber.length >= 10 && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                )}
              </div>
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400 group-focus-within:text-gray-600" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {password && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2 text-xs">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        password.length >= 8 ? "bg-green-500" : "bg-gray-300"
                      }`}
                    ></div>
                    <span
                      className={
                        password.length >= 8
                          ? "text-green-600"
                          : "text-gray-500"
                      }
                    >
                      At least 8 characters
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400 group-focus-within:text-gray-600" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-16 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-8 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
                {confirmPassword && password && (
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    {password === confirmPassword ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-red-300"></div>
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

            <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
              <label className="flex items-start cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-2 border-gray-300 text-gray-900 focus:ring-gray-900 focus:ring-2 transition-colors"
                  required
                />
                <span className="ml-3 text-sm leading-relaxed text-gray-600 group-hover:text-gray-900 transition-colors">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-gray-900 hover:text-gray-700 underline underline-offset-2 font-medium"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/policies"
                    className="text-gray-900 hover:text-gray-700 underline underline-offset-2 font-medium"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading || !isFormValid}
              className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform focus:outline-none focus:ring-4 focus:ring-gray-900/20 flex items-center justify-center group ${
                isFormValid && !isLoading
                  ? "bg-gray-900 hover:bg-gray-800 text-white shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.98]"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating account...</span>
                </div>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>
          </div>

          <div className="text-center mt-6 pt-4 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-gray-900 hover:text-gray-700 transition-colors font-medium underline underline-offset-4"
              >
                Sign in instead
              </Link>
            </p>
          </div>
        </div>

        <div className="absolute -top-6 -left-6 w-12 h-12 bg-gray-100 rounded-full blur-lg opacity-60"></div>
        <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-gray-200 rounded-full blur-lg opacity-50"></div>
      </div>
    </div>
  );
}
