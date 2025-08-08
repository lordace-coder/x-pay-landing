import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Shield,
  Smartphone,
  CheckCircle,
  AlertCircle,
  Loader,
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
  Target,
  AlertTriangle,
  X,
  MinusCircle,
  Info,
  Calculator,
  CreditCard,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { BASEURL } from "../utils/utils";

export default function EmergencyWithdrawal() {
  const [step, setStep] = useState(1); // 1: Select Batch, 2: Warning & Consequences, 3: Confirm Details, 4: Request OTP, 5: Enter OTP, 6: Success
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [activeBatches, setActiveBatches] = useState([]);
  const [otp, setOtp] = useState("");
  const [otpRequested, setOtpRequested] = useState(false);
  const [loading, setLoading] = useState(false);
  const [batchesLoading, setBatchesLoading] = useState(true);
  const [withdrawalData, setWithdrawalData] = useState(null);
  const [showOtp, setShowOtp] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [walletAddress, setWalletAddress] = useState("");
  const [acknowledged, setAcknowledged] = useState(false);

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

  // Fetch active batches on component mount
  useEffect(() => {
    fetchActiveBatches();
  }, []);

  // Auto-select batch if coming from dashboard
  useEffect(() => {
    if (preSelectedBatch && activeBatches.length > 0) {
      const batch = activeBatches.find(
        (b) => b.batch_uuid === preSelectedBatch
      );
      if (batch && !batch.has_pending_withdrawal) {
        setSelectedBatch(batch);
        setStep(2);
      }
    }
  }, [preSelectedBatch, activeBatches]);

  const fetchActiveBatches = async () => {
    try {
      setBatchesLoading(true);
      const response = await authFetch(`${BASEURL}/investment/batches`);
      const data = await response.json();

      if (data.success || data.batches) {
        // Filter for active batches only
        const activeOnly = (data.batches || []).filter(
          (batch) => batch.status === "active" && !batch.has_pending_withdrawal
        );
        setActiveBatches(activeOnly);
      } else {
        toast.error("Failed to fetch active batches");
      }
    } catch (error) {
      console.error("Error fetching active batches:", error);
      toast.error("Failed to load withdrawal data");
    } finally {
      setBatchesLoading(false);
    }
  };

  // Calculate withdrawal consequences for emergency withdrawal
  const getEmergencyWithdrawalInfo = (batch) => {
    if (!batch) return null;

    const daysRemaining = batch.days_remaining || 0;
    const videosCompleted = batch.videos_watched > 30;
    
    let withdrawalType, principalAmount, interestAmount, chargeAmount, netAmount, consequences;
    
    const withdrawalCharge = 0.05; // 5%
    
    if (daysRemaining <= 15 && videosCompleted) {
      // Early withdrawal with reduced interest
      withdrawalType = "Early Withdrawal";
      principalAmount = batch.invested_amount;
      interestAmount = batch.current_interest * 0.2; // Only 20%
      const grossAmount = principalAmount + interestAmount;
      chargeAmount = grossAmount * withdrawalCharge;
      netAmount = grossAmount - chargeAmount;
      consequences = [
        "⚠️ You will lose 80% of your earned interest",
        `💸 Interest penalty: -$${(batch.current_interest * 0.8).toFixed(2)}`,
        "💰 5% withdrawal processing fee applies",
        "📹 At least 30 videos completed requirement met",
        "⏰ Withdrawal available due to ≤15 days remaining"
      ];
    } else {
      // Emergency withdrawal - principal only
      withdrawalType = "Emergency Withdrawal";
      principalAmount = batch.invested_amount;
      interestAmount = 0; // No interest
      chargeAmount = principalAmount * withdrawalCharge;
      netAmount = principalAmount - chargeAmount;
      consequences = [
        "🚨 ALL earned interest will be forfeited",
        `💸 Total interest lost: -$${batch.current_interest.toFixed(2)}`,
        "💰 5% withdrawal processing fee applies",
        "⏰ Investment period terminated early",
        "📊 No completion bonuses or rewards"
      ];
    }

    return {
      withdrawalType,
      principalAmount,
      interestAmount,
      chargeAmount,
      netAmount,
      consequences,
      isEmergency: daysRemaining > 15 || !videosCompleted,
      isEarly: daysRemaining <= 15 && videosCompleted,
      totalLoss: batch.current_interest - interestAmount + chargeAmount
    };
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
        setStep(5);
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

  const submitEmergencyWithdrawal = async () => {
    if (!otp || otp.length < 4) {
      toast.error("Please enter a valid OTP");
      return;
    }

    if (!walletAddress.trim()) {
      toast.error("Please enter your USDT wallet address");
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
            usdt_wallet_address: walletAddress,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setWithdrawalData(data);
        setStep(6);
        toast.success("Emergency withdrawal request submitted successfully!");
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

  const ActiveBatchCard = ({ batch, selected, onClick }) => {
    const withdrawalInfo = getEmergencyWithdrawalInfo(batch);
    
    return (
      <div
        onClick={() => onClick(batch)}
        className={`relative overflow-hidden border-2 rounded-xl p-6 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${
          selected
            ? "border-red-500 bg-gradient-to-br from-red-50 to-orange-50 shadow-lg"
            : "border-gray-200 bg-white hover:border-red-300 hover:shadow-md"
        }`}
      >
        {/* Selection indicator */}
        {selected && (
          <div className="absolute top-4 left-4">
            <CheckCircle className="h-6 w-6 text-red-500" />
          </div>
        )}

        {/* Warning badge */}
        <div className="absolute top-4 right-4">
          <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold shadow-md ${
            withdrawalInfo?.isEmergency 
              ? "bg-gradient-to-r from-red-500 to-red-600 text-white"
              : "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
          }`}>
            {withdrawalInfo?.isEmergency ? (
              <>
                <AlertTriangle className="h-3 w-3" />
                <span>EMERGENCY</span>
              </>
            ) : (
              <>
                <MinusCircle className="h-3 w-3" />
                <span>EARLY</span>
              </>
            )}
          </div>
        </div>

        <div className="mt-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-3 rounded-xl shadow-md bg-gradient-to-br from-red-400 to-orange-400">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-lg">
                Active Investment Batch
              </h4>
              <p className="text-sm text-gray-600">
                {withdrawalInfo?.withdrawalType} available
              </p>
            </div>
          </div>

          <div className="backdrop-blur-sm rounded-lg p-4 mb-4 border bg-white/70 border-red-200/50">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 block">Initial Investment</span>
                <div className="font-bold text-gray-900 text-lg">
                  ${batch.invested_amount?.toLocaleString() || "N/A"}
                </div>
              </div>
              <div>
                <span className="text-gray-600 block">Current Interest</span>
                <div className="font-bold text-green-600 text-lg flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />$
                  {batch.current_interest?.toFixed(2) || "N/A"}
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-red-200/50">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Net Withdrawal</span>
                <div className="font-bold text-xl text-gray-900 flex items-center">
                  <DollarSign className="h-5 w-5 text-red-600 mr-1" />
                  {withdrawalInfo?.netAmount.toFixed(2) || "N/A"}
                </div>
              </div>
              <div className="text-xs text-red-600 mt-1">
                Loss: ${withdrawalInfo?.totalLoss.toFixed(2)} (Interest + Fees)
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs mb-4">
            <div className="text-center bg-white/50 rounded-lg p-2">
              <div className="font-bold text-gray-900">
                {batch.videos_watched || "N/A"}
              </div>
              <div className="text-gray-600">Videos</div>
            </div>
            <div className="text-center bg-white/50 rounded-lg p-2">
              <div className="font-bold text-red-600">
                {batch.days_remaining || 0}
              </div>
              <div className="text-gray-600">Days Left</div>
            </div>
            <div className="text-center bg-white/50 rounded-lg p-2">
              <div className="font-bold text-gray-900">
                {batch.completion_percentage?.toFixed(1) || 0}%
              </div>
              <div className="text-gray-600">Complete</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${batch.completion_percentage || 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 lg:pl-16">
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
                Emergency Withdrawal
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">
                Withdraw from active investments with penalties
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
            { number: 2, title: "Warning", icon: AlertTriangle },
            { number: 3, title: "Details", icon: Info },
            { number: 4, title: "Verify", icon: Shield },
            { number: 5, title: "OTP", icon: Smartphone },
            { number: 6, title: "Complete", icon: CheckCircle },
          ].map((item, index) => (
            <div key={item.number} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-xs ${
                  step > item.number
                    ? "bg-red-500 text-white"
                    : step === item.number
                    ? "bg-red-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step > item.number ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <item.icon className="h-4 w-4" />
                )}
              </div>
              <div className="ml-2 hidden sm:block">
                <p
                  className={`text-xs font-medium ${
                    step >= item.number ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {item.title}
                </p>
              </div>
              {index < 5 && (
                <div className="flex-1 mx-2 h-0.5 bg-gray-200">
                  <div
                    className={`h-full transition-all duration-300 ${
                      step > item.number ? "bg-red-500" : "bg-gray-200"
                    }`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Select Active Batch */}
        {step === 1 && (
          <div className="bg-white rounded-2xl p-3 sm:p-6 shadow-sm border border-gray-100">
            <div className="text-center mb-8">
              <div className="p-4 bg-red-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Package className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Select Active Batch
              </h2>
              <p className="text-gray-600">
                Choose an active investment batch for emergency withdrawal
              </p>
            </div>

            {batchesLoading ? (
              <div className="flex items-center justify-center py-8 sm:py-12">
                <Loader className="h-8 w-8 animate-spin text-red-600" />
                <span className="ml-3 text-gray-600">
                  Loading active batches...
                </span>
              </div>
            ) : activeBatches.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Active Batches Found
                </h3>
                <p className="text-gray-600 mb-6">
                  You don't have any active investment batches available for emergency withdrawal.
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
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span className="font-semibold text-red-900 text-sm">
                      Emergency Withdrawal Warning
                    </span>
                  </div>
                  <p className="text-xs text-red-700">
                    Emergency withdrawals result in significant financial penalties. You will lose most or all of your earned interest plus pay a 5% processing fee. Consider waiting for batch completion if possible.
                  </p>
                </div>

                <div className="grid gap-6 mb-8">
                  {activeBatches.map((batch) => (
                    <ActiveBatchCard
                      key={batch.batch_uuid}
                      batch={batch}
                      selected={selectedBatch?.batch_uuid === batch.batch_uuid}
                      onClick={setSelectedBatch}
                    />
                  ))}
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
                    disabled={!selectedBatch}
                    className="px-4 py-2 sm:px-8 sm:py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <span>Continue</span>
                    <AlertTriangle className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 2: Warning & Consequences */}
        {step === 2 && selectedBatch && (
          <div className="bg-white rounded-2xl p-3 sm:p-6 shadow-sm border border-gray-100">
            {(() => {
              const withdrawalInfo = getEmergencyWithdrawalInfo(selectedBatch);
              return (
                <>
                  <div className="text-center mb-8">
                    <div className={`p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center ${
                      withdrawalInfo.isEmergency ? 'bg-red-100' : 'bg-yellow-100'
                    }`}>
                      {withdrawalInfo.isEmergency ? (
                        <AlertTriangle className="h-8 w-8 text-red-600" />
                      ) : (
                        <MinusCircle className="h-8 w-8 text-yellow-600" />
                      )}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {withdrawalInfo.withdrawalType} Consequences
                    </h2>
                    <p className="text-gray-600">
                      Please carefully review the financial impact before proceeding
                    </p>
                  </div>

                  {/* Critical Warning Banner */}
                  <div className={`p-6 rounded-xl mb-6 ${
                    withdrawalInfo.isEmergency ? 'bg-red-50 border-2 border-red-200' : 'bg-yellow-50 border-2 border-yellow-200'
                  }`}>
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className={`h-6 w-6 mt-0.5 ${
                        withdrawalInfo.isEmergency ? 'text-red-600' : 'text-yellow-600'
                      }`} />
                      <div>
                        <h4 className={`font-bold text-lg ${
                          withdrawalInfo.isEmergency ? 'text-red-900' : 'text-yellow-900'
                        }`}>
                          {withdrawalInfo.isEmergency ? '🚨 EMERGENCY WITHDRAWAL' : '⚠️ EARLY WITHDRAWAL'}
                        </h4>
                        <p className={`text-sm mt-2 ${
                          withdrawalInfo.isEmergency ? 'text-red-800' : 'text-yellow-800'
                        }`}>
                          {withdrawalInfo.isEmergency 
                            ? 'This action will cause significant financial loss. You will forfeit ALL earned interest and pay processing fees. This cannot be undone.'
                            : 'Withdrawing before completion will result in substantial interest penalties. You will lose 80% of your earned interest plus processing fees.'
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Financial Impact Breakdown */}
                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Calculator className="h-6 w-6 text-gray-600" />
                      <h4 className="font-bold text-gray-900">Financial Impact Breakdown</h4>
                    </div>
                    <div className="space-y-4">
                      {/* Current Value */}
                      <div className="bg-blue-50 rounded-lg p-4">
                        <h5 className="font-semibold text-blue-900 mb-3">Current Investment Value</h5>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-blue-700 block">Principal Amount:</span>
                            <div className="font-bold text-blue-900 text-lg">
                              ${withdrawalInfo.principalAmount.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <span className="text-blue-700 block">Interest Earned:</span>
                            <div className="font-bold text-green-600 text-lg">
                              +${selectedBatch.current_interest.toFixed(2)}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-blue-200">
                          <div className="flex justify-between">
                            <span className="text-blue-700 font-medium">Total Current Value:</span>
                            <span className="font-bold text-blue-900 text-lg">
                              ${(withdrawalInfo.principalAmount + selectedBatch.current_interest).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* What You'll Receive */}
                      <div className="bg-red-50 rounded-lg p-4">
                        <h5 className="font-semibold text-red-900 mb-3">What You'll Actually Receive</h5>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-700">Principal Amount:</span>
                            <span className="font-medium">${withdrawalInfo.principalAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">Interest Payment:</span>
                            <span className={`font-medium ${withdrawalInfo.interestAmount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                              ${withdrawalInfo.interestAmount.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">Processing Fee (5%):</span>
                            <span className="font-medium text-red-600">
                              -${withdrawalInfo.chargeAmount.toFixed(2)}
                            </span>
                          </div>
                          <div className="border-t border-red-200 pt-2 flex justify-between">
                            <span className="font-bold text-red-900">Net Amount:</span>
                            <span className="font-bold text-red-900 text-lg">
                              ${withdrawalInfo.netAmount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Total Loss */}
                      <div className="bg-red-100 border-2 border-red-300 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-red-900">Total Financial Loss:</span>
                          <span className="font-bold text-red-900 text-xl">
                            -${withdrawalInfo.totalLoss.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-xs text-red-700 mt-1">
                          This includes forfeited interest and processing fees
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Consequences List */}
                  <div className="mb-6">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                      <Info className="h-5 w-5 mr-2" />
                      Consequences of This Action:
                    </h4>
                    <ul className="space-y-3">
                      {withdrawalInfo.consequences.map((consequence, index) => (
                        <li key={index} className="flex items-start space-x-3 text-sm bg-gray-50 p-3 rounded-lg">
                          <span className="text-red-600 font-bold mt-0.5">•</span>
                          <span>{consequence}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Batch Status */}
                  <div className="bg-blue-50 rounded-xl p-4 mb-6">
                    <h4 className="font-semibold text-blue-900 mb-3">Current Batch Status:</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-blue-700">Videos Watched:</span>
                        <div className="font-medium">{selectedBatch.videos_watched}/60</div>
                      </div>
                      <div>
                        <span className="text-blue-700">Days Remaining:</span>
                        <div className="font-medium">{selectedBatch.days_remaining || 0} days</div>
                      </div>
                      <div>
                        <span className="text-blue-700">Completion:</span>
                        <div className="font-medium">{selectedBatch.completion_percentage?.toFixed(1) || 0}%</div>
                      </div>
                      <div>
                        <span className="text-blue-700">Interest Rate:</span>
                        <div className="font-medium">{selectedBatch.interest_rate}%</div>
                      </div>
                    </div>
                  </div>

                  {/* Acknowledgment Checkbox */}
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={acknowledged}
                        onChange={(e) => setAcknowledged(e.target.checked)}
                        className="mt-1 h-4 w-4 text-red-600 focus:ring-red-500 border-red-300 rounded"
                      />
                      <div>
                        <span className="font-semibold text-red-900 text-sm">
                          I understand and acknowledge the consequences
                        </span>
                        <p className="text-xs text-red-700 mt-1">
                          I understand that this emergency withdrawal will result in a financial loss of ${withdrawalInfo.totalLoss.toFixed(2)}, 
                          including forfeited interest and processing fees. I acknowledge that this action cannot be reversed 
                          and I will not be able to recover the lost interest.
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex justify-between">
                    <button
                      onClick={() => setStep(1)}
                      className="px-3 py-2 sm:px-6 sm:py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                    >
                      Back to Selection
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      disabled={!acknowledged}
                      className={`px-4 py-2 sm:px-8 sm:py-3 rounded-lg font-medium text-white transition-colors flex items-center space-x-2 ${
                        acknowledged
                          ? withdrawalInfo.isEmergency 
                            ? 'bg-red-600 hover:bg-red-700' 
                            : 'bg-yellow-600 hover:bg-yellow-700'
                          : 'bg-gray-300 cursor-not-allowed'
                      }`}
                    >
                      <span>I Accept the Loss</span>
                      <AlertTriangle className="h-4 w-4" />
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* Step 3: Confirm Details & Wallet */}
        {step === 3 && selectedBatch && (
          <div className="bg-white rounded-2xl p-3 sm:p-6 shadow-sm border border-gray-100">
            <div className="text-center mb-8">
              <div className="p-4 bg-blue-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CreditCard className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Withdrawal Details
              </h2>
              <p className="text-gray-600">
                Confirm your wallet address and final withdrawal amount
              </p>
            </div>

            {/* Final Summary */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Final Withdrawal Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 block">Withdrawal Type</span>
                  <div className="font-bold text-gray-900">
                    {getEmergencyWithdrawalInfo(selectedBatch)?.withdrawalType}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600 block">Processing Fee</span>
                  <div className="font-bold text-red-600">
                    -${getEmergencyWithdrawalInfo(selectedBatch)?.chargeAmount.toFixed(2)} (5%)
                  </div>
                </div>
                <div>
                  <span className="text-gray-600 block">Net Amount</span>
                  <div className="font-bold text-xl text-green-600">
                    ${getEmergencyWithdrawalInfo(selectedBatch)?.netAmount.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Wallet Address Input */}
            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <Wallet className="h-6 w-6 text-blue-600" />
                <h3 className="font-semibold text-gray-900">
                  USDT Wallet Address
                </h3>
              </div>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="Enter your USDT wallet address (TRC20 or ERC20)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              />
              <p className="text-gray-600 text-sm mt-2">
                ⚠️ <strong>Important:</strong> Double-check this address carefully. Cryptocurrency transactions cannot be reversed. 
                We support both TRC20 and ERC20 USDT addresses.
              </p>
            </div>

            {/* Important Notes */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <Info className="h-5 w-5 text-yellow-600" />
                <span className="font-semibold text-yellow-900 text-sm">
                  Important Reminders
                </span>
              </div>
              <ul className="text-xs text-yellow-800 space-y-1">
                <li>• Emergency withdrawals are processed within 1-3 business days</li>
                <li>• You will receive email confirmation once processed</li>
                <li>• This action terminates your investment batch permanently</li>
                <li>• Lost interest cannot be recovered even if you reinvest</li>
              </ul>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(2)}
                className="px-3 py-2 sm:px-6 sm:py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Back to Warning
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={!walletAddress.trim()}
                className="px-4 py-2 sm:px-8 sm:py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <span>Proceed to Verification</span>
                <Shield className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Request OTP */}
        {step === 4 && (
          <div className="bg-white rounded-2xl p-3 sm:p-6 shadow-sm border border-gray-100">
            <div className="text-center mb-8">
              <div className="p-4 bg-orange-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Security Verification
              </h2>
              <p className="text-gray-600">
                We'll send a verification code to secure this emergency withdrawal
              </p>
            </div>

            <div className="bg-orange-50 rounded-xl p-6 mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <Smartphone className="h-6 w-6 text-orange-600" />
                <h3 className="font-semibold text-gray-900">
                  Email Verification Required
                </h3>
              </div>
              <p className="text-gray-600 text-sm">
                Due to the high-risk nature of emergency withdrawals, we require additional verification. 
                A 6-digit code will be sent to your registered email address.
              </p>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(3)}
                className="px-3 py-2 sm:px-6 sm:py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Back to Details
              </button>
              <button
                onClick={requestOTP}
                disabled={loading}
                className="px-4 py-2 sm:px-8 sm:py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    <span>Sending Code...</span>
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

        {/* Step 5: Enter OTP */}
        {step === 5 && (
          <div className="bg-white rounded-2xl p-3 sm:p-6 shadow-sm border border-gray-100">
            <div className="text-center mb-8">
              <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Smartphone className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Enter Verification Code
              </h2>
              <p className="text-gray-600">
                Enter the 6-digit code sent to your email
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
                  disabled={loading || otpTimer > 540}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium disabled:text-gray-400 disabled:cursor-not-allowed flex items-center space-x-1 mx-auto"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Resend Code</span>
                </button>
              </div>
            </div>

            {/* Final Confirmation */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="font-semibold text-red-900 text-sm">
                  Final Confirmation
                </span>
              </div>
              <p className="text-xs text-red-700">
                By submitting this code, you confirm the emergency withdrawal of ${getEmergencyWithdrawalInfo(selectedBatch)?.netAmount.toFixed(2)} 
                to wallet address: <span className="font-mono">{walletAddress}</span>
              </p>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep(4)}
                className="px-3 py-2 sm:px-6 sm:py-3 text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Back
              </button>
              <button
                onClick={submitEmergencyWithdrawal}
                disabled={loading || !otp || otp.length < 4}
                className="px-4 py-2 sm:px-8 sm:py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Emergency Withdrawal</span>
                    <AlertTriangle className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 6: Success */}
        {step === 6 && withdrawalData && (
          <div className="bg-white rounded-2xl p-3 sm:p-6 shadow-sm border border-gray-100">
            <div className="text-center mb-8">
              <div className="p-4 bg-green-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Emergency Withdrawal Submitted
              </h2>
              <p className="text-gray-600">
                Your emergency withdrawal request has been submitted for processing
              </p>
            </div>

            <div className="bg-green-50 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">
                Withdrawal Request Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 block">Request ID</span>
                  <div className="font-mono text-gray-900">
                    {withdrawalData.id || "N/A"}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600 block">Net Amount</span>
                  <div className="font-bold text-green-600 text-lg">
                    ${withdrawalData.amount?.toFixed(2) || "N/A"}
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
                <div className="md:col-span-2">
                  <span className="text-gray-600 block">Wallet Address</span>
                  <div className="font-mono text-xs break-all text-gray-900">
                    {walletAddress}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <div className="flex items-center space-x-3 mb-3">
                <Info className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Processing Information</h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Emergency withdrawals are processed within 1-3 business days</li>
                <li>• You'll receive email updates on the processing status</li>
                <li>• Funds will be sent to your provided USDT wallet address</li>
                <li>• Your investment batch has been permanently terminated</li>
                <li>• You can track the status in your withdrawal history</li>
              </ul>
            </div>

            {/* Summary of Loss */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <span className="font-semibold text-red-900 text-sm">
                  Financial Impact Summary
                </span>
              </div>
              <div className="text-xs text-red-700">
                <p className="mb-1">
                  <strong>Total Loss:</strong> ${getEmergencyWithdrawalInfo(selectedBatch)?.totalLoss.toFixed(2)}
                </p>
                <p>
                  This includes ${(selectedBatch.current_interest - (getEmergencyWithdrawalInfo(selectedBatch)?.interestAmount || 0)).toFixed(2)} in forfeited interest 
                  and ${getEmergencyWithdrawalInfo(selectedBatch)?.chargeAmount.toFixed(2)} in processing fees.
                </p>
              </div>
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