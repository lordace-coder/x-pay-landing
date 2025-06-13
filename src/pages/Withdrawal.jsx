import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  DollarSign,
  Wallet,
  Shield,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Copy,
  ArrowRight,
  Clock,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function WithdrawalPage() {
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("");
  const [usdtAddress, setUsdtAddress] = useState("");
  const [otp, setOtp] = useState("");
  const [showAddress, setShowAddress] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const balance = 2847.5;
  const minWithdrawal = 10;
  const maxWithdrawal = 5000;

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const sendOTP = () => {
    setIsLoading(true);
    setTimeout(() => {
      setOtpSent(true);
      setCountdown(60);
      setIsLoading(false);
    }, 2000);
  };

  const verifyOTP = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (otp === "123456") {
        setStep(4);
      } else {
        alert("Invalid OTP. Try again.");
      }
      setIsLoading(false);
    }, 1500);
  };

  const processWithdrawal = () => {
    setIsLoading(true);
    setTimeout(() => {
      setStep(5);
      setIsLoading(false);
    }, 3000);
  };

  const isValidAmount =
    amount &&
    parseFloat(amount) >= minWithdrawal &&
    parseFloat(amount) <= Math.min(maxWithdrawal, balance);
  const isValidAddress = usdtAddress.length >= 26 && usdtAddress.length <= 62;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors mr-2"
                onClick={() => navigate("/dashboard")}
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center justify-center w-10 h-10 bg-black rounded-xl mr-4">
                <span className="text-xl font-bold text-white">X</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Withdraw Funds
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4, 5].map((stepNum) => (
              <div
                key={stepNum}
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  stepNum <= step
                    ? "bg-blue-600 text-white"
                    : stepNum === step + 1
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {stepNum <= step - 1 ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  stepNum
                )}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(step / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {step === 1 && (
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Enter Amount
                </h2>
                <p className="text-gray-600">
                  How much would you like to withdraw?
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-600">Available Balance</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${balance.toFixed(2)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Withdrawal Amount ($)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={amount}
                      onChange={handleAmountChange}
                      placeholder="0.00"
                      className="block w-full pl-10 pr-4 py-4 text-2xl font-bold border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>Min: ${minWithdrawal}</span>
                    <span>Max: ${Math.min(maxWithdrawal, balance)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[25, 50, 100].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setAmount(preset.toString())}
                      className="py-3 px-4 text-center border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      ${preset}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setStep(2)}
                  disabled={!isValidAmount}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  Continue
                  <ArrowRight className="h-5 w-5 ml-2" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                  <Wallet className="h-8 w-8 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  USDT Address
                </h2>
                <p className="text-gray-600">Enter your USDT wallet address</p>
              </div>

              <div className="space-y-6">
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        Important
                      </p>
                      <p className="text-xs text-blue-700">
                        Only send to USDT (TRC-20) addresses. Wrong address =
                        lost funds.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    USDT Address (TRC-20)
                  </label>
                  <div className="relative">
                    <input
                      type={showAddress ? "text" : "password"}
                      value={usdtAddress}
                      onChange={(e) => setUsdtAddress(e.target.value)}
                      placeholder="Enter your USDT address"
                      className="block w-full pr-20 py-4 text-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center space-x-2 pr-3">
                      <button
                        type="button"
                        onClick={() => setShowAddress(!showAddress)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {showAddress ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          navigator.clipboard?.readText().then(setUsdtAddress)
                        }
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  {usdtAddress && (
                    <p
                      className={`text-xs mt-2 ${
                        isValidAddress ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isValidAddress
                        ? "✓ Valid address format"
                        : "✗ Invalid address format"}
                    </p>
                  )}
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!isValidAddress}
                    className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    Continue
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                  <Shield className="h-8 w-8 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Security Verification
                </h2>
                <p className="text-gray-600">
                  We'll send an OTP to your registered email
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-semibold">${amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">To:</span>
                    <span className="font-mono text-sm">
                      {usdtAddress.slice(0, 6)}...{usdtAddress.slice(-6)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Network:</span>
                    <span className="font-semibold">USDT (TRC-20)</span>
                  </div>
                </div>

                {!otpSent ? (
                  <button
                    onClick={sendOTP}
                    disabled={isLoading}
                    className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-300 transition-colors flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      "Send OTP Code"
                    )}
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-sm text-green-600 mb-2">
                        ✓ OTP sent to your email
                      </p>
                      <p className="text-xs text-gray-500">
                        Didn't receive it?
                        {countdown > 0 ? (
                          <span className="ml-1">Resend in {countdown}s</span>
                        ) : (
                          <button
                            onClick={sendOTP}
                            className="ml-1 text-blue-600 hover:underline"
                          >
                            Resend now
                          </button>
                        )}
                      </p>
                    </div>
                    <button
                      onClick={() => setStep(4)}
                      className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      I received the OTP
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </button>
                  </div>
                )}

                <button
                  onClick={() => setStep(2)}
                  className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Enter OTP Code
                </h2>
                <p className="text-gray-600">
                  Enter the 6-digit code sent to your email
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    6-Digit OTP Code
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="123456"
                    className="block w-full py-4 text-center text-2xl font-bold tracking-widest border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    maxLength={6}
                  />
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Demo: Use 123456 for testing
                  </p>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 bg-gray-100 text-gray-700 py-4 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={verifyOTP}
                    disabled={otp.length !== 6 || isLoading}
                    className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify & Continue"
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Withdrawal Submitted!
              </h2>
              <p className="text-gray-600 mb-8">
                Your withdrawal request has been processed successfully
              </p>

              <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Transaction Details
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-semibold">${amount} USDT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">To Address:</span>
                    <span className="font-mono">
                      {usdtAddress.slice(0, 8)}...{usdtAddress.slice(-8)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="text-orange-600 font-semibold">
                      Processing
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Est. Completion:</span>
                    <span className="">5-10 minutes</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => alert("Navigate to dashboard")}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
