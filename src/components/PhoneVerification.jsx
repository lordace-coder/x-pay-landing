import { useState, useEffect } from "react";
import {
  Clock,
  CheckCircle,
  Send,
  Phone,
  ArrowLeft,
  Edit3,
  Shield,
} from "lucide-react";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { BASEURL } from "../utils/utils";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PhoneVerification = () => {
  // const { user, verifyEmail, fetchVerificationStatus } = useAuth();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isChangingPhone, setIsChangingPhone] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [isVerified, setIsVerified] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const initialPhone = location.state?.phoneNumber || "";

  useEffect(() => {
    if (initialPhone) setPhoneNumber(initialPhone);
  }, [initialPhone]);

  // Countdown restore
  useEffect(() => {
    const lastSent = localStorage.getItem("phoneOtpSentTime");
    if (lastSent) {
      const timeDiff = Date.now() - Number.parseInt(lastSent);
      const remainingTime = 60000 - timeDiff;
      if (remainingTime > 0) {
        setCanResend(false);
        setCountdown(Math.ceil(remainingTime / 1000));
      }
    }
  }, []);
  // console.log(user);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        document.getElementById(`phone-otp-${index + 1}`)?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`phone-otp-${index - 1}`)?.focus();
    }
  };

  // Send OTP
  const handleSendOtp = async () => {
    if (!phoneNumber || phoneNumber.length < 7) {
      toast.error("Enter a valid phone number");
      return;
    }
    try {
      setIsLoading(true);
      const res = await fetch(`${BASEURL}/auth/send-phone-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: `+${phoneNumber}` }),
      });

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        toast.success("OTP sent to your phone!");
        localStorage.setItem("phoneOtpSentTime", Date.now().toString());
        setCanResend(false);
        setCountdown(60);
        setIsOtpSent(true);
      } else {
        const err = await res.json();
        toast.error(err.detail || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyPhone = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Enter complete 6-digit code");
      return;
    }
    try {
      setIsLoading(true);
      const res = await fetch(`${BASEURL}/auth/verify-phone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: otpCode, phone_number: `+${phoneNumber}` }),
      });
      if (res.ok) {
        setIsVerified(true);
        toast.success("Phone verified successfully!");
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        const err = await res.json();
        toast.error(err.detail || "Invalid code");
      }
    } catch (error) {
      toast.error("Error verifying: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Change phone
  const handleChangePhone = async () => {
    if (!newPhoneNumber || newPhoneNumber.length < 7) {
      toast.error("Enter a valid phone number");
      return;
    }
    try {
      setIsLoading(true);
      const res = await fetch(`${BASEURL}/auth/change-phone`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          old_phone: `+${phoneNumber}`,
          new_phone: `+${newPhoneNumber}`,
        }),
      });
      if (res.ok) {
        toast.success("Phone updated! OTP resent.");
        setPhoneNumber(newPhoneNumber);
        setNewPhoneNumber("");
        setIsChangingPhone(false);
        setOtp(["", "", "", "", "", ""]);
        await handleSendOtp();
      } else {
        const err = await res.json();
        toast.error(err.detail || "Failed to change phone");
      }
    } catch (error) {
      toast.error("Error: " + error.message);
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
              Phone Verified!
            </h1>
            <p className="text-gray-600 mb-4">
              Your phone number has been successfully verified.
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
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className="absolute inset-0 "></div>

      <div className="relative w-full max-w-md">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100/50">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Phone className="w-8 h-8 text-gray-700" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
              Verify Your Phone
            </h1>
            <p className="text-gray-600 text-base">
              {isOtpSent
                ? "We've sent a 6-digit code to"
                : "Enter your phone number to receive a verification code"}
            </p>
            {isOtpSent && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                <p className="text-gray-900 font-semibold">+{phoneNumber}</p>
              </div>
            )}
          </div>

          {!isChangingPhone ? (
            <>
              {!isOtpSent ? (
                <>
                  {/* Phone Number Input */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Phone Number
                    </label>
                    <div className="relative">
                      <PhoneInput
                        country={"us"}
                        value={phoneNumber}
                        onChange={setPhoneNumber}
                        enableSearch={true}
                        searchPlaceholder="Search countries..."
                        inputProps={{
                          className:
                            "w-full h-12 text-base px-14 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200",
                        }}
                        buttonStyle={{
                          height: "48px",
                          backgroundColor: "#f9fafb",
                          border: "1px solid #e5e7eb",
                          borderRight: "none",
                          borderTopLeftRadius: "8px",
                          borderBottomLeftRadius: "8px",
                        }}
                        dropdownStyle={{
                          backgroundColor: "white",
                          border: "1px solid #e5e7eb",
                          borderRadius: "8px",
                          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSendOtp}
                    disabled={isLoading || !phoneNumber}
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform focus:outline-none focus:ring-4 focus:ring-gray-900/20 flex items-center justify-center group ${
                      phoneNumber && !isLoading
                        ? "bg-gray-900 hover:bg-gray-800 text-white shadow-lg hover:shadow-xl hover:scale-[1.01] active:scale-[0.98]"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </div>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-200" />
                        Send Verification Code
                      </>
                    )}
                  </button>
                </>
              ) : (
                <>
                  {/* Action buttons */}
                  <div className="flex justify-between items-center mb-6">
                    <button
                      onClick={() => setIsChangingPhone(true)}
                      className="text-sm text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-1 group"
                    >
                      <Edit3 className="w-3 h-3 group-hover:scale-110 transition-transform" />
                      Change Phone
                    </button>
                    {canResend ? (
                      <button
                        onClick={handleSendOtp}
                        disabled={isLoading}
                        className="text-sm text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-1 group disabled:opacity-50"
                      >
                        <Send className="w-3 h-3 group-hover:scale-110 transition-transform" />
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
                    <div className="flex gap-2 justify-center">
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          id={`phone-otp-${i}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          onKeyDown={(e) => handleKeyDown(i, e)}
                          className="w-12 h-12 text-center text-lg font-semibold bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200"
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleVerifyPhone}
                    disabled={isLoading || otp.join("").length !== 6}
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform focus:outline-none focus:ring-4 focus:ring-gray-900/20 flex items-center justify-center group ${
                      otp.join("").length === 6 && !isLoading
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
                        Verify Phone Number
                      </>
                    )}
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              {/* Change Phone Form */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  New Phone Number
                </label>
                <div className="relative">
                  <PhoneInput
                    country={"us"}
                    value={newPhoneNumber}
                    onChange={setNewPhoneNumber}
                    enableSearch={true}
                    searchPlaceholder="Search countries..."
                    inputProps={{
                      className:
                        "w-full h-12 text-base px-14 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200",
                    }}
                    buttonStyle={{
                      height: "48px",
                      backgroundColor: "#f9fafb",
                      border: "1px solid #e5e7eb",
                      borderRight: "none",
                      borderTopLeftRadius: "8px",
                      borderBottomLeftRadius: "8px",
                    }}
                    dropdownStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsChangingPhone(false)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={handleChangePhone}
                  disabled={isLoading || !newPhoneNumber}
                  className={`flex-1 font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                    newPhoneNumber && !isLoading
                      ? "bg-gray-900 hover:bg-gray-800 text-white shadow-lg hover:shadow-xl"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  {isLoading ? "Updating..." : "Update Phone"}
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

export default PhoneVerification;
