import { useState, useEffect } from "react";
import {
  Mail,
  ArrowLeft,
  Clock,
  CheckCircle,
  Send,
  Edit3,
  Shield,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { BASEURL } from "../utils/utils";
import { useNavigate, useLocation } from "react-router-dom";

const EmailVerification = () => {
  const { user, verifyEmail, fetchVerificationStatus, verificationStatus } =
    useAuth();

  const [otp, setOtp] = useState(new Array(4).fill(""));
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [isVerified, setIsVerified] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || user.email || "Error in geting email ";

  // Restore OTP resend timer
  useEffect(() => {
    const lastSent = localStorage.getItem("emailOtpSentTime");
    if (lastSent) {
      const timeDiff = Date.now() - Number.parseInt(lastSent);
      const remainingTime = 60000 - timeDiff;
      if (remainingTime > 0) {
        setCanResend(false);
        setCountdown(Math.ceil(remainingTime / 1000));
      }
    }
  }, []);

  // Auto-send OTP only if no valid count down
  useEffect(() => {
    const lastSent = localStorage.getItem("emailOtpSentTime");
    const hasActiveCooldown =
      lastSent && Date.now() - Number.parseInt(lastSent) < 60000;

    if (email && !hasActiveCooldown) {
      handleSendOtp();
    }
  }, [email]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown <= 0 && !canResend) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < otp.length - 1) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Send OTP
  const handleSendOtp = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASEURL}/auth/send-email-otp/${email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      // console.log(data);
      

      if (res.ok) {
        localStorage.setItem("emailOtpSentTime", Date.now().toString());
        setCanResend(false);
        setCountdown(60);
        toast.success(data.message);
      } else {
        toast.error(data.detail || "Failed to send verification code");
      }
    } catch (error) {
      console.error("Send OTP error:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Verify Email
  const handleVerifyEmail = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 4) {
      toast.error("Please enter complete 4-digit code");
      return;
    }
    try {
      setIsLoading(true);
      const { success, message } = await verifyEmail(email, otpCode);

      // console.log(message);

      if (success) {
        setIsVerified(true);
        toast.success("Email verified successfully!");
        await fetchVerificationStatus();
        setTimeout(() => {
          navigate("/verify-phone");
        }, 2000);
      } else {
        toast.error(message);
      }
    } catch (err) {
      console.error("Verify email error:", err);
      toast.error("Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Change Email & resend OTP
  const handleChangeEmail = async () => {
    if (!newEmail || !/\S+@\S+\.\S+/.test(newEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      setIsLoading(true);
      const res = await fetch(`${BASEURL}/auth/change-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ old_email: email, new_email: newEmail }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || data.detail);
        setOtp(["", "", "", ""]);
        setNewEmail("");
        setIsChangingEmail(false);
        localStorage.setItem("emailOtpSentTime", Date.now().toString());
        setCanResend(false);
        setCountdown(60);
      } else {
        toast.error(data.detail || "Failed to send verification code");
      }
    } catch (error) {
      console.error("Change email error:", error);
      toast.error("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Success state
  if (isVerified) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100"></div>
        <div className="relative w-full max-w-md">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100/50 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Email Verified!
            </h1>
            <p className="text-gray-600 mb-4">
              Your email has been successfully verified.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Redirecting to dashboard...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen customebg flex items-center justify-center p-4">
      <div className="absolute inset-0 "></div>

      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl p-8  shadow-2xl border border-gray-100/50">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Mail className="w-8 h-8 text-gray-700" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
              Verify Your Email
            </h1>
            <p className="text-gray-600 text-base">
              We've sent a 4-digit code to
            </p>
            <div className=" bg-gray-50 rounded-lg border">
              <p className="text-gray-900 font-semibold">{email}</p>
            </div>
          </div>

          {!isChangingEmail ? (
            <>
              {/* Action buttons */}
              <div className="flex justify-between items-center mb-6">
                <button
                  onClick={() => setIsChangingEmail(true)}
                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-1 group"
                >
                  <Edit3 className="w-3 h-3 group-hover:scale-110 transition-transform" />
                  Change Email
                </button>
                {canResend ? (
                  <button
                    onClick={handleSendOtp}
                    disabled={isLoading}
                    className="text-sm text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-1 group disabled:opacity-50"
                  >
                    <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-300" />
                    Resend Code
                  </button>
                ) : (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>Resend in {countdown}s</span>
                  </div>
                )}
              </div>

              {/* OTP Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Enter verification code
                </label>
                <div className="flex gap-4 justify-center">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-15 h-15 text-center text-lg font-semibold bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                      maxLength={1}
                    />
                  ))}
                </div>
              </div>

              {/* Verify Button */}
              <button
                onClick={handleVerifyEmail}
                disabled={isLoading || otp.join("").length !== 4}
                className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform focus:outline-none focus:ring-4 focus:ring-gray-900/20 flex items-center justify-center group ${
                  otp.join("").length === 4 && !isLoading
                    ? "bg-gray-900 hover:bg-gray-800 text-white shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.98]"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Verifying...</span>
                  </div>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                    Verify Email
                  </>
                )}
              </button>

              {/* Help text */}
              <div className="text-center mt-4">
                <p className="text-xs text-gray-500">
                  Didn't receive the code? Check your spam folder or try
                  resending.
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Change Email Form */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  New Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="Enter new email address"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                  />
                  {newEmail && /\S+@\S+\.\S+/.test(newEmail) && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  )}
                </div>
                {newEmail && !/\S+@\S+\.\S+/.test(newEmail) && (
                  <p className="mt-1 text-xs text-red-600">
                    Please enter a valid email address
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsChangingEmail(false);
                    setNewEmail("");
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={handleChangeEmail}
                  disabled={
                    isLoading || !newEmail || !/\S+@\S+\.\S+/.test(newEmail)
                  }
                  className={`flex-1 font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                    newEmail && /\S+@\S+\.\S+/.test(newEmail) && !isLoading
                      ? "bg-gray-900 hover:bg-gray-800 text-white shadow-lg hover:shadow-xl"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {isLoading ? "Updating..." : "Update Email"}
                </button>
              </div>
            </>
          )}

          {/* Back to Dashboard */}
          <div className="text-center mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-gray-600 hover:text-gray-800 transition-colors text-sm flex items-center justify-center gap-1 mx-auto group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-6 -left-6 w-12 h-12 bg-gray-100 rounded-full blur-lg opacity-60"></div>
        <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-gray-200 rounded-full blur-lg opacity-50"></div>
      </div>
    </div>
  );
};

export default EmailVerification;
