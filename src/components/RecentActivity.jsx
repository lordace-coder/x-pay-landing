import React, { useEffect, useState } from "react";
import { Activity, BarChart3, ChevronRight, User, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BASEURL } from "../utils/utils";

// Reuse the same helper as NotificationsPage
function formatTimeAgo(inputTime) {
  const now = new Date();
  const time = new Date(inputTime);
  const diff = Math.floor((now - time) / 1000); // in seconds

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return time.toLocaleDateString();
}

export default function RecentActivity() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("payments");
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPayments, setLoadingPayments] = useState(false);

  // Fetch recent transactions
  useEffect(() => {
    if (activeTab === "transactions") {
      setLoading(true);
      // authFetch(BASEURL + "/api/payments/transactions")
      //   .then((res) => res.json())
      //   .then((data) =>
      //     setRecentTransactions(Array.isArray(data) ? data.slice(0, 5) : [])
      //   )
      //   .catch((err) => {
      //     setRecentTransactions([]);
      //     console.error("Failed to load transactions", err);
      //   })
      //   .finally(() => setLoading(false));
    }
  }, [activeTab, ]);

  // Fetch payments
  useEffect(() => {
    if (activeTab === "payments") {
      setLoadingPayments(true);
      // authFetch(BASEURL + "/api/payments/my-payments")
      //   .then((res) => res.json())
      //   .then((data) =>
      //     setPayments(Array.isArray(data) ? data.slice(0, 5) : [])
      //   )
      //   .catch((err) => {
      //     setPayments([]);
      //     console.error("Failed to load payments", err);
      //   })
      //   .finally(() => setLoadingPayments(false));
    }
  }, [activeTab]);

  return (
    <div className="trans_4 rounded-lg sm:rounded-2xl p-3 sm:p-4 lg:p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
          <h3 className="text-sm sm:text-lg font-bold text-gray-900">
            Recent Activity
          </h3>
        </div>
        <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-3">
        <button
          onClick={() => setActiveTab("payments")}
          className={`flex-1 px-2 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-colors rounded-t-lg ${
            activeTab === "payments"
              ? "bg-green-50 text-green-700 border-b-2 border-green-500"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          Payments
        </button>
        <button
          onClick={() => setActiveTab("transactions")}
          className={`flex-1 px-2 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-colors rounded-t-lg ${
            activeTab === "transactions"
              ? "bg-blue-50 text-blue-700 border-b-2 border-blue-500"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          Transactions
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[100px] sm:min-h-[120px]">
        {activeTab === "payments" && (
          <div className="space-y-2 sm:space-y-3">
            {loadingPayments && (
              <div className="text-center py-4 sm:py-6">
                <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-green-600 mx-auto mb-2"></div>
                <p className="text-gray-500 text-xs">Loading payments...</p>
              </div>
            )}
            {!loadingPayments && payments.length === 0 && (
              <div className="text-center py-4 sm:py-6">
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-xs mb-2">No recent payments</p>
                <button
                  className="text-teal-600 hover:text-teal-700 text-xs font-medium flex items-center gap-1 mx-auto transition-colors"
                  onClick={() => navigate("/notifications")}
                >
                  View All Payments
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            )}
            {!loadingPayments &&
              payments.length > 0 &&
              payments.map((payment) => (
                <div
                  key={payment.id}
                  className="p-2.5 sm:p-3 bg-green-50 hover:bg-white rounded-lg sm:rounded-xl border border-green-200 transition-all duration-200"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                        <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                          {payment.payment_method}
                        </p>
                        <span
                          className={`self-start text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                            payment.status === "approved"
                              ? "bg-green-200 text-green-800"
                              : payment.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {payment.status.charAt(0).toUpperCase() +
                            payment.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-[10px] text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTimeAgo(payment.created_at)}
                        </div>
                        {payment.reference_number && (
                          <span className="bg-gray-100 px-2 py-0.5 rounded text-[10px] font-mono text-gray-700 self-start">
                            Ref: {payment.reference_number}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm sm:text-base font-bold text-green-700 whitespace-nowrap">
                        +$
                        {payment.amount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
        {activeTab === "transactions" && (
          <div className="space-y-2 sm:space-y-3">
            {loading && (
              <div className="text-center py-4 sm:py-6">
                <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-500 text-xs">Loading transactions...</p>
              </div>
            )}
            {!loading && recentTransactions.length === 0 && (
              <div className="text-center py-4 sm:py-6">
                <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-xs mb-2">
                  No recent transactions
                </p>
                <button
                  className="text-teal-600 hover:text-teal-700 text-xs font-medium flex items-center gap-1 mx-auto transition-colors"
                  onClick={() => navigate("/notifications")}
                >
                  View All Transactions
                  <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            )}
            {!loading &&
              recentTransactions.length > 0 &&
              recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="p-2.5 sm:p-3 bg-blue-50 hover:bg-white rounded-lg sm:rounded-xl border border-blue-200 transition-all duration-200"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-gray-900 mb-1 truncate">
                        {transaction.title}
                      </p>
                      <div className="flex items-center text-[10px] text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTimeAgo(transaction.timestamp)}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p
                        className={`text-sm sm:text-base font-bold whitespace-nowrap ${
                          transaction.amount > 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {transaction.amount > 0 ? "+" : "-"}$
                        {Math.abs(transaction.amount).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
