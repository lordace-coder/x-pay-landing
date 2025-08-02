import { useState, useEffect } from "react";
import {
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Lock,
  Package,
  DollarSign,
  Calendar,
  Target,
  Play,
  Zap,
  BarChart3,
  Clock,
  Gift,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { BASEURL } from "../utils/utils";
import { toast } from "react-toastify";

export const MIN_INVESTMENT_AMOUNT = 15;

export const CreateBatch = function () {
  const [batchCreationActive, setBatchCreationActive] = useState(true);
  const [creating, setCreating] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState(
    MIN_INVESTMENT_AMOUNT
  );
  const [isSliding, setIsSliding] = useState(false);
  const { user, authFetch } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Investment calculations - 50% total profit over 30 days
  const totalCost = investmentAmount;
  const totalProfit = investmentAmount * 0.5; // 50% profit
  const dailyProfit = totalProfit / 30; // Spread over 30 days
  const totalReturn = investmentAmount + totalProfit; // Original + profit
  const videosRequired = 60; // 2 videos daily for 30 days

  const handleSliderChange = (e) => {
    setIsSliding(true);
    setInvestmentAmount(parseInt(e.target.value));
    setTimeout(() => setIsSliding(false), 200);
  };

  const handleInputChange = (e) => {
    const value = Math.max(
      MIN_INVESTMENT_AMOUNT,
      parseInt(e.target.value) || MIN_INVESTMENT_AMOUNT
    );
    setInvestmentAmount(value);
  };

  const handleLoginRedirect = () => {
    // Redirect to login pages
    navigate("/login");
  };

  const handleBatchCreation = async () => {
    setCreating(true);
    const res = await authFetch(BASEURL + "/tokens/buy-tokens?id=" + user.id, {
      body: JSON.stringify({ amount: investmentAmount }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(res);
    // open url in new tab
    if (res.status === 200) {
      const data = await res.json();
      window.open(data.url, "_blank");
    } else {
      toast.error("Error creating investment batch. Please try again.");
    }

    setCreating(false);
  };

  return (
    <>
      <section
        className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen"
        id="create-batch"
      >
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full border border-blue-200 mb-6 shadow-sm">
              <Package className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-bold text-blue-700 uppercase tracking-wider">
                Investment Batch Creation
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-900 via-indigo-700 to-purple-700 bg-clip-text text-transparent mb-6 leading-tight">
              Create Your Investment Batch
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Start earning guaranteed returns by creating an investment batch.
              Watch just 2 videos daily for 30 days and earn 50% profit on your
              investment plus get your original amount back.
            </p>
          </div>

          {/* Investment Creation Section */}
          <div className="max-w-3xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl p-10 shadow-2xl">
              {!user ? (
                // Unauthenticated User View
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl mb-8">
                    <Lock className="w-10 h-10 text-gray-500" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    Login Required
                  </h3>
                  <p className="text-gray-600 mb-10 text-lg">
                    Please log in to your account to create investment batches
                    and earn 50% profit by watching just 2 videos daily for 30
                    days.
                  </p>

                  {/* Login Button */}
                  <button
                    onClick={handleLoginRedirect}
                    className="w-full py-5 px-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-3 group mb-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                  >
                    <Lock className="w-6 h-6" />
                    Login to Create Investment Batch
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {/* Benefits Preview */}
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                      <div className="text-sm text-blue-800">
                        <p className="font-bold mb-3 text-base">
                          After login, you'll get access to:
                        </p>
                        <ul className="space-y-2 text-blue-700">
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            Watch just 2 videos daily for 30 days
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            Earn 50% profit on your investment
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            Get your original investment back
                          </li>
                          <li className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            Track your progress in real-time
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Authenticated User View (Original Content)
                <>
                  <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <TrendingUp className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900">
                        Select Investment Amount
                      </h3>
                    </div>
                    <p className="text-gray-600 text-lg">
                      Choose your investment amount to create a new batch. Watch
                      2 videos daily for 30 days and earn 50% profit plus your
                      original investment back.
                    </p>
                  </div>

                  {/* Investment Amount Display */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-6 p-6 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200/50 shadow-inner">
                      <div className="text-center">
                        <div
                          className={`text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent transition-all duration-200 ${
                            isSliding ? "scale-110" : ""
                          }`}
                        >
                          ${investmentAmount.toLocaleString()}
                        </div>
                        <div className="text-gray-500 font-medium text-sm mt-1">
                          Investment Amount
                        </div>
                      </div>
                      <div className="text-gray-300 text-2xl">→</div>
                      <div className="text-center">
                        <div
                          className={`text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent transition-all duration-200 ${
                            isSliding ? "scale-110" : ""
                          }`}
                        >
                          ${totalReturn.toLocaleString()}
                        </div>
                        <div className="text-gray-500 font-medium text-sm mt-1">
                          Total Return
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Investment Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200/50">
                      <DollarSign className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <div className="text-lg font-bold text-blue-900">
                        ${dailyProfit.toFixed(2)}
                      </div>
                      <div className="text-xs text-blue-600 font-medium">
                        Daily Profit
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200/50">
                      <Target className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <div className="text-lg font-bold text-green-900">
                        ${totalProfit.toFixed(0)}
                      </div>
                      <div className="text-xs text-green-600 font-medium">
                        Total Profit (50%)
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200/50">
                      <Play className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <div className="text-lg font-bold text-purple-900">
                        {videosRequired}
                      </div>
                      <div className="text-xs text-purple-600 font-medium">
                        Videos (2/day)
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200/50">
                      <Calendar className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                      <div className="text-lg font-bold text-orange-900">
                        30
                      </div>
                      <div className="text-xs text-orange-600 font-medium">
                        Days Duration
                      </div>
                    </div>
                  </div>

                  {/* Slider */}
                  <div className="mb-8">
                    <label className="block text-gray-700 font-medium mb-3">
                      Investment Amount (${MIN_INVESTMENT_AMOUNT} - $1,000)
                    </label>
                    <div className="relative">
                      <input
                        type="range"
                        min={MIN_INVESTMENT_AMOUNT}
                        max="1000"
                        value={investmentAmount}
                        onChange={handleSliderChange}
                        disabled={!batchCreationActive}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer custom-slider"
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
                      <div className="flex justify-between text-sm text-gray-500 mt-2">
                        <span>${MIN_INVESTMENT_AMOUNT}</span>
                        <span>$500</span>
                        <span>$1,000</span>
                      </div>
                    </div>
                  </div>

                  {/* Manual Input */}
                  <div className="mb-8">
                    <label className="block text-gray-700 font-medium mb-2">
                      Or enter exact amount
                    </label>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <input
                          type="number"
                          value={investmentAmount}
                          onChange={handleInputChange}
                          min={MIN_INVESTMENT_AMOUNT}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter investment amount"
                          disabled={!batchCreationActive}
                        />
                      </div>
                      <button
                        onClick={() =>
                          setInvestmentAmount(MIN_INVESTMENT_AMOUNT)
                        }
                        className="px-4 py-3 text-sm text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!batchCreationActive}
                      >
                        Min (${MIN_INVESTMENT_AMOUNT})
                      </button>
                    </div>
                  </div>

                  {/* Investment Info */}
                  <div className="mb-8 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Gift className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-2">
                          Your investment batch will include:
                        </p>
                        <ul className="space-y-1 text-blue-700">
                          <li>
                            • ${investmentAmount.toLocaleString()} investment
                            amount
                          </li>
                          <li>
                            • ${dailyProfit.toFixed(2)} daily profit for 30 days
                          </li>
                          <li>• Just 2 videos to watch each day</li>
                          <li>
                            • ${totalProfit.toFixed(0)} total profit (50%
                            return)
                          </li>
                          <li>
                            • ${totalReturn.toLocaleString()} total payout
                            (investment + profit)
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Create Batch Button */}
                  <div className="text-center">
                    {batchCreationActive ? (
                      <button
                        disabled={creating}
                        className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 flex items-center justify-center gap-2 group shadow-lg"
                        onClick={handleBatchCreation}
                      >
                        {creating ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Creating Investment Batch...
                          </>
                        ) : (
                          <>
                            <Package className="w-5 h-5" />
                            Create ${investmentAmount.toLocaleString()}{" "}
                            Investment Batch
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="w-full py-4 px-6 bg-gray-300 text-gray-500 font-semibold rounded-lg cursor-not-allowed flex items-center justify-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        Investment Batch Creation Temporarily Unavailable
                      </div>
                    )}

                    <p className="text-xs text-gray-500 mt-3">
                      Secure payment processing • Instant batch activation •
                      Start watching 2 videos daily
                    </p>
                  </div>
                </>
              )}

              {/* Additional Info - Always visible */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      50%
                    </div>
                    <div className="text-sm text-gray-500">Total Profit</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      ${MIN_INVESTMENT_AMOUNT}
                    </div>
                    <div className="text-sm text-gray-500">
                      Minimum Investment
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      24/7
                    </div>
                    <div className="text-sm text-gray-500">
                      Support Available
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .custom-slider::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          cursor: pointer;
          border: 3px solid #ffffff;
          box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3);
        }
        .custom-slider::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #6366f1);
          cursor: pointer;
          border: 3px solid #ffffff;
          box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3);
        }
      `}</style>
    </>
  );
};

export default CreateBatch;
