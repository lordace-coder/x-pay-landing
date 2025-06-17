import { useState, useEffect } from "react";
import {
  Coins,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Lock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { BASEURL } from "../utils/utils";

export const Pricing = function () {
  const [tokenSaleActive, setTokenSaleActive] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [availableSupply, setAvailableSupply] = useState(15750);
  const [totalSupply] = useState(50000);
  const [tokenAmount, setTokenAmount] = useState(10);
  const [isSliding, setIsSliding] = useState(false);
  const { user, authFetch } = useAuth();
  const navigate = useNavigate();

  const soldPercentage = ((totalSupply - availableSupply) / totalSupply) * 100;
  const totalCost = tokenAmount;

  const handleSliderChange = (e) => {
    setIsSliding(true);
    setTokenAmount(parseInt(e.target.value));
    setTimeout(() => setIsSliding(false), 200);
  };

  const handleInputChange = (e) => {
    const value = Math.max(10, parseInt(e.target.value) || 10);
    setTokenAmount(value);
  };

  const handleLoginRedirect = () => {
    // Redirect to login pages
    navigate("/login");
  };

  const handleTokensPurchase = async () => {
    setPurchasing(true);
    const res = await authFetch(BASEURL + "/tokens/buy-tokens?id=" + user.id, {
      body: JSON.stringify({ amount: tokenAmount }),
      method: "post",
    });
    console.log(res);

    setPurchasing(false);
  };

  return (
    <>
      <section className="py-20 bg-white" id="pricing">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border mb-6">
              <span className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Token Sale
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Purchase X-Tokens
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Secure your X-Tokens now while supplies last. Each token equals $1
              USD and unlocks access to our premium financial services.
            </p>
          </div>

          {/* Token Purchase Section */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
              {!user ? (
                // Unauthenticated User View
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 mb-6">
                    <Lock className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Login Required
                  </h3>
                  <p className="text-gray-600 mb-8">
                    Please log in to your account to purchase X-Tokens and
                    access our premium financial services.
                  </p>

                  {/* Login Button */}
                  <button
                    onClick={handleLoginRedirect}
                    className="w-full py-4 px-8 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors duration-200 flex items-center justify-center gap-2 group mb-6"
                  >
                    <Lock className="w-5 h-5" />
                    Login to Purchase Tokens
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>

                  {/* Benefits Preview */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">
                          After login, you'll get access to:
                        </p>
                        <ul className="space-y-1 text-blue-700">
                          <li>• Token purchase with flexible amounts</li>
                          <li>• Access to premium financial tools</li>
                          <li>• Priority customer support</li>
                          <li>• Exclusive investment opportunities</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Authenticated User View (Original Content)
                <>
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-4">
                      <TrendingUp className="w-6 h-6 text-teal-600" />
                      <h3 className="text-2xl font-bold text-gray-900">
                        Select Token Amount
                      </h3>
                    </div>
                    <p className="text-gray-600">
                      Choose how many tokens you want to purchase. Minimum
                      purchase is 10 tokens.
                    </p>
                  </div>

                  {/* Token Amount Display */}
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-4 p-6 bg-gray-50 rounded-xl border">
                      <div className="text-center">
                        <div
                          className={`text-5xl font-bold text-teal-600 transition-all duration-200 ${
                            isSliding ? "scale-110" : ""
                          }`}
                        >
                          {tokenAmount}
                        </div>
                        <div className="text-gray-500 font-medium">Tokens</div>
                      </div>
                      <div className="text-gray-300 text-2xl">=</div>
                      <div className="text-center">
                        <div
                          className={`text-5xl font-bold text-gray-900 transition-all duration-200 ${
                            isSliding ? "scale-110" : ""
                          }`}
                        >
                          ${totalCost}
                        </div>
                        <div className="text-gray-500 font-medium">USD</div>
                      </div>
                    </div>
                  </div>

                  {/* Slider */}
                  <div className="mb-8">
                    <label className="block text-gray-700 font-medium mb-4">
                      Token Amount (10 - 1000)
                    </label>
                    <div className="relative">
                      <input
                        type="range"
                        min="10"
                        max="1000"
                        value={tokenAmount}
                        onChange={handleSliderChange}
                        disabled={!tokenSaleActive}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer custom-slider"
                        style={{
                          background: `linear-gradient(to right, #0f766e 0%, #0f766e ${
                            ((tokenAmount - 10) / (1000 - 10)) * 100
                          }%, #e5e7eb ${
                            ((tokenAmount - 10) / (1000 - 10)) * 100
                          }%, #e5e7eb 100%)`,
                        }}
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-2">
                        <span>10</span>
                        <span>500</span>
                        <span>1000</span>
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
                          value={tokenAmount}
                          onChange={handleInputChange}
                          min="10"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent"
                          placeholder="Enter token amount"
                          disabled={!tokenSaleActive}
                        />
                      </div>
                      <button
                        onClick={() => setTokenAmount(10)}
                        className="px-4 py-3 text-sm text-teal-600 border border-teal-200 rounded-lg hover:bg-teal-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!tokenSaleActive}
                      >
                        Min (10)
                      </button>
                    </div>
                  </div>

                  {/* Purchase Info */}
                  <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">What you'll get:</p>
                        <ul className="space-y-1 text-blue-700">
                          <li>• {tokenAmount} X-Tokens in your wallet</li>
                          <li>• Access to premium financial tools</li>
                          <li>• Priority customer support</li>
                          <li>• Exclusive investment opportunities</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Purchase Button */}
                  <div className="text-center">
                    {tokenSaleActive ? (
                      <button
                        disabled={purchasing}
                        className="w-full py-4 px-8 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors duration-200 flex items-center justify-center gap-2 group"
                        onClick={handleTokensPurchase}
                      >
                        Purchase {tokenAmount} Tokens for ${totalCost}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                    ) : (
                      <div className="w-full py-4 px-8 bg-gray-300 text-gray-500 font-semibold rounded-lg cursor-not-allowed flex items-center justify-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        Token Sale Has Ended
                      </div>
                    )}

                    <p className="text-xs text-gray-500 mt-3">
                      Secure payment • Instant token delivery • 1 Token = $1 USD
                    </p>
                  </div>
                </>
              )}

              {/* Additional Info - Always visible */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">1:1</div>
                    <div className="text-sm text-gray-500">Token to Dollar</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">10</div>
                    <div className="text-sm text-gray-500">
                      Minimum Purchase
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">24/7</div>
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
          background: #0f766e;
          cursor: pointer;
          border: 3px solid #ffffff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }
        .custom-slider::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #0f766e;
          cursor: pointer;
          border: 3px solid #ffffff;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </>
  );
};

export default Pricing;
