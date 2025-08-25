import { useState, useEffect } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Shield,
  CheckCircle,
  AlertCircle,
  Copy,
  Check,
  Users,
  LogOut,
  User,
  Mail,
  Phone,
  DollarSign,
  Settings,
  Star,
  TrendingUp,
  Award,
  UsersIcon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useDashboardContext } from "../context/DashboardContext";
import { BASEURL } from "../utils/utils";
import ReferralModal from "../components/RefModal";

// Password strength checker function
const checkPasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.match(/[a-z]/)) strength++;
  if (password.match(/[A-Z]/)) strength++;
  if (password.match(/[0-9]/)) strength++;
  if (password.match(/[^a-zA-Z0-9]/)) strength++;
  return strength;
};

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { authFetch, user, logout } = useAuth();
  const { getDashboardData } = useDashboardContext();
  const [userInfo, setUserInfo] = useState({
    email: user?.email || "",
    phone: user?.phone || "",
    balance: 0,
    referralCount: 0,
    totalEarnings: 0,
  });
  const [copySuccess, setCopySuccess] = useState(false);
  const [showRef, setShowRef] = useState(false);

  const refUrl =
    typeof window !== "undefined" && user
      ? window.location.origin + "/register?ref=" + user.id
      : "";

  // Enhanced copy functionality with share API
  const copyReferralLink = async () => {
    try {
      if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
        await navigator.share({
          title: "Join me on X-Pay",
          text: "Start investing with me and earn great returns!",
          url: refUrl,
        });
      } else {
        await navigator.clipboard.writeText(refUrl);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 3000);
      }
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = refUrl;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 3000);
      } catch (fallbackErr) {}
      document.body.removeChild(textArea);
    }
  };

  useEffect(() => {
    // Try to get balance from dashboard context
    const batchData = getDashboardData ? getDashboardData("batchData") : null;
    const referralData = getDashboardData
      ? getDashboardData("referralData")
      : null;

    let balance = 0;
    if (batchData && batchData.batches) {
      balance = batchData.batches.reduce(
        (sum, b) => sum + (b.total_value || 0),
        0
      );
    }

    let referralCount = 0;
    let totalEarnings = 0;
    if (referralData) {
      referralCount = referralData.referrals?.length || 0;
      totalEarnings = referralData.totalEarnings || 0;
    }

    setUserInfo((prev) => ({
      ...prev,
      email: user?.email || prev.email,
      phone: user?.phone || prev.phone,
      balance,
      referralCount,
      totalEarnings,
    }));
  }, [user, getDashboardData]);

  console.log(user);
  

  const getStrengthColor = (strength) => {
    if (strength <= 2) return "from-red-400 to-red-600";
    if (strength <= 3) return "from-yellow-400 to-yellow-600";
    if (strength <= 4) return "from-blue-400 to-blue-600";
    return "from-green-400 to-green-600";
  };

  const getStrengthText = (strength) => {
    if (strength <= 2) return "Weak";
    if (strength <= 3) return "Fair";
    if (strength <= 4) return "Good";
    return "Strong";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "new_password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.old_password || !formData.new_password) {
      setMessage({ type: "error", text: "Please fill in all fields" });
      return;
    }

    if (formData.new_password.length < 8) {
      setMessage({
        type: "error",
        text: "New password must be at least 8 characters long",
      });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await authFetch(BASEURL + "/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "Password changed successfully!" });
        setFormData({ old_password: "", new_password: "" });
        setPasswordStrength(0);
      } else {
        const errorData = await response.json();
        setMessage({
          type: "error",
          text: errorData.message || "Failed to change password",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    if (logout && typeof logout === "function") {
      logout();
    } else if (user && typeof user.logout === "function") {
      user.logout();
    } else {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/login";
    }
  };

  const showReferalModal = () => {
    setShowRef(true);
  };
  return (
    <div className="min-h-screen ">
      <div className="py-4 sm:py-8 px-3 sm:px-4 lg:px-6">
        <div className="w-full max-w-5xl mx-auto space-y-6 lg:space-y-8">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-emerald-600 shadow-lg">
              <Settings className="w-8 h-8 sm:w-9 sm:h-9 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Account Settings
              </h1>
              <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
                Manage your profile, security settings, and referral program
              </p>
            </div>
          </div>

          {/* Main Content - Centered Layout */}
          <div className="max-w-4xl mx-auto space-y-6 lg:space-y-8">
            {/* User Profile Card */}
            <div className="trans_5  rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-6 sm:p-8">
                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-600 p-1 shadow-lg">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                        <User className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600" />
                      </div>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white">
                      <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1" />
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="flex-1 text-center lg:text-left space-y-4">
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                          <Mail className="w-4 h-4 text-emerald-600" />
                          <span className="text-sm font-medium text-gray-600">
                            Email Address
                          </span>
                        </div>
                        <p className="text-base sm:text-lg font-semibold text-gray-900 break-all bg-gray-50 px-4 py-3 rounded-lg border">
                          {userInfo.email}
                        </p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                            <Phone className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-600">
                              Phone
                            </span>
                          </div>
                          <p className="text-base font-semibold text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border text-center lg:text-left">
                            {userInfo.phone || (
                              <span className="italic text-gray-400">
                                Not set
                              </span>
                            )}
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-gray-600">
                              Balance
                            </span>
                          </div>
                          <p className="text-xl font-bold text-green-600 bg-green-50 px-3 py-2 rounded-lg border text-center lg:text-left">
                            $
                            {userInfo.balance.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                            })}
                          </p>
                        </div>

                        {/* <div>
                          <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                            <Users className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-600">
                              Referrals
                            </span>
                          </div>
                          <p className="text-xl font-bold text-blue-600 bg-blue-50 px-3 py-2 rounded-lg border text-center lg:text-left">
                            {userInfo.referralCount}
                          </p>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats & Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Referral Section */}
              <div className="bg-white w-full shadow-lg border hover:shadow-xl transition-all duration-300 hover:border-teal-200 rounded-2xl px-3 py-3 sm:px-4 sm:py-4">
                <h5 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
                  Your Referral Link
                </h5>
                <div className="bg-gray-50 rounded-lg px-2 sm:px-3 py-2 border border-teal-300">
                  <p className="text-xs sm:text-sm text-gray-600 font-mono break-all">
                    {refUrl}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-between mt-3 sm:mt-4 gap-2 sm:gap-0">
                  <button
                    onClick={copyReferralLink}
                    disabled={copySuccess}
                    className="flex-1 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {copySuccess ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                    <span>{copySuccess ? "Copied!" : "Copy Link"}</span>
                  </button>

                  <button
                    onClick={showReferalModal}
                    className="flex-1 px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                  >
                    <UsersIcon className="" /> View Referrals
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="text-center p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="text-base font-bold text-emerald-600">
                      ${userInfo.totalEarnings.toFixed(2)}
                    </div>
                    <div className="text-xs text-emerald-700">
                      Total Earnings
                    </div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="text-base font-bold text-blue-600">
                      {userInfo.referralCount}
                    </div>
                    <div className="text-xs text-blue-700">Referrals</div>
                  </div>
                </div>
                <p className="text-[11px] sm:text-xs text-gray-500 mt-2 sm:mt-3">
                  Share this link with friends and earn 5% commission on their
                  investments.
                  {navigator.share
                    ? " Use the share button to send via your preferred app."
                    : " Copy the link to share it manually."}
                </p>
              </div>

              {/* Account Actions */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Account Actions
                  </h3>

                  <div className="space-y-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-2xl font-bold text-blue-600">
                        {userInfo.referralCount}
                      </div>
                      <div className="text-sm text-blue-700">
                        Active Referrals
                      </div>
                    </div>

                    {/* <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="text-lg font-bold text-purple-600">
                        Premium
                      </div>
                      <div className="text-sm text-purple-700">Account Status</div>
                    </div> */}

                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-5 h-5" />
                      Logout Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Password Change Section */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Change Password
                    </h2>
                    <p className="text-gray-600">
                      Keep your account secure with a strong password
                    </p>
                  </div>
                </div>

                {/* Alert Messages */}
                {message.text && (
                  <div
                    className={`flex items-start gap-4 p-6 rounded-2xl mb-8 border-2 ${
                      message.type === "success"
                        ? "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                        : "bg-gradient-to-r from-red-50 to-rose-50 border-red-200"
                    }`}
                  >
                    {message.type === "success" ? (
                      <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                    )}
                    <span
                      className={`font-medium ${
                        message.type === "success"
                          ? "text-green-800"
                          : "text-red-800"
                      }`}
                    >
                      {message.text}
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    {/* Current Password */}
                    <div className="space-y-3">
                      <label
                        htmlFor="old_password"
                        className="block text-sm font-semibold text-gray-700"
                      >
                        Current Password
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                          type={showOldPassword ? "text" : "password"}
                          id="old_password"
                          name="old_password"
                          value={formData.old_password}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                          placeholder="Enter your current password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowOldPassword(!showOldPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center hover:opacity-70 transition-opacity"
                        >
                          {showOldPassword ? (
                            <EyeOff className="w-5 h-5 text-gray-400" />
                          ) : (
                            <Eye className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div className="space-y-3">
                      <label
                        htmlFor="new_password"
                        className="block text-sm font-semibold text-gray-700"
                      >
                        New Password
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                          type={showNewPassword ? "text" : "password"}
                          id="new_password"
                          name="new_password"
                          value={formData.new_password}
                          onChange={handleInputChange}
                          className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                          placeholder="Enter your new password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center hover:opacity-70 transition-opacity"
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-5 h-5 text-gray-400" />
                          ) : (
                            <Eye className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                      </div>

                      {/* Password Strength Indicator */}
                      {formData.new_password && (
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-600">
                              Password Strength
                            </span>
                            <span className="text-sm font-bold text-gray-800">
                              {getStrengthText(passwordStrength)}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${getStrengthColor(
                                passwordStrength
                              )} transition-all duration-500 rounded-full`}
                              style={{
                                width: `${(passwordStrength / 5) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-3 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-lg"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                          Updating Password...
                        </>
                      ) : (
                        <>
                          <Shield className="w-5 h-5" />
                          Change Password
                        </>
                      )}
                    </button>
                  </div>

                  {/* Security Tips */}
                  <div className="bg-gradient-to-br from-blue-50 to-emerald-50 rounded-2xl p-6 border border-blue-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      Security Guidelines
                    </h3>
                    <ul className="space-y-3 text-sm text-gray-700">
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        Use at least 8 characters for better security
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        Mix uppercase and lowercase letters
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        Include numbers and special characters (!@#$%^&*)
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        Avoid using personal information or common words
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        Consider using a password manager for maximum security
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReferralModal isOpen={showRef} onClose={() => setShowRef(false)} />
    </div>
  );
};

export default ChangePassword;
