import { useState, useEffect } from "react";
import {
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Lock,
  DollarSign,
  Calendar,
  Target,
  Play,
  Gift,
  Copy,
  X,
  Upload,
  ImageIcon,
  Sparkles,
  Shield,
  Users,
  Star,
  Zap,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { BASEURL } from "../utils/utils";
import { toast } from "react-toastify";
import db from "../services/cocobase";
export const MIN_INVESTMENT_AMOUNT = 15;
// Mock implementations for missing dependencies
const WALLET_BOOK = {
  USDT_BRP20: {
    label: "USDT",
    network: "BRP20",
    note: "Send only USDT via BRP20. Do not send other tokens.",
  },
};

export const CreateBatch = () => {
  const [batchCreationActive] = useState(true);
  const [creating, setCreating] = useState(false);
  const [address, setAddress] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState(
    MIN_INVESTMENT_AMOUNT
  );
  const [isSliding, setIsSliding] = useState(false);

  // Using mock implementations
  const { user, authFetch } = useAuth();
  const navigate = useNavigate();

  // Payment flow state
  const [showPayModal, setShowPayModal] = useState(false);
  const [showProofModal, setShowProofModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("USDT_BRP20");

  // Submit-proof form state
  const [proofImage, setProofImage] = useState(null);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Calculations
  const totalProfit = investmentAmount * 0.5;
  const dailyProfit = totalProfit / 30;
  const totalReturn = investmentAmount + totalProfit;
  const videosRequired = 60;

  useEffect(() => {
    db.getDocument("settings", "5f4ef303-3624-409e-ae3d-1e3d892ed180").then(
      (d) => {
        setAddress(d.data.wallet);
      }
    );
  }, []);

  const handleSliderChange = (e) => {
    setIsSliding(true);
    setInvestmentAmount(Number.parseInt(e.target.value));
    setTimeout(() => setIsSliding(false), 200);
  };

  const handleInputChange = (e) => {
    const value = Math.max(
      MIN_INVESTMENT_AMOUNT,
      Number.parseInt(e.target.value) || MIN_INVESTMENT_AMOUNT
    );
    setInvestmentAmount(value);
  };

  const handleLoginRedirect = () => navigate("/login");

  const openPaymentDetails = () => {
    if (!user) return handleLoginRedirect();
    setShowPayModal(true);
  };

  const proceedToProof = () => {
    setShowPayModal(false);
    setShowProofModal(true);
  };

  const reopenProof = () => {
    setShowProofModal(true);
  };

  const submitPaymentProof = async () => {
    if (!proofImage) {
      toast.error("Please upload a proof image (required).");
      return;
    }
    if (investmentAmount < MIN_INVESTMENT_AMOUNT) {
      toast.error(`Amount must be at least $${MIN_INVESTMENT_AMOUNT}.`);
      return;
    }

    try {
      setSubmitting(true);

      const form = new FormData();
      form.append("amount", String(investmentAmount));
      form.append("payment_method", WALLET_BOOK[paymentMethod].label);
      form.append("proof_image", proofImage);

      if (referenceNumber.trim())
        form.append("reference_number", referenceNumber.trim());
      if (description.trim()) form.append("description", description.trim());

      const res = await authFetch(`${BASEURL}/api/payments/submit-proof`, {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err?.detail?.[0]?.msg || "Unable to submit payment proof.");
        return;
      }

      const data = await res.json();
      toast.success("Payment proof submitted. Awaiting admin review.");
      setShowProofModal(false);

      setProofImage(null);
      setReferenceNumber("");
      setDescription("");

      console.log("Payment proof response:", data);
    } catch (e) {
      console.error(e);
      toast.error("Network error while submitting payment proof.");
    } finally {
      setSubmitting(false);
    }
  };

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <>
      <section
        className="relative py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen overflow-hidden"
        id="create-batch"
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-300/10 to-indigo-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Enhanced Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-100/80 to-indigo-100/80 backdrop-blur-sm rounded-full border border-blue-200/50 mb-8 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-bold text-blue-700 uppercase tracking-wider">
                Premium Investment Platform
              </span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>

            <h2 className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-900 via-indigo-700 to-purple-700 bg-clip-text text-transparent mb-8 leading-tight">
              Create Your
              <br />
              <span className="relative">
                Investment Batch
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transform scale-x-0 animate-pulse"></div>
              </span>
            </h2>

            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed mb-8">
              Join thousands of investors earning guaranteed returns. Watch just
              2 videos daily for 30 days and earn{" "}
              <span className="font-bold text-green-600">50% profit</span> on
              your investment plus get your original amount back.
            </p>

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                <span>Secure & Protected</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                <span>10,000+ Investors</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>4.9/5 Rating</span>
              </div>
            </div>
          </div>

          {/* Enhanced Main card */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-3xl p-12 shadow-2xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden">
              {/* Card background pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 opacity-50"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-200/30 to-transparent rounded-bl-full"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-indigo-200/30 to-transparent rounded-tr-full"></div>

              <div className="relative z-10">
                {!user ? (
                  // Enhanced Unauthenticated state
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl mb-8 shadow-lg">
                      <Lock className="w-12 h-12 text-gray-500" />
                    </div>
                    <h3 className="text-4xl font-bold text-gray-900 mb-6">
                      Login Required
                    </h3>
                    <p className="text-gray-600 mb-12 text-xl max-w-md mx-auto">
                      Please log in to create investment batches and start your
                      journey to financial growth.
                    </p>

                    <button
                      onClick={handleLoginRedirect}
                      className="w-full max-w-md py-6 px-10 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-4 group mb-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-2 mx-auto"
                    >
                      <Lock className="w-6 h-6" />
                      Login to Continue
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Enhanced Title */}
                    <div className="text-center mb-12">
                      <div className="inline-flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <TrendingUp className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-left">
                          <h3 className="text-3xl font-bold text-gray-900">
                            Select Investment Amount
                          </h3>
                          <p className="text-gray-600">
                            Choose your investment to start earning
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Amount display */}
                    <div className="text-center mb-12">
                      <div className="inline-flex items-center gap-8 p-8 bg-gradient-to-br from-gray-50/80 to-blue-50/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-inner">
                        <div className="text-center">
                          <div className="text-sm text-gray-500 font-medium mb-2">
                            Investment Amount
                          </div>
                          <div
                            className={`text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent transition-all duration-300 ${
                              isSliding ? "scale-110 drop-shadow-lg" : ""
                            }`}
                          >
                            ${investmentAmount.toLocaleString()}
                          </div>
                        </div>

                        <div className="flex flex-col items-center">
                          <ArrowRight className="w-8 h-8 text-gray-400 mb-2" />
                          <div className="text-xs text-gray-500 font-medium">
                            30 Days
                          </div>
                        </div>

                        <div className="text-center">
                          <div className="text-sm text-gray-500 font-medium mb-2">
                            Total Return
                          </div>
                          <div
                            className={`text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent transition-all duration-300 ${
                              isSliding ? "scale-110 drop-shadow-lg" : ""
                            }`}
                          >
                            ${totalReturn.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                      <div className="group text-center p-6 bg-gradient-to-br from-blue-50/80 to-blue-100/80 backdrop-blur-sm rounded-2xl border border-blue-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                          <DollarSign className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-blue-900 mb-1">
                          ${dailyProfit.toFixed(2)}
                        </div>
                        <div className="text-xs text-blue-600 font-medium">
                          Daily Profit
                        </div>
                      </div>

                      <div className="group text-center p-6 bg-gradient-to-br from-green-50/80 to-green-100/80 backdrop-blur-sm rounded-2xl border border-green-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                          <Target className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-green-900 mb-1">
                          ${totalProfit.toFixed(0)}
                        </div>
                        <div className="text-xs text-green-600 font-medium">
                          Total Profit (50%)
                        </div>
                      </div>

                      <div className="group text-center p-6 bg-gradient-to-br from-purple-50/80 to-purple-100/80 backdrop-blur-sm rounded-2xl border border-purple-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                          <Play className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-purple-900 mb-1">
                          {videosRequired}
                        </div>
                        <div className="text-xs text-purple-600 font-medium">
                          Videos (2/day)
                        </div>
                      </div>

                      <div className="group text-center p-6 bg-gradient-to-br from-orange-50/80 to-orange-100/80 backdrop-blur-sm rounded-2xl border border-orange-200/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                          <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-2xl font-bold text-orange-900 mb-1">
                          30
                        </div>
                        <div className="text-xs text-orange-600 font-medium">
                          Days Duration
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Slider */}
                    <div className="mb-10">
                      <label className="block text-gray-700 font-semibold mb-4 text-lg">
                        Investment Amount (${MIN_INVESTMENT_AMOUNT} - $1,000)
                      </label>
                      <div className="relative p-6 bg-gradient-to-r from-gray-50/50 to-blue-50/50 rounded-2xl border border-gray-200/50">
                        <input
                          type="range"
                          min={MIN_INVESTMENT_AMOUNT}
                          max="1000"
                          value={investmentAmount}
                          onChange={handleSliderChange}
                          disabled={!batchCreationActive}
                          className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer custom-slider"
                          style={{
                            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                              ((investmentAmount - MIN_INVESTMENT_AMOUNT) /
                                (1000 - MIN_INVESTMENT_AMOUNT)) *
                              100
                            }%, #e5e7eb ${
                              ((investmentAmount - MIN_INVESTMENT_AMOUNT) /
                                (1000 - MIN_INVESTMENT_AMOUNT)) *
                              100
                            }%, #e5e7eb 100%)`,
                          }}
                        />
                        <div className="flex justify-between text-sm text-gray-500 mt-3 font-medium">
                          <span>${MIN_INVESTMENT_AMOUNT}</span>
                          <span>$500</span>
                          <span>$1,000</span>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Manual Input */}
                    <div className="mb-10">
                      <label className="block text-gray-700 font-semibold mb-3 text-lg">
                        Or enter exact amount
                      </label>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <input
                            type="number"
                            value={investmentAmount}
                            onChange={handleInputChange}
                            min={MIN_INVESTMENT_AMOUNT}
                            className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold bg-white/80 backdrop-blur-sm"
                            placeholder="Enter investment amount"
                            disabled={!batchCreationActive}
                          />
                        </div>
                        <button
                          onClick={() =>
                            setInvestmentAmount(MIN_INVESTMENT_AMOUNT)
                          }
                          className="px-6 py-4 text-sm text-blue-600 border border-blue-200 rounded-xl hover:bg-blue-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                          disabled={!batchCreationActive}
                        >
                          Min (${MIN_INVESTMENT_AMOUNT})
                        </button>
                      </div>
                    </div>

                    {/* Enhanced Info Box */}
                    <div className="mb-10 p-6 bg-gradient-to-br from-blue-50/80 to-indigo-50/80 backdrop-blur-sm border border-blue-200/50 rounded-2xl shadow-inner">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                          <Gift className="w-5 h-5 text-white" />
                        </div>
                        <div className="text-sm text-blue-800">
                          <p className="font-semibold mb-3 text-base">
                            Your investment batch will include:
                          </p>
                          <ul className="space-y-2 text-blue-700">
                            <li className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                              ${investmentAmount.toLocaleString()} investment
                              amount
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                              ${dailyProfit.toFixed(2)} daily profit for 30 days
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                              Just 2 videos to watch each day
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                              ${totalProfit.toFixed(0)} total profit (50%
                              return)
                            </li>
                            <li className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                              ${totalReturn.toLocaleString()} total payout
                              (investment + profit)
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Action Button */}
                    <div className="text-center space-y-4">
                      <button
                        disabled={creating}
                        className="w-full py-6 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center gap-3 group shadow-xl hover:shadow-2xl mb-4 transform hover:-translate-y-1 text-lg relative overflow-hidden"
                        onClick={openPaymentDetails}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-indigo-400/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        {creating ? (
                          <>
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                            Preparing Your Batch...
                          </>
                        ) : (
                          <>
                            <Zap className="w-6 h-6" />
                            Create ${investmentAmount.toLocaleString()}{" "}
                            Investment Batch
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                          </>
                        )}
                      </button>

                      <p className="text-sm text-gray-500  flex items-center justify-center gap-2">
                        <Shield className="w-4 h-4" />
                        Secure processing • Submit proof for admin review •
                        Funds appear after approval
                      </p>
                    </div>
                  </>
                )}

                {/* Enhanced Footer Stats */}
                <div className="mt-12 pt-8 border-t border-gray-200/50">
                  <div className="grid grid-cols-3 gap-6 text-center">
                    <div className="group">
                      <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                        50%
                      </div>
                      <div className="text-sm text-gray-500 font-medium">
                        Total Profit
                      </div>
                    </div>
                    <div className="group">
                      <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                        ${MIN_INVESTMENT_AMOUNT}
                      </div>
                      <div className="text-sm text-gray-500 font-medium">
                        Minimum Investment
                      </div>
                    </div>
                    <div className="group">
                      <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                        24/7
                      </div>
                      <div className="text-sm text-gray-500 font-medium">
                        Support Available
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Payment Modal */}
      {showPayModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
            onClick={() => setShowPayModal(false)}
          />
          <div className="relative w-full max-w-2xl mx-auto bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-hidden flex flex-col">
            {/* Fixed header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Payment Details
                </h3>
              </div>
              <button
                className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                onClick={() => setShowPayModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Payment Method Selection */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-3 block">
                  Payment Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod("USDT_BRP20")}
                    className={`p-4 rounded-2xl border text-left transition-all duration-200 ${
                      paymentMethod === "USDT_BRP20"
                        ? "border-blue-500 ring-2 ring-blue-200 bg-blue-50 shadow-lg"
                        : "border-slate-200 hover:bg-slate-50 hover:shadow-md"
                    }`}
                  >
                    <div className="font-bold text-lg">USDT</div>
                    <div className="text-sm text-slate-500">Network: BRP20</div>
                    <div className="text-xs text-green-600 mt-1">
                      ✓ Available
                    </div>
                  </button>
                </div>
              </div>

              {/* Enhanced Wallet Card */}
              <div className="p-4 bg-gradient-to-br from-slate-50/80 to-blue-50/80 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-inner">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm text-slate-600 mb-1">
                      Amount to pay
                    </div>
                    <div className="text-3xl font-extrabold text-slate-900">
                      ${investmentAmount.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-600 mb-1">Method</div>
                    <div className="font-bold text-lg">
                      {WALLET_BOOK[paymentMethod].label} •{" "}
                      {WALLET_BOOK[paymentMethod].network}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200/50 bg-white/80 backdrop-blur-sm p-4 shadow-sm">
                  <div className="text-xs text-slate-500 mb-2 font-medium">
                    Wallet Address
                  </div>
                  <div className="flex items-center gap-3">
                    <code className="text-sm font-mono break-all bg-slate-100 px-3 py-2 rounded-lg flex-1">
                      {address == null ? "loading..." : address}
                    </code>
                    <button
                      onClick={() => copy(WALLET_BOOK[paymentMethod].address)}
                      className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors font-medium"
                    >
                      <Copy className="w-4 h-4" /> Copy
                    </button>
                  </div>
                </div>

                {WALLET_BOOK[paymentMethod].note && (
                  <div className="mt-3 p-3 bg-blue-100/50 rounded-lg border border-blue-200/50">
                    <p className="text-sm text-blue-700 font-medium">
                      {WALLET_BOOK[paymentMethod].note}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Fixed footer with buttons */}
            <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-gray-100 flex-shrink-0">
              <button
                onClick={() => setShowPayModal(false)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={proceedToProof}
                className="w-full sm:w-auto flex-1 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                I've Paid — Submit Proof
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Proof Modal */}
      {showProofModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
            onClick={() => setShowProofModal(false)}
          />
          <div className="relative w-full max-w-2xl mx-auto bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-hidden flex flex-col">
            {/* Fixed header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Submit Payment Proof
                </h3>
              </div>
              <button
                className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                onClick={() => setShowProofModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Amount and Method */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    Amount (USD)
                  </label>
                  <input
                    type="number"
                    min={MIN_INVESTMENT_AMOUNT}
                    value={investmentAmount}
                    onChange={(e) =>
                      setInvestmentAmount(
                        Math.max(MIN_INVESTMENT_AMOUNT, Number(e.target.value))
                      )
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white/80 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    Payment Method
                  </label>
                  <input
                    value={`${WALLET_BOOK[paymentMethod].label} (${WALLET_BOOK[paymentMethod].network})`}
                    readOnly
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-700"
                  />
                </div>
              </div>

              {/* Reference and Description */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    Reference Number{" "}
                    <span className="text-slate-400 font-normal">
                      (optional)
                    </span>
                  </label>
                  <input
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    placeholder="e.g. Transaction ID or Bank Reference"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white/80 backdrop-blur-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-700 mb-2 block">
                    Description{" "}
                    <span className="text-slate-400 font-normal">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Any additional information about this payment..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-white/80 backdrop-blur-sm"
                  />
                </div>
              </div>

              {/* Enhanced File Upload */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-3 block">
                  Proof Image <span className="text-red-500">*</span>
                </label>
                <div className="mt-2">
                  <label className="w-full flex flex-col items-center justify-center px-6 py-6 border-2 border-dashed border-slate-300 rounded-2xl hover:bg-slate-50 cursor-pointer transition-all duration-200 bg-white/50 backdrop-blur-sm">
                    <Upload className="w-8 h-8 text-slate-400 mb-3" />
                    <span className="text-sm font-medium text-slate-600">
                      {proofImage
                        ? proofImage.name
                        : "Upload transaction receipt or screenshot"}
                    </span>
                    <span className="text-xs text-slate-400 mt-1">
                      PNG, JPG, or PDF up to 10MB
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        setProofImage(e.target.files?.[0] || null)
                      }
                    />
                  </label>

                  {/* Enhanced Preview */}
                  {proofImage && (
                    <div className="mt-4 rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                      <img
                        src={
                          URL.createObjectURL(proofImage) || "/placeholder.svg"
                        }
                        alt="Proof preview"
                        className="w-full h-48 object-contain bg-slate-50"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Fixed footer with buttons */}
            <div className="flex flex-col sm:flex-row gap-3 p-6 border-t border-gray-100 flex-shrink-0">
              <button
                onClick={() => setShowProofModal(false)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors font-medium"
              >
                Close
              </button>
              <button
                onClick={submitPaymentProof}
                disabled={submitting}
                className="w-full sm:w-auto flex-1 px-8 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:from-green-700 hover:to-emerald-700 disabled:opacity-60 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                {submitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Submitting...
                  </div>
                ) : (
                  "Submit Proof"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-slider::-webkit-slider-thumb {
          appearance: none;
          height: 28px;
          width: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          cursor: pointer;
          border: 4px solid #ffffff;
          box-shadow: 0 4px 12px rgba(59,130,246,0.4);
          transition: all 0.2s ease;
        }
        .custom-slider::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(59,130,246,0.5);
        }
        .custom-slider::-moz-range-thumb {
          height: 28px;
          width: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          cursor: pointer;
          border: 4px solid #ffffff;
          box-shadow: 0 4px 12px rgba(59,130,246,0.4);
          transition: all 0.2s ease;
        }
        .custom-slider::-moz-range-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(59,130,246,0.5);
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes zoom-in {
          from { transform: scale(0.95); }
          to { transform: scale(1); }
        }
        
        .animate-in {
          animation: fade-in 0.3s ease-out, zoom-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default CreateBatch;
