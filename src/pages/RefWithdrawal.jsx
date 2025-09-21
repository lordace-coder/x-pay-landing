import { useState, useEffect } from "react";
import {
  Wallet,
  ArrowLeft,
  Shield,
  CheckCircle,
  AlertCircle,
  Phone,
  Copy,
  Check,
  DollarSign,
  Clock,
  Send,
  CreditCard,
  Info,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { BASEURL } from "../utils/utils";

const ReferralWithdrawal = () => {
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Enter OTP + Details, 3: Success
  const [formData, setFormData] = useState({
    otp: "",
    wallet_address: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [otpRequested, setOtpRequested] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [walletCopied, setWalletCopied] = useState(false);

  const { authFetch, user } = useAuth();

  // Sample wallet for copy functionality
  const sampleWallet = "0x742d35Cc6634C0532925a3b8D3Ac8C9AF6c69f1A";

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "otp") {
      // Only allow numbers and limit to 6 digits
      const numericValue = value.replace(/[^0-9]/g, "").slice(0, 6);
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else if (name === "wallet_address") {
      // Basic wallet address formatting
      setFormData((prev) => ({ ...prev, [name]: value.trim() }));
    }
  };

  const requestOTP = async () => {
    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await authFetch(`${BASEURL}/batch-withdrawals/request-otp
`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setOtpRequested(true);
        setStep(2);
        setCountdown(300); // 5 minutes countdown
        setMessage({
          type: "success",
          text: "OTP sent successfully! Check your phone for the verification code."
        });
      } else {
        const errorData = await response.json();
        setMessage({
          type: "error",
          text: errorData.message || "Failed to send OTP. Please try again.",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Network error. Please check your connection and try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const submitWithdrawal = async () => {
    if (!formData.otp || !formData.wallet_address) {
      setMessage({ type: "error", text: "Please fill in all required fields" });
      return;
    }

    if (formData.otp.length !== 6) {
      setMessage({ type: "error", text: "Please enter a valid 6-digit OTP" });
      return;
    }

    // Basic wallet address validation (BEP20/Ethereum format)
    if (!formData.wallet_address.match(/^0x[a-fA-F0-9]{40}$/)) {
      alert("Invalid wallet address please check and confirm then try again")
      setMessage({
        type: "error",
        text: "Please enter a valid BEP20 USDT wallet address (starts with 0x)"
      });
      return;
    }

    setIsLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await authFetch(`${BASEURL}/batch-withdrawals/referral-bonus/${formData.wallet_address}/${formData.otp}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },

      });

      if (response.ok) {
        setStep(3);
        setMessage({
          type: "success",
          text: "Withdrawal request submitted successfully!"
        });
      } else {
        const errorData = await response.json();
        setMessage({
          type: "error",
          text: errorData.message || "Withdrawal failed. Please verify your OTP and wallet address.",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Network error. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyWalletExample = async () => {
    try {
      await navigator.clipboard.writeText(sampleWallet);
      setWalletCopied(true);
      setTimeout(() => setWalletCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = sampleWallet;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setWalletCopied(true);
        setTimeout(() => setWalletCopied(false), 2000);
      } catch (fallbackErr) { }
      document.body.removeChild(textArea);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setMessage({ type: "", text: "" });
    }
  };

  const resetFlow = () => {
    setStep(1);
    setFormData({ otp: "", wallet_address: "" });
    setOtpRequested(false);
    setCountdown(0);
    setMessage({ type: "", text: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      <div className="p-4 sm:p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 shadow-xl">
              <Wallet className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                Withdraw Referral Bonus
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Withdraw your referral earnings to your BEP20 USDT wallet
              </p>
            </div>
          </div>

          {/* Balance Display */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  Available Balance
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-emerald-600">
                ${user?.referral_balance?.toFixed(2) || "0.00"}
              </div>
              <p className="text-xs text-gray-500">
                Minimum withdrawal: $50.00
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-4 py-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= stepNum
                      ? "bg-emerald-600 text-white shadow-lg"
                      : "bg-gray-200 text-gray-500"
                    }`}
                >
                  {stepNum}
                </div>
                {stepNum < 3 && (
                  <div
                    className={`w-8 h-0.5 mx-2 transition-all ${step > stepNum ? "bg-emerald-600" : "bg-gray-200"
                      }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Alert Messages */}
          {message.text && (
            <div
              className={`flex items-start gap-3 p-4 rounded-xl border ${message.type === "success"
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

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="p-4 sm:p-6">
              {/* Step 1: Request OTP */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="text-center space-y-3">
                    <Phone className="w-12 h-12 text-blue-600 mx-auto" />
                    <h2 className="text-xl font-bold text-gray-900">
                      Verify Your Identity
                    </h2>
                    <p className="text-gray-600 text-sm">
                      We'll send a verification code to your registered phone number to ensure secure withdrawal.
                    </p>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">Before proceeding:</p>
                        <ul className="space-y-1 text-xs">
                          <li>• Ensure you have your BEP20 USDT wallet address ready</li>
                          <li>• Double-check your phone is accessible for the OTP</li>
                          <li>• Minimum withdrawal amount is $50.00</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={requestOTP}
                    disabled={isLoading || !user?.referral_balance || user.referral_balance < 50}
                    className={`w-full py-4 px-6 rounded-xl font-semibold transition-all flex items-center justify-center gap-3 ${user?.referral_balance >= 50
                        ? "bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Request Verification Code
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Step 2: Enter OTP + Wallet Details */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center space-y-3">
                    <Shield className="w-12 h-12 text-emerald-600 mx-auto" />
                    <h2 className="text-xl font-bold text-gray-900">
                      Enter Verification Details
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Enter the OTP sent to your phone and your BEP20 USDT wallet address
                    </p>
                  </div>

                  {/* OTP Countdown */}
                  {countdown > 0 && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                      <div className="flex items-center justify-center gap-2 text-amber-800">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          OTP expires in: {formatTime(countdown)}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    {/* OTP Input */}
                    <div className="space-y-2">
                      <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                        Verification Code (OTP)
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="otp"
                          name="otp"
                          value={formData.otp}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-center text-lg font-mono tracking-widest"
                          placeholder="000000"
                          maxLength="6"
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Enter the 6-digit code sent to your registered phone number
                      </p>
                    </div>

                    {/* Wallet Address Input */}
                    <div className="space-y-2">
                      <label htmlFor="wallet_address" className="block text-sm font-medium text-gray-700">
                        BEP20 USDT Wallet Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Wallet className="w-4 h-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="wallet_address"
                          name="wallet_address"
                          value={formData.wallet_address}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-sm font-mono"
                          placeholder="0x..."
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        Enter your Binance Smart Chain (BEP20) USDT wallet address
                      </p>
                    </div>

                    {/* Wallet Example */}
                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-200">
                      <div className="flex items-start gap-2 mb-2">
                        <Info className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                        <span className="text-xs font-medium text-gray-700">Example wallet format:</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-white px-2 py-1 rounded border font-mono text-gray-800 flex-1 break-all">
                          {sampleWallet}
                        </code>
                        <button
                          onClick={copyWalletExample}
                          disabled={walletCopied}
                          className="px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded text-xs flex items-center gap-1 disabled:opacity-60"
                        >
                          {walletCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>

                    {/* Warning */}
                    <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="text-xs text-red-800">
                          <p className="font-medium mb-1">Important:</p>
                          <p>Ensure your wallet address is correct. Funds sent to wrong addresses cannot be recovered.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={goBack}
                      className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>

                    <button
                      onClick={submitWithdrawal}
                      disabled={isLoading || !formData.otp || !formData.wallet_address}
                      className="flex-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed shadow-lg"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-5 h-5" />
                          Submit Withdrawal
                        </>
                      )}
                    </button>
                  </div>

                  {/* Resend OTP */}
                  {countdown === 0 && (
                    <div className="text-center">
                      <button
                        onClick={requestOTP}
                        disabled={isLoading}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-center gap-2 mx-auto transition-colors"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Resend OTP
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Success */}
              {step === 3 && (
                <div className="space-y-6 text-center">
                  <div className="space-y-4">
                    <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
                    <h2 className="text-xl font-bold text-gray-900">
                      Withdrawal Request Submitted!
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Your withdrawal request has been processed successfully. You'll receive your funds within 15 days.
                    </p>
                  </div>

                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <div className="space-y-2 text-sm text-green-800">
                      <p><strong>Amount:</strong> ${user?.referral_balance?.toFixed(2)}</p>
                      <p><strong>Wallet:</strong> <span className="font-mono text-xs break-all">{formData.wallet_address}</span></p>
                      <p><strong>Status:</strong> Processing</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={resetFlow}
                      className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors"
                    >
                      Make Another Withdrawal
                    </button>

                    <button
                      onClick={() => window.history.back()}
                      className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Settings
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Help Section */}
          {step < 3 && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4">
              <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Info className="w-4 h-4 text-blue-600" />
                Need Help?
              </h3>
              <div className="space-y-2 text-xs text-gray-600">
                <p>• Make sure your phone number is registered and active</p>
                <p>• BEP20 USDT addresses start with "0x" and are 42 characters long</p>
                <p>• Processing time: 24-48 hours after approval</p>
                <p>• Contact support if you don't receive the OTP within 5 minutes</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferralWithdrawal;