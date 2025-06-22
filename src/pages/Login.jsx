import React, { useEffect, useState } from "react";
import { Eye, EyeOff, ArrowRight, Mail, Lock } from "lucide-react";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import logo from "../assets/img/xpay-logo.png";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [params, setParams] = useSearchParams();

  const navigate = useNavigate();

  const handleSubmit = async () => {
    setIsLoading(true);
    // Simulate login process
    try {
      const res = await login(email, password);
      if (!res) {
        toast("Invalid email or password", { type: "error" });
      }
      navigate("/dashboard");
    } catch (error) {
      toast("An Error occured " + error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleRef();
  }, []);

  const handleRef = () => {
    const ref = params.get("ref");
    if (ref) {
      // Handle referral logic here, e.g., save to local storage or state
      localStorage.setItem("referralCode", ref);
      toast(`Referral code ${ref} applied!`, { type: "success" });
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-1 py-2 md:px-4">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,0,0,0.02),transparent)]"></div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-3xl p-3 shadow-xl border border-gray-100/50 backdrop-blur-sm">
          {/* Logo & Header */}
          <div className="text-center mb-12">
            <img src={logo} className="w-28 mx-auto" />
            <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">
              Welcome back
            </h1>
            <p className="text-gray-500 text-lg">Sign in to X-Pay</p>
          </div>

          {/* Form */}
          <div className="space-y-8">
            {/* Email Field */}
            <div className="relative group">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-gray-600 transition-colors duration-200" />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 text-lg"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="relative group">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-gray-600 transition-colors duration-200" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-14 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 text-lg"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-200 transform hover:scale-[1.01] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center group text-lg"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-gray-500 mt-10 text-base">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-gray-900 hover:text-gray-700 transition-colors font-medium underline underline-offset-4"
            >
              Create one
            </Link>
          </p>
        </div>

        {/* Subtle Decorative Elements */}
        <div className="absolute -top-8 -left-8 w-16 h-16 bg-gray-100 rounded-full blur-2xl opacity-60"></div>
        <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-gray-200 rounded-full blur-2xl opacity-40"></div>
        <div className="absolute top-1/2 -right-12 w-2 h-24 bg-gradient-to-b from-transparent via-gray-200 to-transparent opacity-30 rotate-12"></div>
      </div>
    </div>
  );
}
