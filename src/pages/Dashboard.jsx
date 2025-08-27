import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  DollarSign,
  Play,
  Eye,
  Bell,
  LogOut,
  User,
  Wallet,
  Check,
  Gift,
  ChevronRight,
  Video,
  RefreshCw,
  User2Icon,
  Copy,
  UsersIcon,
  Plus,
  Package,
  Clock,
  Target,
  Calendar,
  BarChart3,
  Activity,
  Star,
  Trophy,
  Sparkles,
  Download,
  PartyPopper,
  CheckCircle,
  Banknote,
  AlertTriangle,
  X,
  Info,
  MinusCircle,
  Zap,
  ExternalLink,
  Upload,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useDashboardContext } from "../context/DashboardContext";
import { useNavigate } from "react-router-dom";
import WatchEarnComponent from "../components/WatchAndEarn";
import RecentActivity from "../components/RecentActivity";
import { BASEURL } from "../utils/utils";
import ReferralModal from "../components/RefModal";
import { toast } from "react-toastify";
import BannerAdSlider from "../components/BannerAdSlider";

export default function XPayDashboard() {
  const [videosWatched, setVideosWatched] = useState({});
  const [batchData, setBatchData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [batchLoading, setBatchLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showRef, setShowRef] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const { user: userData, logout, authFetch, verificationStatus } = useAuth();

  const { getDashboardData, setDashboardData } = useDashboardContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!verificationStatus) return;

    console.log("Verification Status:", verificationStatus);

    if (verificationStatus.email_verified === false) {
      toast.info("Please verify your email to continue.", { autoClose: 1500 });
      setTimeout(() => {
        navigate("/verify_email");
      }, 2000);
      return;
    }

    if (verificationStatus.phone_verified === false) {
      toast.info("Please verify your phone number to continue.", {
        autoClose: 1500,
      });
      setTimeout(() => {
        navigate("/verify_phone");
      }, 2000);
      return;
    }
  }, [verificationStatus, navigate]);

  const refUrl = window.location.origin + "/register?ref=" + userData.id;

  // Enhanced copy functionality
  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(refUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    } catch (err) {
      console.error("Failed to copy: ", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = refUrl;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 3000);
      } catch (fallbackErr) {
        console.error("Fallback copy failed: ", fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  useEffect(() => {
    // Initialize videos data on mount
    const initializeData = async () => {
      const cachedVideosData = getDashboardData("videosWatched");
      const cachedBatchData = getDashboardData("batchData");

      if (cachedVideosData) {
        setVideosWatched(cachedVideosData);
      } else {
        await getVideosLeft();
      }

      if (cachedBatchData) {
        setBatchData(cachedBatchData);
      } else {
        await getBatchData();
      }
    };

    initializeData();
  }, []); // Empty dependency array to run only on mount

  // Separate useEffect for caching user data
  useEffect(() => {
    if (userData) {
      setDashboardData("userData", userData);
      getReferralData();
    }
  }, [userData]); // Only depend on userData

  // Function to fetch batch data
  const getBatchData = async (forceRefresh = false) => {
    try {
      setBatchLoading(true);

      // If not forcing refresh, check cache first
      if (!forceRefresh) {
        const cachedData = getDashboardData("batchData");
        const lastFetch = getDashboardData("batchLastFetch");
        const now = Date.now();

        // Use cached data if it's less than 5 minutes old
        if (cachedData && lastFetch && now - lastFetch < 5 * 60 * 1000) {
          setBatchData(cachedData);
          setBatchLoading(false);
          return;
        }
      }

      const res = await authFetch(BASEURL + "/investment/batches");
      const data = await res.json();

      setBatchData(data);

      // Cache the data with timestamp
      setDashboardData("batchData", data);
      setDashboardData("batchLastFetch", Date.now());
    } catch (err) {
      console.error("Failed to fetch batch data:", err);
      toast.error("Failed to fetch investment data. Please try again later.");
    } finally {
      setBatchLoading(false);
    }
  };

  const getReferralData = async () => {
    try {
      setLoading(true);
      const res = await authFetch(BASEURL + "/auth/my-referrals");
      const data = await res.json();
      setDashboardData("referralData", data);
    } catch (err) {
      toast.error("Failed to fetch referral data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const getVideosLeft = async (forceRefresh = false) => {
    try {
      setLoading(true);

      // If not forcing refresh, check cache first
      if (!forceRefresh) {
        const cachedData = getDashboardData("videosWatched");
        const lastFetch = getDashboardData("videosLastFetch");
        const now = Date.now();

        // Use cached data if it's less than 5 minutes old
        if (cachedData && lastFetch && now - lastFetch < 5 * 60 * 1000) {
          setVideosWatched(cachedData);
          setLoading(false);
          return;
        }
      }

      const res = await authFetch(BASEURL + "/videos/remaining");
      const data = await res.json();

      setVideosWatched(data);

      // Cache the data with timestamp
      setDashboardData("videosWatched", data);
      setDashboardData("videosLastFetch", Date.now());
    } catch (err) {
      console.error("Failed to fetch videos left:", err);
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh all dashboard data
  const refreshDashboardData = async () => {
    await Promise.all([getVideosLeft(true), getBatchData(true)]);
  };

  const showReferalModal = () => {
    setShowRef(true);
  };
  // Component for active batch card
  const ActiveBatchCard = ({ batch }) => {
    const canWithdraw = batch.days_remaining <= 15 && batch.videos_watched > 30;
    const isEmergency = batch.days_remaining > 15;

    return (
      <div className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors bg-slate-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="font-medium text-gray-900">
              ${batch.invested_amount.toLocaleString()} Investment
            </span>
            <span className="px-2 py-1 text-xs rounded-full font-medium bg-green-100 text-green-700">
              {batch.status}
            </span>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              ${batch.total_value.toFixed(2)}
            </div>
            <div className="text-xs text-green-600">
              +${batch.current_interest.toFixed(2)} interest
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Progress</span>
            <div className="font-medium">
              {batch.completion_percentage.toFixed(1)}%
            </div>
          </div>
          <div>
            <span className="text-gray-500">Videos</span>
            <div className="font-medium">
              {batch.videos_watched}/{batch.total_videos_required}
            </div>
          </div>
          <div>
            <span className="text-gray-500">Days Left</span>
            <div className="font-medium">{batch.days_remaining}</div>
          </div>
          <div>
            <span className="text-gray-500">Rate</span>
            <div className="font-medium">{batch.interest_rate}%</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[var(--bs-primary)] h-2 rounded-full transition-all duration-300"
              style={{ width: `${batch.completion_percentage}%` }}
            />
          </div>
        </div>

        {/* Withdrawal options for active batches */}
        <div className="mt-4 space-y-2">
          {canWithdraw && (
            <button
              onClick={() => handleWithdrawBatch(batch)}
              className="w-full bg-gradient-to-r  from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-medium py-2 px-4 rounded transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <MinusCircle className="h-4 w-4" />
              <span>Early Withdrawal (20% Interest)</span>
            </button>
          )}

          {isEmergency && (
            <button
              onClick={() => handleWithdrawBatch(batch)}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 px-4 rounded transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Emergency Withdrawal (Principal Only)</span>
            </button>
          )}

          {!canWithdraw && !isEmergency && (
            <div className="text-center py-2 text-sm text-gray-500">
              Complete more videos or wait to unlock withdrawal options
            </div>
          )}
        </div>
      </div>
    );
  };
  // Handle withdrawal navigation - UPDATED to show modal
  const handleWithdrawBatch = (batch) => {
    navigate("/emergency-withdrawal");
  };
  // Component for completed batch card
  const CompletedBatchCard = ({ batch }) => {
    const isWithdrawn = batch.withdrawn;
    console.log(batch, "batch");

    return (
      <div
        className={`relative overflow-hidden border-2 border-transparent rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] ${
          isWithdrawn
            ? "bg-gradient-to-br from-gray-50 via-slate-50 to-gray-100"
            : "bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50"
        }`}
      >
        {/* Background elements */}
        <div
          className={`absolute top-0 right-0 w-20 h-20 rounded-full -mr-10 -mt-10 ${
            isWithdrawn
              ? "bg-gradient-to-br from-gray-300/20 to-slate-300/20"
              : "bg-gradient-to-br from-yellow-300/20 to-orange-300/20"
          }`}
        ></div>
        <div
          className={`absolute bottom-0 left-0 w-16 h-16 rounded-full -ml-8 -mb-8 ${
            isWithdrawn
              ? "bg-gradient-to-tr from-slate-300/20 to-gray-300/20"
              : "bg-gradient-to-tr from-amber-300/20 to-yellow-300/20"
          }`}
        ></div>

        {/* Status badge */}
        <div className="absolute top-4 right-4">
          <div
            className={`flex items-center space-x-1 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md ${
              isWithdrawn
                ? "bg-gradient-to-r from-gray-500 to-slate-500"
                : "bg-gradient-to-r from-green-500 to-emerald-500"
            }`}
          >
            {isWithdrawn ? (
              <>
                <CheckCircle className="h-3 w-3" />
                <span>WITHDRAWN</span>
                <Banknote className="h-3 w-3" />
              </>
            ) : (
              <>
                <Trophy className="h-3 w-3" />
                <span>COMPLETED</span>
                <Sparkles className="h-3 w-3" />
              </>
            )}
          </div>
        </div>

        <div className="relative">
          <div className="flex items-center space-x-3 mb-4">
            <div
              className={`p-3 rounded-xl shadow-md ${
                isWithdrawn
                  ? "bg-gradient-to-br from-gray-400 to-slate-400"
                  : "bg-gradient-to-br from-yellow-400 to-orange-400"
              }`}
            >
              {isWithdrawn ? (
                <Wallet className="h-6 w-6 text-white" />
              ) : (
                <Star className="h-6 w-6 text-white" />
              )}
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-lg">
                {isWithdrawn ? "💰 Funds Withdrawn!" : "🎉 Congratulations!"}
              </h4>
              <p className="text-sm text-gray-600">
                {isWithdrawn
                  ? "Investment successfully withdrawn"
                  : "Investment batch completed successfully"}
              </p>
            </div>
          </div>

          <div
            className={`backdrop-blur-sm rounded p-4 mb-4 ${
              isWithdrawn
                ? "bg-white/50 border border-gray-200/50"
                : "bg-white/70 border border-yellow-200/50"
            }`}
          >
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 block">Initial Investment</span>
                <div className="font-bold text-gray-900 text-lg">
                  ${batch.invested_amount.toLocaleString()}
                </div>
              </div>
              <div>
                <span className="text-gray-600 block">Interest Earned</span>
                <div className="font-bold text-green-600 text-lg flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />$
                  {batch.current_interest.toFixed(2)}
                </div>
              </div>
            </div>

            <div
              className={`mt-3 pt-3 ${
                isWithdrawn
                  ? "border-t border-gray-200/50"
                  : "border-t border-yellow-200/50"
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">
                  {isWithdrawn ? "Amount Withdrawn" : "Total Value"}
                </span>
                <div className="font-bold text-xl text-gray-900 flex items-center">
                  <DollarSign className="h-5 w-5 text-green-600 mr-1" />
                  {batch.total_value.toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs mb-4">
            <div className="text-center bg-white/50 rounded p-2">
              <div className="font-bold text-gray-900">
                {batch.videos_watched}
              </div>
              <div className="text-gray-600">Videos Watched</div>
            </div>
            <div className="text-center bg-white/50 rounded p-2">
              <div className="font-bold text-gray-900">
                {batch.interest_rate}%
              </div>
              <div className="text-gray-600">Interest Rate</div>
            </div>
            <div className="text-center bg-white/50 rounded p-2">
              <div className="font-bold text-gray-900">100%</div>
              <div className="text-gray-600">Complete</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div
              className={`w-full rounded-full h-3 overflow-hidden ${
                isWithdrawn
                  ? "bg-gradient-to-r from-gray-200 to-slate-200"
                  : "bg-gradient-to-r from-yellow-200 to-orange-200"
              }`}
            >
              <div
                className={`h-3 rounded-full w-full shadow-sm ${
                  isWithdrawn
                    ? "bg-gradient-to-r from-gray-400 via-slate-400 to-gray-400"
                    : "bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 animate-pulse"
                }`}
              />
            </div>
          </div>

          {/* Conditional button rendering */}
          {!isWithdrawn ? (
            <button
              onClick={() => handleWithdrawBatch(batch)}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
            >
              <Download className="h-5 w-5" />
              <span>Withdraw ${batch.total_value.toFixed(2)}</span>
              <PartyPopper className="h-5 w-5" />
            </button>
          ) : (
            <div className="w-full bg-gradient-to-r from-gray-400 to-slate-400 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 opacity-75">
              <CheckCircle className="h-5 w-5" />
              <span>Successfully Withdrawn</span>
              <Banknote className="h-5 w-5" />
            </div>
          )}
        </div>
      </div>
    );
  };
  // Proceed with withdrawal
  const proceedWithWithdrawal = () => {
    setShowWithdrawalModal(false);
    navigate(`/withdraw`);
  };

  // Calculate withdrawal consequences
  const getWithdrawalInfo = (batch) => {
    if (!batch) return null;

    const isCompleted =
      batch.status === "completed" || batch.can_request_withdrawal;
    const daysRemaining = batch.days_remaining;
    const videosCompleted = batch.videos_watched > 30;

    let withdrawalType,
      principalAmount,
      interestAmount,
      chargeAmount,
      netAmount,
      consequences;

    const withdrawalCharge = 0.05; // 5%

    if (isCompleted) {
      // Completed withdrawal
      withdrawalType = "Completed Withdrawal";
      principalAmount = batch.invested_amount;
      interestAmount = batch.current_interest;
      const grossAmount = principalAmount + interestAmount;
      chargeAmount = grossAmount * withdrawalCharge;
      netAmount = grossAmount - chargeAmount;
      consequences = [
        "✅ You will receive your full investment plus earned interest",
        "💰 Standard 5% withdrawal processing fee applies",
        "🎉 No penalties for completed investments",
      ];
    } else if (daysRemaining <= 15 && videosCompleted) {
      // Early withdrawal with reduced interest
      withdrawalType = "Early Withdrawal (≤15 days remaining)";
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
      ];
    } else {
      // Emergency withdrawal
      withdrawalType = "Emergency Withdrawal (>15 days remaining)";
      principalAmount = batch.invested_amount;
      interestAmount = 0; // No interest
      chargeAmount = principalAmount * withdrawalCharge;
      netAmount = principalAmount - chargeAmount;
      consequences = [
        "🚨 ALL earned interest will be forfeited",
        `💸 Interest lost: -$${batch.current_interest.toFixed(2)}`,
        "💰 5% withdrawal processing fee applies",
        "⏰ Investment period terminated early",
      ];
    }

    return {
      withdrawalType,
      principalAmount,
      interestAmount,
      chargeAmount,
      netAmount,
      consequences,
      isEmergency: !isCompleted && daysRemaining > 15,
      isEarly: !isCompleted && daysRemaining <= 15,
    };
  };

  // Calculate totals from batch data
  const calculateTotals = () => {
    if (!batchData || !batchData.batches) {
      return {
        totalInvestment: 0,
        totalCurrentInterest: 0,
        totalValue: 0,
        activeBatches: 0,
        completedBatches: 0,
        totalVideosWatched: 0,
        totalVideosRequired: 0,
      };
    }

    return batchData.batches.reduce(
      (totals, batch) => ({
        totalInvestment: totals.totalInvestment + batch.invested_amount,
        totalCurrentInterest:
          totals.totalCurrentInterest + batch.current_interest,
        totalValue: totals.totalValue + batch.total_value,
        activeBatches:
          totals.activeBatches + (batch.status === "active" ? 1 : 0),
        completedBatches:
          totals.completedBatches + (batch.status === "completed" ? 1 : 0),
        totalVideosWatched: totals.totalVideosWatched + batch.videos_watched,
        totalVideosRequired:
          totals.totalVideosRequired + batch.total_videos_required,
      }),
      {
        totalInvestment: 0,
        totalCurrentInterest: 0,
        totalValue: 0,
        activeBatches: 0,
        completedBatches: 0,
        totalVideosWatched: 0,
        totalVideosRequired: 0,
      }
    );
  };

  // Withdrawal Warning Modal
  const WithdrawalModal = () => {
    if (!selectedBatch || !showWithdrawalModal) return null;

    const withdrawalInfo = getWithdrawalInfo(selectedBatch);
    if (!withdrawalInfo) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Progress bar */}
            <div className="mt-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-[var(--bs-primary)] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${selectedBatch.completion_percentage}%` }}
                />
              </div>
            </div>

            {/* Withdrawal options for active batches */}
            <div className="mt-4 space-y-2">
              {withdrawalInfo.isEarly && (
                <button
                  onClick={proceedWithWithdrawal}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-medium py-2 px-4 rounded transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <MinusCircle className="h-4 w-4" />
                  <span>Early Withdrawal (20% Interest)</span>
                </button>
              )}

              {withdrawalInfo.isEmergency && (
                <button
                  onClick={() => {
                    navigate("/emergency-withdrawal");
                  }}
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 px-4 rounded transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <AlertTriangle className="h-4 w-4" />
                  <span>Emergency Withdrawal (Principal Only)</span>
                </button>
              )}

              {!withdrawalInfo.isEarly && !withdrawalInfo.isEmergency && (
                <button
                  onClick={proceedWithWithdrawal}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium py-2 px-4 rounded transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Complete Withdrawal</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const totals = calculateTotals();

  return (
    <div className="min-h-screen main_img_bg lg:pl-16 text-[15px] sm:text-base">
      {/* Header */}
      <header className="trans_2 border-b border-gray-200 pt-4 sm:pt-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center h-auto sm:h-16 gap-2 sm:gap-0">
            <div className="flex items-center">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                Dashboard
              </h1>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Refresh button */}
              <button
                onClick={refreshDashboardData}
                disabled={loading || batchLoading}
                className="p-2 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100 transition-colors disabled:opacity-50"
                title="Refresh dashboard data"
              >
                <RefreshCw
                  className={`h-5 w-5 ${
                    loading || batchLoading ? "animate-spin" : ""
                  }`}
                />
              </button>

              <button
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => navigate("/notifications")}
              >
                <Bell className="h-5 w-5" />
              </button>
              <button
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={logout}
              >
                <LogOut className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {userData.full_name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-1 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Welcome */}
        <div className="mb-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
          <BannerAdSlider />

          {/* Referral Link Section */}
          {/* <div className="bg-white w-full md:w-[43%] shadow-lg border hover:shadow-xl transition-all duration-300 hover:border-teal-200 rounded-2xl px-3 py-3 sm:px-4 sm:py-4 ">
            <h5 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div>
              Your Referral Link
            </h5>
            <div className=" bg-gray-50 rounded-lg px-2 sm:px-3 py-2 border border-teal-300">
              <p className="text-xs sm:text-sm text-gray-600 font-mono break-all">
                {refUrl}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between mt-3 sm:mt-4 gap-2 sm:gap-0">
              <button
                onClick={copyReferralLink}
                disabled={copySuccess}
                className="px-3 sm:px-4 py-1 rounded font-medium transition-all flex items-center space-x-2 min-w-[90px] justify-center bg-[var(--bs-primary)] text-white hover:bg-[var(--bs-primary-hover)] w-full sm:w-auto"
              >
                {copySuccess ? <Check size={16} /> : <Copy size={16} />}
                <span>{copySuccess ? "Copied!" : "Copy"}</span>
              </button>

              <button
                onClick={showReferalModal}
                className="px-3 sm:px-4 mx-0 sm:mx-1 py-1 mt-2 sm:mt-0 rounded font-medium transition-all flex items-center min-w-[90px] justify-center bg-[var(--bs-primary)] text-white hover:bg-[var(--bs-primary-hover)] w-full sm:w-auto"
              >
                <UsersIcon className="" /> View Referrals
              </button>
            </div>
            {/* </div> */}
          {/* <p className="text-[11px] sm:text-xs text-gray-500 mt-2 sm:mt-3">
              Share this link with friends and earn 5% commission on their
              investments.
              {navigator.share
                ? " Use the share button to send via your preferred app."
                : " Copy the link to share it manually."}
            </p>
          {/* </div> */}
        </div>
        {/* Investment Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Total Investment */}
          <div className="trans_4 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 relative">
            {batchLoading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-2xl">
                <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
              </div>
            )}
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Wallet className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">Total Investment</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              ${totals.totalInvestment.toLocaleString()}
            </div>
            <p className="text-xs text-blue-600 flex items-center">
              <Package className="h-3 w-3 mr-1" />
              {totals.activeBatches} active{" "}
              {totals.activeBatches === 1 ? "batch" : "batches"}
            </p>
          </div>

          {/* Total Interest Earned */}
          <div className="trans_4 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 relative">
            {batchLoading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-2xl">
                <RefreshCw className="h-4 w-4 animate-spin text-green-600" />
              </div>
            )}
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-xl">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-sm text-gray-500">Interest Earned</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              ${totals.totalCurrentInterest.toFixed(2)}
            </div>
            <p className="text-xs text-green-600 flex items-center">
              <Activity className="h-3 w-3 mr-1" />
              Total value: ${totals.totalValue.toFixed(2)}
            </p>
          </div>

          {/* Today Earnings */}
          <div className="trans_4 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 relative">
            {loading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-2xl">
                <RefreshCw className="h-4 w-4 animate-spin text-purple-600" />
              </div>
            )}
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-xl">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-sm text-gray-500">Today's Earnings</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              ${videosWatched.earned_today ?? 0}
            </div>
            <p className="text-xs text-purple-600 flex items-center">
              <Play className="h-3 w-3 mr-1" />
              From {videosWatched.watched_today ?? 0}{" "}
              {(videosWatched.watched_today ?? 0) === 1 ? "video" : "videos"}{" "}
              watched
            </p>
          </div>

          {/* Videos Progress */}
          <div className="trans_4 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 relative">
            {loading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-2xl">
                <RefreshCw className="h-4 w-4 animate-spin text-orange-600" />
              </div>
            )}
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-100 rounded-xl">
                <Play className="h-6 w-6 text-orange-600" />
              </div>
              <span className="text-sm text-gray-500">Videos Available</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {videosWatched.remaining_today ?? 0}
            </div>
            <p className="text-xs text-orange-600 flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              {videosWatched.watched_today ?? 0} watched today
            </p>
          </div>
        </div>
        {/* Investment Batches Section */}
        <div className="trans_4 rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              Investment Batches
            </h3>
            <button
              onClick={() => navigate("/purchase-tokens")}
              className="px-3 sm:px-4 py-2 bg-[var(--bs-primary)] text-white rounded-lg font-medium hover:bg-[var(--bs-primary-hover)] transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>New Batch</span>
            </button>
          </div>

          {batchLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-500">Loading batches...</span>
            </div>
          ) : batchData && batchData.batches && batchData.batches.length > 0 ? (
            <div className="space-y-4 sm:space-y-6">
              {/* Separate completed and active batches */}
              {batchData.batches
                .filter((batch) => batch.status === "completed")
                .slice(0, 2)
                .map((batch) => (
                  <CompletedBatchCard key={batch.batch_uuid} batch={batch} />
                ))}

              {batchData.batches
                .filter((batch) => batch.status === "active")
                .slice(0, 3)
                .map((batch) => (
                  <ActiveBatchCard key={batch.batch_uuid} batch={batch} />
                ))}

              {batchData.batches.length > 3 && (
                <button
                  onClick={() => navigate("/batches")}
                  className="w-full py-3 text-[var(--bs-primary)] hover:bg-gray-50 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  <span>View All {batchData.total_batches} Batches</span>
                </button>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                No Investment Batches
              </h4>
              <p className="text-gray-500 mb-4">
                Create your first investment batch to start earning interest.
              </p>
              <button
                onClick={() => navigate("/purchase-tokens")}
                className="px-6 py-3 bg-[var(--bs-primary)] text-white rounded-lg font-medium hover:bg-[var(--bs-primary-hover)] transition-colors flex items-center space-x-2 mx-auto"
              >
                <Plus className="h-4 w-4" />
                <span>Create First Batch</span>
              </button>
            </div>
          )}
        </div>
        {/* Main Content Area */}
        <div className="space-y-6 sm:space-y-8">
          {/* Top Row: Watch & Earn + Quick Actions + Recent Activity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Watch and Earn - Keep your current implementation */}
            <WatchEarnComponent
              onRefresh={() => getVideosLeft(true)}
              availableVideos={videosWatched.remaining_today ?? 0}
            />
            {/*  */}
            {/* */}

            {/* Quick Actions */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="trans_4 rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                  <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-orange-500" />
                  <h3 className="text-base sm:text-lg font-bold text-gray-900">
                    Quick Actions
                  </h3>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <button
                    onClick={() => navigate("/withdraw")}
                    className="w-full mb-2 sm:mb-3 flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-green-50 border border-green-200 hover:bg-green-100 transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200">
                      <Download className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-gray-900 text-sm sm:text-base">
                        Make Withdrawal
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-600" />
                  </button>

                  <button
                    onClick={() => navigate("/ads")}
                    className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200">
                      <Upload className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-gray-900 text-sm sm:text-base">
                        Upload Video Ads
                      </div>
                      <div className="text-xs sm:text-sm text-gray-600">
                        Earn extra rewards
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
            </div>

            {/* Recent Activity */}
            <RecentActivity />
            {/* <transa */}
          </div>

          {/* Special Offer Banner - Full Width */}
          <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 rounded-2xl p-4 sm:p-8 text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-2 sm:top-4 right-2 sm:right-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 sm:px-4 py-1.5 sm:py-2 flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span className="text-xs sm:text-sm font-medium">
                  Limited Time Offer
                </span>
              </div>
            </div>

            <div className="flex items-center mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-xl flex items-center justify-center mr-2 sm:mr-3">
                <Gift className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <span className="text-xs sm:text-sm font-semibold">
                Special Offer
              </span>
            </div>

            <h4 className="text-xl sm:text-3xl font-bold mb-2 sm:mb-3">
              Earn More Tokens
            </h4>
            <p className="text-sm sm:text-lg opacity-90 mb-4 sm:mb-6 max-w-2xl">
              Purchase extra X-Pay tokens to boost your daily profit and earn
              more.
            </p>

            <button
              className="bg-white text-purple-700 px-6 sm:px-8 py-2 sm:py-3 rounded-xl font-bold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              onClick={() => navigate("/purchase-tokens")}
            >
              Purchase Now
            </button>
          </div>
        </div>
      </div>

      {/* Withdrawal Modal */}
      <WithdrawalModal />
      <ReferralModal isOpen={showRef} onClose={() => setShowRef(false)} />

      <footer className="border-t trans_5 border-gray-200 pt-6 sm:pt-8 pb-4 sm:pb-6 mt-8 sm:mt-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-semibold text-gray-900 text-sm sm:text-base">
                Investment Platform
              </div>
              <div className="text-xs sm:text-sm text-gray-500">
                © 2024 All rights reserved
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 sm:gap-8">
            <a
              href="#"
              className="text-xs sm:text-sm text-gray-500 hover:text-teal-600 transition-all duration-200 hover:scale-105 font-medium"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-xs sm:text-sm text-gray-500 hover:text-teal-600 transition-all duration-200 hover:scale-105 font-medium"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="text-xs sm:text-sm text-gray-500 hover:text-teal-600 transition-all duration-200 hover:scale-105 font-medium"
            >
              Support
            </a>
            <a
              href="#"
              className="text-xs sm:text-sm text-gray-500 hover:text-teal-600 transition-all duration-200 hover:scale-105 font-medium"
            >
              Contact
            </a>
          </div>
        </div>

        <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-100 text-center">
          <p className="text-[11px] sm:text-xs text-gray-400">
            Invest responsibly. Past performance does not guarantee future
            results.
          </p>
        </div>
      </footer>
    </div>
  );
}

{
  /* Responsive grid for bottom sections */
}
//   <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
//     {/* Watch & Earn */}
//     <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center gap-3">
//           <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center">
//             <Play className="w-6 h-6 text-white fill-current" />
//           </div>
//           <div>
//             <h3 className="text-lg font-bold text-gray-900">Watch & Earn</h3>
//           </div>
//         </div>
//         <div className="flex items-center gap-2">
//           <span className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">
//             2 Available
//           </span>
//           <Star className="w-4 h-4 text-orange-500 fill-current" />
//           <span className="text-orange-500 text-sm font-medium">Premium</span>
//         </div>
//       </div>

//       <div className="text-center mb-6">
//         <div className="relative inline-flex items-center justify-center mb-4">
//           <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
//             <span className="text-3xl font-bold text-white">2</span>
//           </div>
//           <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
//             <span className="text-white text-xs font-bold">!</span>
//           </div>
//         </div>

//         <h4 className="text-lg font-bold text-gray-900 mb-2">Ready to Watch</h4>
//         <p className="text-sm text-gray-600 mb-4">Earn up to $2.50 per video</p>

//         <div className="bg-blue-50 rounded-xl p-4 mb-6">
//           <div className="text-sm text-gray-600 mb-1">Potential Earnings</div>
//           <div className="text-2xl font-bold text-blue-600">$5.00</div>
//         </div>

//         <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105 transform">
//           <Play className="w-5 h-5 fill-current" />
//           Start Watching
//         </button>
//       </div>
//     </div>

//     {/* Special Offer */}
//     <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-pink-600 rounded-2xl p-6 text-white relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
//       <div className="absolute top-4 right-4">
//         <div className="bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">50% OFF</div>
//       </div>

//       <div className="flex items-center gap-2 mb-4">
//         <Gift className="w-6 h-6" />
//         <span className="text-sm font-medium">Special Offer</span>
//       </div>
//       <div className="text-xs opacity-90 mb-4">Limited Time</div>

//       <div className="flex items-center gap-2 mb-4">
//         <Zap className="w-6 h-6" />
//         <h3 className="text-2xl font-bold">Boost Your Earnings</h3>
//       </div>

//       <p className="text-sm opacity-90 mb-6 leading-relaxed">
//         Get X-Pay premium tokens and unlock higher daily profits with exclusive video content.
//       </p>

//       <div className="mb-6">
//         <div className="flex items-center gap-2 mb-2">
//           <span className="text-sm opacity-75">Regular Price:</span>
//           <span className="text-lg line-through opacity-75">$20.00</span>
//         </div>
//         <div className="flex items-center gap-2">
//           <span className="text-sm opacity-75">Your Price:</span>
//           <span className="text-3xl font-bold text-yellow-400">$10.00</span>
//         </div>
//       </div>

//       <button className="w-full bg-white text-purple-600 font-bold py-3 px-6 rounded-xl hover:bg-gray-100 transition-all duration-200 flex items-center justify-center gap-2 hover:scale-105 transform">
//         <Gift className="w-5 h-5" />
//         Purchase Now
//       </button>
//     </div>

//     {/* Quick Actions & Recent Activity */}
//     <div className="space-y-6">
//       {/* Quick Actions */}
//       <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
//         <div className="flex items-center gap-3 mb-6">
//           <Zap className="w-6 h-6 text-orange-500" />
//           <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
//         </div>

//         <div className="space-y-3">
//           <button className="w-full flex items-center gap-4 p-4 rounded-xl bg-green-50 border border-green-200 hover:bg-green-100 transition-all duration-200 group">
//             <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200">
//               <Download className="w-5 h-5 text-green-600" />
//             </div>
//             <div className="flex-1 text-left">
//               <div className="font-semibold text-gray-900">Make Withdrawal</div>
//               <div className="text-sm text-gray-600">Available: $180.00</div>
//             </div>
//             <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-600" />
//           </button>

//           <button className="w-full flex items-center gap-4 p-4 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-all duration-200 group">
//             <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200">
//               <Upload className="w-5 h-5 text-blue-600" />
//             </div>
//             <div className="flex-1 text-left">
//               <div className="font-semibold text-gray-900">Upload Video Ads</div>
//               <div className="text-sm text-gray-600">Earn extra rewards</div>
//             </div>
//             <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
//           </button>
//         </div>
//       </div>

//       {/* Recent Activity */}
//       <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-3">
//             <BarChart3 className="w-6 h-6 text-gray-600" />
//             <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
//           </div>
//           <User className="w-5 h-5 text-gray-400" />
//         </div>

//         <div className="text-center py-8">
//           <p className="text-gray-500 text-sm mb-4">No recent transactions</p>
//           <button className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1 mx-auto transition-colors">
//             View All Transactions
//             <ChevronRight className="w-4 h-4" />
//           </button>
//         </div>
//       </div>
//     </div>
//   </div>

// </div>
