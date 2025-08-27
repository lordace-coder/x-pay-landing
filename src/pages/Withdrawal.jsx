import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Shield,
  Smartphone,
  CheckCircle,
  AlertCircle,
  Loader,
  Trophy,
  DollarSign,
  Package,
  Star,
  Download,
  Clock,
  Eye,
  EyeOff,
  RefreshCw,
  Wallet,
  TrendingUp,
  Calendar,
  Target,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { BASEURL } from "../utils/utils";

export default function BatchWithdrawal() {
  const [step, setStep] = useState(1); // 1: Select Batch, 2: Request OTP, 3: Enter OTP, 4: Success
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [eligibleBatches, setEligibleBatches] = useState([]);
  const [otp, setOtp] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const [batchesLoading, setBatchesLoading] = useState(true);
  const [withdrawalData, setWithdrawalData] = useState(null);
  const [showOtp, setShowOtp] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  const { authFetch } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedBatch = searchParams.get("batch");

  // Timer effect for OTP expiration
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Fetch eligible batches on component mount
  useEffect(() => {
    fetchEligibleBatches();
  }, []);

  // Auto-select batch if coming from dashboard (only if it's available for withdrawal)
  useEffect(() => {
    if (preSelectedBatch && eligibleBatches.length > 0) {
      const batch = eligibleBatches.find(
        (b) => b.batch_uuid === preSelectedBatch
      );
      if (
        batch &&
        !batch.has_pending_withdrawal &&
        batch.latest_withdrawal_status !== "accepted"
      ) {
        setSelectedBatch(batch);
        setStep(2);
      }
    }
  }, [preSelectedBatch, eligibleBatches]);

  const fetchEligibleBatches = async () => {
    try {
      setBatchesLoading(true);
      const response = await authFetch(
        `${BASEURL}/batch-withdrawals/eligible-batches`
      );
      const data = await response.json();

      if (data.success) {
        setEligibleBatches(data.eligible_batches || []);
      } else {
        toast.error("Failed to fetch eligible batches");
      }
    } catch (error) {
      console.error("Error fetching eligible batches:", error);
      toast.error("Failed to load withdrawal data");
    } finally {
      setBatchesLoading(false);
    }
  };

  const requestOTP = async () => {
    try {
      setLoading(true);
      const response = await authFetch(
        `${BASEURL}/batch-withdrawals/request-otp`,
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (response.ok) {
        setOtpRequested(true);
        setOtpTimer(600); // 10 minutes
        setStep(3);
        toast.success("OTP sent to your email successfully!");
      } else {
        toast.error(data.detail || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error requesting OTP:", error);
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const submitWithdrawal = async () => {
    if (!otp || otp.length < 4) {
      toast.error("Please enter a valid OTP");
      return;
    }

    try {
      setLoading(true);
      const response = await authFetch(
        `${BASEURL}/batch-withdrawals/?otp_data=${otp}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            batch_uuid: selectedBatch.batch_uuid,
            usdt_wallet_address:
              selectedBatch.usdt_wallet_address || "WALLET_ADDRESS_PLACEHOLDER",
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setWithdrawalData(data);
        setStep(4);
        toast.success("Withdrawal request submitted successfully!");
      } else {
        toast.error(data.detail || "Failed to submit withdrawal request");
      }
    } catch (error) {
      console.error("Error submitting withdrawal:", error);
      toast.error("Failed to submit withdrawal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const BatchCard = ({ batch, selected, onClick }) => {
    const hasPendingWithdrawal = batch.has_pending_withdrawal;
    const isWithdrawn = batch.latest_withdrawal_status === "accepted";
    const isDenied = batch.latest_withdrawal_status === "denied";
    const isSelectable =
      batch.can_request_withdrawal && !hasPendingWithdrawal && !isWithdrawn;

    // Determine the status and styling
    const getStatusConfig = () => {
      if (isWithdrawn) {
        return {
          theme: "gray",
          bgClass:
            "border-gray-300 bg-gradient-to-br from-gray-50 to-slate-100 cursor-not-allowed opacity-60",
          badgeClass: "bg-gradient-to-r from-gray-500 to-slate-500",
          badgeText: "WITHDRAWN",
          badgeIcon: CheckCircle,
          description: "Successfully withdrawn",
          cardBg: "bg-gray-50/70 border-gray-200/50",
          statusBg: "bg-gray-50/50",
        };
      } else if (hasPendingWithdrawal) {
        return {
          theme: "orange",
          bgClass:
            "border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50 cursor-not-allowed opacity-75",
          badgeClass: "bg-gradient-to-r from-orange-500 to-amber-500",
          badgeText: "WITHDRAWAL PENDING",
          badgeIcon: Clock,
          description: "Withdrawal request pending review",
          cardBg: "bg-orange-50/70 border-orange-200/50",
          statusBg: "bg-orange-50/50",
        };
      } else if (isDenied) {
        return {
          theme: "blue",
          bgClass: `cursor-pointer transform hover:scale-[1.02] ${
            selected
              ? "border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg"
              : "border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 hover:border-blue-300 hover:shadow-md"
          }`,
          badgeClass: "bg-gradient-to-r from-blue-500 to-indigo-500",
          badgeText: "AVAILABLE (RETRY)",
          badgeIcon: RefreshCw,
          description: "Ready for withdrawal (previous request was declined)",
          cardBg: "bg-white/70 border-blue-200/50",
          statusBg: "bg-white/50",
        };
      } else {
        return {
          theme: "green",
          bgClass: `cursor-pointer transform hover:scale-[1.02] ${
            selected
              ? "border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg"
              : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
          }`,
          badgeClass: "bg-gradient-to-r from-green-500 to-emerald-500",
          badgeText: "READY TO WITHDRAW",
          badgeIcon: Trophy,
          description: "Ready for withdrawal",
          cardBg: "bg-white/70 border-yellow-200/50",
          statusBg: "bg-white/50",
        };
      }
    };

    const statusConfig = getStatusConfig();
    const BadgeIcon = statusConfig.badgeIcon;

    return (
      <div
        onClick={() => isSelectable && onClick(batch)}
        className={`relative overflow-hidden border-2 rounded-xl p-6 transition-all duration-300 ${statusConfig.bgClass}`}
      >
        {/* Status badge */}
        <div className="absolute top-4 right-4">
          <div
            className={`flex items-center space-x-1 ${statusConfig.badgeClass} text-white px-3 py-1 rounded-full text-xs font-bold shadow-md`}
          >
            <BadgeIcon className="h-3 w-3" />
            <span>{statusConfig.badgeText}</span>
            {!isWithdrawn && !hasPendingWithdrawal && (
              <Sparkles className="h-3 w-3" />
            )}
          </div>
        </div>

        {/* Selection indicator */}
        {selected && isSelectable && (
          <div className="absolute top-4 left-4">
            <CheckCircle className="h-6 w-6 text-green-500" />
          </div>
        )}

        {/* Status indicator */}
        {!isSelectable && (
          <div className="absolute top-4 left-4">
            <div
              className={`rounded-full p-2 ${
                isWithdrawn ? "bg-gray-100" : "bg-orange-100"
              }`}
            >
              {isWithdrawn ? (
                <CheckCircle className="h-5 w-5 text-gray-600" />
              ) : (
                <Clock className="h-5 w-5 text-orange-600" />
              )}
            </div>
          </div>
        )}

        <div className="mt-4">
          <div className="flex items-center space-x-3 mb-4">
            <div
              className={`p-3 rounded-xl shadow-md ${
                isWithdrawn
                  ? "bg-gradient-to-br from-gray-400 to-slate-400"
                  : hasPendingWithdrawal
                  ? "bg-gradient-to-br from-orange-400 to-amber-400"
                  : "bg-gradient-to-br from-yellow-400 to-orange-400"
              }`}
            >
              <Star className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-lg">
                Investment Batch
              </h4>
              <p className="text-sm text-gray-600">
                {statusConfig.description}
              </p>
            </div>
          </div>

          {/* Status-specific notices */}
          {isWithdrawn && (
            <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-4 w-4 text-gray-600" />
                <span className="font-semibold text-gray-800 text-sm">
                  Successfully Withdrawn
                </span>
              </div>
              <p className="text-xs text-gray-700">
                This batch was successfully withdrawn on{" "}
                {new Date(batch.last_withdrawal_date).toLocaleDateString()}. The
                funds have been transferred to your wallet.
              </p>
              <div className="mt-2">
                <span className="inline-flex items-center px-2 py-1 bg-gray-200 text-gray-800 text-xs font-medium rounded-full">
                  Status: COMPLETED
                </span>
              </div>
            </div>
          )}

          {hasPendingWithdrawal && (
            <div className="bg-orange-100 border border-orange-200 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <span className="font-semibold text-orange-800 text-sm">
                  Withdrawal In Progress
                </span>
              </div>
              <p className="text-xs text-orange-700">
                You have a pending withdrawal request for this batch submitted
                on {new Date(batch.last_withdrawal_date).toLocaleDateString()}.
                You cannot submit another request until this one is processed.
              </p>
              <div className="mt-2">
                <span className="inline-flex items-center px-2 py-1 bg-orange-200 text-orange-800 text-xs font-medium rounded-full">
                  Status: {batch.latest_withdrawal_status?.toUpperCase()}
                </span>
              </div>
            </div>
          )}

          {isDenied && (
            <div className="bg-blue-100 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <RefreshCw className="h-4 w-4 text-blue-600" />
                <span className="font-semibold text-blue-800 text-sm">
                  Previous Request Declined
                </span>
              </div>
              <p className="text-xs text-blue-700">
                Your previous withdrawal request was declined on{" "}
                {new Date(batch.last_withdrawal_date).toLocaleDateString()}. You
                can submit a new withdrawal request for this batch.
              </p>
              <div className="mt-2">
                <span className="inline-flex items-center px-2 py-1 bg-blue-200 text-blue-800 text-xs font-medium rounded-full">
                  Available for Retry
                </span>
              </div>
            </div>
          )}

          <div
            className={`backdrop-blur-sm rounded-lg p-4 mb-4 border ${statusConfig.cardBg}`}
          >
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 block">Initial Investment</span>
                <div className="font-bold text-gray-900 text-lg">
                  ${batch.invested_amount?.toLocaleString() || "N/A"}
                </div>
              </div>
              <div>
                <span className="text-gray-600 block">Interest Earned</span>
                <div className="font-bold text-green-600 text-lg flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />$
                  {batch.interest_earned?.toFixed(2) || "N/A"}
                </div>
              </div>
            </div>

            <div
              className={`mt-3 pt-3 border-t ${
                isWithdrawn
                  ? "border-gray-200/50"
                  : hasPendingWithdrawal
                  ? "border-orange-200/50"
                  : "border-yellow-200/50"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">
                  {isWithdrawn ? "Amount Withdrawn" : "Total Withdrawal"}
                </span>
                <div className="font-bold text-xl text-gray-900 flex items-center">
                  <DollarSign className="h-5 w-5 text-green-600 mr-1" />
                  {batch.total_value?.toFixed(2) || "N/A"}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <div
              className={`text-center rounded-lg p-2 ${statusConfig.statusBg}`}
            >
              <div className="font-bold text-gray-900">
                {batch.videos_completed || "N/A"}
              </div>
              <div className="text-gray-600">Videos</div>
            </div>
            <div
              className={`text-center rounded-lg p-2 ${statusConfig.statusBg}`}
            >
              <div className="font-bold text-gray-900">100%</div>
              <div className="text-gray-600">Complete</div>
            </div>
            <div
              className={`text-center rounded-lg p-2 ${statusConfig.statusBg}`}
            >
              <div
                className={`font-bold ${
                  isWithdrawn
                    ? "text-gray-600"
                    : hasPendingWithdrawal
                    ? "text-orange-600"
                    : isDenied
                    ? "text-blue-600"
                    : "text-green-600"
                }`}
              >
                {isWithdrawn
                  ? "Withdrawn"
                  : hasPendingWithdrawal
                  ? "Pending"
                  : isDenied
                  ? "Retry"
                  : "Ready"}
              </div>
              <div className="text-gray-600">Status</div>
            </div>
          </div>

          {/* Action buttons */}
          {(hasPendingWithdrawal || isWithdrawn) && (
            <div
              className={`mt-4 pt-4 border-t ${
                isWithdrawn ? "border-gray-200" : "border-orange-200"
              }`}
            >
              <button
                onClick={() => navigate("/withdrawal-history")}
                className={`w-full font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                  isWithdrawn
                    ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    : "bg-orange-100 hover:bg-orange-200 text-orange-700"
                }`}
              >
                <Target className="h-4 w-4" />
                <span>
                  {isWithdrawn
                    ? "View Withdrawal History"
                    : "Track Withdrawal Status"}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen trans_4 lg:pl-16">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 pt-4 pb-2 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center h-14 sm:h-16">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors mr-2 sm:mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                Batch Withdrawal
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Withdraw your completed investments
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="max-w-4xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6">
        <div className="flex items-center justify-between mb-8">
          {[
            { number: 1, title: "Select Batch", icon: Package },
            { number: 2, title: "Verify Identity", icon: Shield },
            { number: 3, title: "Enter OTP", icon: Smartphone },
            { number: 4, title: "Complete", icon: CheckCircle },
          ].map((item, index) => (
            <div key={item.number} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  step > item.number
                    ? "bg-green-500 text-white"
                    : step === item.number
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step > item.number ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <item.icon className="h-5 w-5" />
                )}
              </div>
              <div className="ml-3 hidden sm:block">
                <p
                  className={`text-sm font-medium ${
                    step >= item.number ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {item.title}
                </p>
              </div>
              {index < 3 && (
                <div className="flex-1 mx-4 h-0.5 bg-gray-200">
                  <div
                    className={`h-full transition-all duration-300 ${
                      step > item.number ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Select Batch */}
        {step === 1 && (
          <div className="bg-white rounded-2xl p-3 sm:p-6 shadow-sm border border-gray-100">
            <div className="text-center mb-8">
              <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Package className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Select Batch to Withdraw
              </h2>
              <p className="text-gray-600">
                Choose from your completed investment batches ready for
                withdrawal
              </p>
            </div>

            {batchesLoading ? (
              <div className="flex items-center justify-center py-8 sm:py-12">
                <Loader className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-3 text-gray-600">
                  Loading eligible batches...
                </span>
              </div>
            ) : eligibleBatches.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Batches Ready for Withdrawal
                </h3>
                <p className="text-gray-600 mb-6">
                  Complete your investment batches by watching all required
                  videos to unlock withdrawals.
                </p>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-4 py-2 sm:px-6 sm:py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
            ) : (
              <>
                <div className="grid gap-6 mb-8">
                  {eligibleBatches.map((batch) => (
                    <BatchCard
                      key={batch.batch_uuid}
                      batch={batch}
                      selected={selectedBatch?.batch_uuid === batch.batch_uuid}
                      onClick={setSelectedBatch}
                    />
                  ))}
                </div>

                {/* Available batches info */}
                <div className="bg-blue-50 rounded-xl p-4 mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Package className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-blue-900">
                      Batch Status Summary
                    </span>
                  </div>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p>
                      <strong>
                        {
                          eligibleBatches.filter(
                            (b) =>
                              !b.has_pending_withdrawal &&
                              b.latest_withdrawal_status !== "accepted"
                          ).length
                        }
                      </strong>{" "}
                      of {eligibleBatches.length} batch(es) available for
                      withdrawal
                    </p>
                    {eligibleBatches.some((b) => b.has_pending_withdrawal) && (
                      <p>
                        <strong>
                          {
                            eligibleBatches.filter(
                              (b) => b.has_pending_withdrawal
                            ).length
                          }
                        </strong>{" "}
                        batch(es) have pending withdrawal requests
                      </p>
                    )}
                    {eligibleBatches.some(
                      (b) => b.latest_withdrawal_status === "accepted"
                    ) && (
                      <p>
                        <strong>
                          {
                            eligibleBatches.filter(
                              (b) => b.latest_withdrawal_status === "accepted"
                            ).length
                          }
                        </strong>{" "}
                        batch(es) have been successfully withdrawn
                      </p>
                    )}
                    {eligibleBatches.some(
                      (b) => b.latest_withdrawal_status === "denied"
                    ) && (
                      <p>
                        <strong>
                          {
                            eligibleBatches.filter(
                              (b) => b.latest_withdrawal_status === "denied"
                            ).length
                          }
                        </strong>{" "}
                        batch(es) available for retry (previous request
                        declined)
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="px-3 py-2 sm:px-6 sm:py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    disabled={
                      !selectedBatch ||
                      selectedBatch.has_pending_withdrawal ||
                      selectedBatch.latest_withdrawal_status === "accepted"
                    }
                    className="px-4 py-2 sm:px-8 sm:py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <span>Continue</span>
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 2: Verify Identity */}
        {step === 2 && (
          <div className="bg-white rounded-2xl p-3 sm:p-6 shadow-sm border border-gray-100">
            <div className="text-center mb-8">
              <div className="p-4 bg-orange-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Verify Your Identity
              </h2>
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                <p className="text-sm text-blue-700">
                  Note: For your security, a verification code has been sent to
                  both your <span className="font-semibold">phone number</span>{" "}
                  and <span className="font-semibold">email address</span>.
                </p>
              </div>
            </div>

            {selectedBatch && (
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Withdrawal Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 block">Investment</span>
                    <div className="font-bold text-gray-900">
                      ${selectedBatch.invested_amount?.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 block">Interest Earned</span>
                    <div className="font-bold text-green-600">
                      +${selectedBatch.interest_earned?.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600 block">
                      Total Withdrawal
                    </span>
                    <div className="font-bold text-xl text-gray-900">
                      ${selectedBatch.total_value?.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <Smartphone className="h-6 w-6 text-blue-600" />
                <h3 className="font-semibold text-gray-900">
                  Security Verification
                </h3>
              </div>
              <p className="text-gray-600 text-sm">
                We'll send a 6-digit verification code to your registered email
                address. This code will expire in 10 minutes for your security.
              </p>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-3 py-2 sm:px-6 sm:py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Back
              </button>
              <button
                onClick={requestOTP}
                disabled={loading}
                className="px-4 py-2 sm:px-8 sm:py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Send Verification Code</span>
                    <Smartphone className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Enter OTP */}
        {step === 3 && (
          <div className="bg-white rounded-2xl p-3 sm:p-6 shadow-sm border border-gray-100">
            <div className="text-center mb-8">
              <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Smartphone className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Enter Verification Code
              </h2>
              <p className="text-gray-600">
                We've sent a 6-digit code to your email address
              </p>
              {otpTimer > 0 && (
                <div className="mt-2 flex items-center justify-center space-x-2 text-sm text-orange-600">
                  <Clock className="h-4 w-4" />
                  <span>Code expires in {formatTime(otpTimer)}</span>
                </div>
              )}
            </div>

            <div className="max-w-md mx-auto">
              <div className="relative mb-6">
                <input
                  type={showOtp ? "text" : "password"}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full px-4 py-4 text-center text-lg font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  maxLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowOtp(!showOtp)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showOtp ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              <div className="text-center mb-8">
                <button
                  onClick={requestOTP}
                  disabled={loading || otpTimer > 540} // Disable if recently sent (within 1 minute)
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium disabled:text-gray-400 disabled:cursor-not-allowed flex items-center space-x-1 mx-auto"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Resend Code</span>
                </button>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-3 py-2 sm:px-6 sm:py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Back
              </button>
              <button
                onClick={submitWithdrawal}
                disabled={loading || !otp || otp.length < 4}
                className="px-4 py-2 sm:px-8 sm:py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Withdrawal</span>
                    <CheckCircle className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && withdrawalData && (
          <div className="bg-white rounded-2xl p-3 sm:p-6 shadow-sm border border-gray-100">
            <div className="text-center mb-8">
              <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                🎉 Withdrawal Request Submitted!
              </h2>
              <p className="text-gray-600">
                Your withdrawal request has been successfully submitted for
                review
              </p>
            </div>

            <div className="bg-green-50 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">
                Request Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 block">Request ID</span>
                  <div className="font-mono text-gray-900">
                    {withdrawalData.withdrawal_request?.id || "N/A"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600 block">Amount</span>
                  <div className="font-bold text-green-600 text-lg">
                    $
                    {withdrawalData.withdrawal_request?.amount?.toFixed(2) ||
                      "N/A"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600 block">Status</span>
                  <div className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                    <Clock className="h-3 w-3 mr-1" />
                    Pending Review
                  </div>
                </div>
                <div>
                  <span className="text-gray-600 block">Submitted</span>
                  <div className="text-gray-900">
                    {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <div className="flex items-center space-x-3 mb-3">
                <AlertCircle className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">What's Next?</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>
                  • Your request will be reviewed by our team within 1-3
                  business days
                </li>
                <li>• You'll receive an email notification once processed</li>
                <li>
                  • Funds will be transferred to your designated wallet address
                </li>
                <li>• You can track the status in your withdrawal history</li>
              </ul>
            </div>

            <div className="flex justify-center space-x-2 sm:space-x-4">
              <button
                onClick={() => navigate("/withdrawal-history")}
                className="px-3 py-2 sm:px-6 sm:py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center space-x-2"
              >
                <Target className="h-4 w-4" />
                <span>View History</span>
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="px-4 py-2 sm:px-8 sm:py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <span>Back to Dashboard</span>
                <Wallet className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
