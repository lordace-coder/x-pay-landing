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
  Wallet,
  CreditCard,
  ArrowRight,
  Info,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useDashboardContext } from "../context/DashboardContext";
import { BASEURL } from "../utils/utils";
import ReferralModal from "../components/RefModal";
import { useNavigate } from "react-router-dom";
import db from "../services/cocobase";

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
  const [referrals, setReferrals] = useState({});
  const { user, logout } = useAuth();
  const { getDashboardData, setDashboardData } = useDashboardContext();
  const [userInfo, setUserInfo] = useState({
    email: user?.email || "",
    phone: user?.phone || "",
    balance: 0,
    referralCount: 0,
  });
  const [copySuccess, setCopySuccess] = useState(false);
  const [showRef, setShowRef] = useState(false);
  const navigate = useNavigate();
  const refUrl =
    typeof window !== "undefined" && user
      ? window.location.origin + "/register?ref=" + user.id
      : "";

  const getReferralData = async () => {
    try {
      // const response = await authFetch(`${BASEURL}/auth/my-referrals`);
      const refs = await db.functions.execute("get_referrals")
      const result = refs.result.data;
      console.log(result, "referrals");
      setReferrals(result);
      setDashboardData("referralData",result);
    } catch (error) {
      console.error("Error fetching referral data:", error);
    }
  };

  // Enhanced copy functionality with share API
  const copyReferralLink = async () => {
    try {
      if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
        await navigator.share({
          title: "Join me on X-Pay",
          text: `Increase your capital with 50% interest in 30 days and 20% in 15 days.
 Introducing X-PAY: A Secure Investment Platform Championed by Professional Traders.

Join the X-PAY Community Today.
Be part of a secure and transparent investment ecosystem that prioritizes your financial well-being. Sign up for X-PAY today and experience the future of investing.`,
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
    console.log(user, "--user");
    // Try to get balance from dashboard context
    const batchData = getDashboardData ? getDashboardData("batchData") : null;

    let balance = 0;
    if (batchData && batchData.batches) {
      balance = batchData.batches.reduce(
        (sum, b) => sum + (b.total_value || 0),
        0
      );
    }

    let referralCount = 0;
    referralCount = referrals.length || 0;

    setUserInfo((prev) => ({
      ...prev,
      email: user?.email || prev.email,
      phone: user?.phone || prev.phone,
      balance,
      referralCount,
    }));
  }, [user]);

  useEffect(() => {
    const referralData = getDashboardData
      ? getDashboardData("referralData")
      : null;
    if (referralData == null) {
      getReferralData();
    } else {
      if (referralData.length >= 1) setReferrals(referralData);
    }

    return () => {};
  }, []);

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
      const data = {
        old_password: formData.old_password,
        new_password: formData.new_password,
      };
      const res = await db.functions.execute("update_password", {
        method: "POST",
        payload: data,
      });
      if (res.success) {
        setMessage({ type: "success", text: "Password changed successfully!" });
        setFormData({ old_password: "", new_password: "" });
        setPasswordStrength(0);
      } else {
        setMessage({
          type: "error",
          text: res.error || "Failed to change password",
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

  const handleWithdrawNavigation = () => {
    // Navigate to withdrawal page - replace with your actual navigation logic

    navigate("/ref-withdrawal");
  };

  const showReferalModal = () => {
    setShowRef(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      <div className="p-4 sm:p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header Section */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-600 shadow-xl">
              <Settings className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                Account Settings
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Manage your profile, security, and referral earnings
              </p>
            </div>
          </div>

          {/* Alert Messages */}
          {message.text && (
            <div
              className={`flex items-start gap-3 p-4 rounded-xl border ${
                message.type === "success"
                  ? "bg-green-50 border-green-200 text-green-800"
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              )}
              <span className="font-medium text-sm">{message.text}</span>
            </div>
          )}

          {/* User Profile Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-r from-blue-600 to-emerald-600 p-0.5 shadow-lg">
                    <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center">
                      <User className="w-8 h-8 sm:w-10 sm:h-10 text-gray-600" />
                    </div>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-white shadow-sm" />
                </div>

                {/* User Info */}
                <div className="flex-1 w-full text-center sm:text-left">
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                        <Mail className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          Email Address
                        </span>
                      </div>
                      <p className="text-sm sm:text-base font-semibold text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border break-all">
                        {userInfo.email}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                          <Phone className="w-4 h-4 text-emerald-600" />
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Phone
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-gray-900 bg-gray-50 px-3 py-2 rounded-lg border">
                          {user?.data.phone_number || (
                            <span className="italic text-gray-400">
                              Not set
                            </span>
                          )}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                            Total Capital
                          </span>
                        </div>
                        <p className="text-lg font-bold text-green-600 bg-green-50 px-3 py-2 rounded-lg border">
                          $
                          {user?.total_capital?.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          }) || "0.00"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Referral Section */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-600 to-blue-600 px-4 py-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Referral Program
                </h3>
              </div>

              <div className="p-4 space-y-4">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                    <div className="text-xl font-bold text-emerald-600">
                      ${user?.referral_balance?.toFixed(2) || "0.00"}
                    </div>
                    <div className="text-xs text-emerald-700 font-medium">
                      Available Balance
                    </div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="text-xl font-bold text-blue-600">
                      {referrals.length || 0}
                    </div>
                    <div className="text-xs text-blue-700 font-medium">
                      Total Referrals
                    </div>
                  </div>
                </div>

                {/* Withdrawal Info */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-xs text-amber-800">
                      <p className="font-medium mb-1">
                        Withdrawal Requirements:
                      </p>
                      <p>
                        Minimum withdrawal amount is{" "}
                        <span className="font-bold">$50.00</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Withdrawal Button */}
                <button
                  onClick={handleWithdrawNavigation}
                  disabled={
                    !user?.referral_balance || user.referral_balance < 50
                  }
                  className={`w-full px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                    user?.referral_balance >= 50
                      ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <Wallet className="w-5 h-5" />
                  {user?.referral_balance >= 50
                    ? "Withdraw Earnings"
                    : "Insufficient Balance"}
                  {user?.referral_balance >= 50 && (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </button>

                {/* Referral Link */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Your Referral Link
                  </label>
                  <div className="bg-gray-50 rounded-lg px-3 py-2 border">
                    <p className="text-xs text-gray-600 font-mono break-all">
                      {refUrl}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={copyReferralLink}
                    disabled={copySuccess}
                    className="px-3 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm disabled:opacity-60"
                  >
                    {copySuccess ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    <span className="hidden sm:inline">
                      {copySuccess ? "Copied!" : "Copy"}
                    </span>
                  </button>

                  <button
                    onClick={showReferalModal}
                    className="px-3 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm"
                  >
                    <Users className="w-4 h-4" />
                    <span className="hidden sm:inline">View All</span>
                  </button>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed">
                  Earn 5% commission on every friend's investment. Share your
                  link and start earning passive income today.
                </p>
              </div>
            </div>

            {/* Password Change Section */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Change Password
                </h3>
              </div>

              <div className="p-4 space-y-4">
                <div className="space-y-4">
                  {/* Current Password */}
                  <div className="space-y-2">
                    <label
                      htmlFor="old_password"
                      className="block text-xs font-medium text-gray-500 uppercase tracking-wide"
                    >
                      Current Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="w-4 h-4 text-gray-400" />
                      </div>
                      <input
                        type={showOldPassword ? "text" : "password"}
                        id="old_password"
                        name="old_password"
                        value={formData.old_password}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                        placeholder="Enter current password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowOldPassword(!showOldPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showOldPassword ? (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <label
                      htmlFor="new_password"
                      className="block text-xs font-medium text-gray-500 uppercase tracking-wide"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="w-4 h-4 text-gray-400" />
                      </div>
                      <input
                        type={showNewPassword ? "text" : "password"}
                        id="new_password"
                        name="new_password"
                        value={formData.new_password}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
                        placeholder="Enter new password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showNewPassword ? (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {formData.new_password && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-medium text-gray-600">
                            Strength: {getStrengthText(passwordStrength)}
                          </span>
                          <span className="text-xs text-gray-500">
                            {passwordStrength}/5
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
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
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:cursor-not-allowed shadow-lg text-sm"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4" />
                        Update Password
                      </>
                    )}
                  </button>
                </div>

                {/* Security Tips */}
                <div className="bg-blue-50 rounded-xl p-3 border border-blue-200 mt-4">
                  <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-600" />
                    Security Tips
                  </h4>
                  <ul className="space-y-1 text-xs text-gray-700">
                    <li className="flex items-start gap-2">
                      <div className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                      Use 8+ characters with mixed case
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                      Include numbers and symbols
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                      Avoid personal information
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="bg-gradient-to-r from-red-600 to-pink-600 px-4 py-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                Account Management
              </h3>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <Star className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-blue-600">Premium</div>
                  <div className="text-xs text-blue-700">Account Status</div>
                </div>

                <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <Award className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-lg font-bold text-purple-600">
                    {referrals.length || 0}
                  </div>
                  <div className="text-xs text-purple-700">
                    Active Referrals
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <LogOut className="w-5 h-5" />
                Logout Account
              </button>
            </div>
          </div>
        </div>

        {/* Referral Modal */}
        <ReferralModal
          isOpen={showRef}
          onClose={() => setShowRef(false)}
          data={referrals}
        />
      </div>
    </div>
  );
};

export default ChangePassword;
