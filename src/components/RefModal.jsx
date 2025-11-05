import React, { useEffect, useState } from "react";
import { Users, X, DollarSign, Share2 } from "lucide-react";
import { useDashboardContext } from "../context/DashboardContext";
import { BASEURL } from "../utils/utils";
import { useAuth } from "../context/AuthContext";

const ReferralModal = ({ isOpen, onClose,data }) => {
  // Default fallback data if none provided
  const copyReferralLink = () => {
    const referralLink = "https://invest.yoursite.com/ref/user123";
    navigator.clipboard.writeText(referralLink);
    // You can add a toast notification here
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };



  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl h-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[var(--bs-primary)] to-[var(--bs-primary-hover)] text-white px-4 sm:px-6 py-4 sm:py-6 relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 sm:top-4 sm:right-4  bg-opacity-20 hover:bg-opacity-30 rounded-full p-1.5 sm:p-2 transition-all duration-200"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <div className="text-center text-white pr-8 sm:pr-0">
            <h4 className="text-lg text-white sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2">
              Your Referral Dashboard
            </h4>
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">
              {data.length}
            </div>
            <p className="text-xs sm:text-sm text-blue-100">Total Referrals</p>
          </div>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
          {data.length > 0 ? (
            <>
              {/* Referrals List */}
              <div className="space-y-3 sm:space-y-4">
                <div className="space-y-2 sm:space-y-3 max-h-64 sm:max-h-80 overflow-y-auto">
                  {data.map((referral) => (
                    <div
                      key={referral.id}
                      className="bg-white border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1 pr-2">
                          <h4 className="font-semibold text-gray-800 text-sm sm:text-base md:text-lg truncate">
                            {referral.full_name}
                          </h4>
                          <p className="text-gray-600 text-xs sm:text-sm truncate">
                            {referral.email}
                          </p>
                        </div>
                        <div className="bg-emerald-50 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                          <Users className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* No Referrals Fallback */
            <div className="text-center py-6 sm:py-8 md:py-12">
              <div className="bg-gray-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Share2 className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-gray-400" />
              </div>

              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-2 sm:mb-3">
                No referrals yet
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-sm mx-auto px-4">
                Start inviting friends and family to join our investment
                platform. You'll earn commission for each successful referral!
              </p>

              <div className="bg-blue-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 max-w-sm mx-auto">
                <h4 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">
                  How it works:
                </h4>
                <ul className="text-xs sm:text-sm text-blue-700 space-y-1 text-left">
                  <li>• Share your unique referral link</li>
                  <li>• Friends sign up and make their first investment</li>
                  <li>• You earn %% commission on their investments</li>
                  <li>• Track earnings in real-time</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ReferralModal;
