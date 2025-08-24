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

  if (diff < 60) return `${diff} second${diff === 1 ? "" : "s"} ago`;
  if (diff < 3600)
    return `${Math.floor(diff / 60)} minute${
      Math.floor(diff / 60) === 1 ? "" : "s"
    } ago`;
  if (diff < 86400)
    return `${Math.floor(diff / 3600)} hour${
      Math.floor(diff / 3600) === 1 ? "" : "s"
    } ago`;
  if (diff < 604800)
    return `${Math.floor(diff / 86400)} day${
      Math.floor(diff / 86400) === 1 ? "" : "s"
    } ago`;
  return time.toLocaleDateString();
}

export default function RecentActivity() {
  const navigate = useNavigate();
  const { authFetch } = useAuth();
  const [activeTab, setActiveTab] = useState("payments");
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPayments, setLoadingPayments] = useState(false);

  // Fetch recent transactions
  useEffect(() => {
    if (activeTab === "transactions") {
      setLoading(true);
      authFetch(BASEURL + "/tokens/transactions")
        .then((res) => res.json())
        .then((data) =>
          setRecentTransactions(Array.isArray(data) ? data.slice(0, 5) : [])
        )
        .catch((err) => {
          setRecentTransactions([]);
          console.error("Failed to load transactions", err);
        })
        .finally(() => setLoading(false));
    }
  }, [activeTab, authFetch]);

  // Fetch payments
  useEffect(() => {
    if (activeTab === "payments") {
      setLoadingPayments(true);
      authFetch(BASEURL + "/api/payments/my-payments")
        .then((res) => res.json())
        .then((data) =>
          setPayments(Array.isArray(data) ? data.slice(0, 5) : [])
        )
        .catch((err) => {
          setPayments([]);
          console.error("Failed to load payments", err);
        })
        .finally(() => setLoadingPayments(false));
    }
  }, [activeTab, authFetch]);

  return (
    <div className="trans_4 rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-gray-600" />
          <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
        </div>
        <User className="w-5 h-5 text-gray-400" />
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          onClick={() => setActiveTab("payments")}
          className={`flex-1 px-2 py-2 text-xs sm:text-sm font-medium transition-colors rounded-t-lg ${
            activeTab === "payments"
              ? "bg-green-50 text-green-700 border-b-2 border-green-500"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          Payments
        </button>
        <button
          onClick={() => setActiveTab("transactions")}
          className={`flex-1 px-2 py-2 text-xs sm:text-sm font-medium transition-colors rounded-t-lg ${
            activeTab === "transactions"
              ? "bg-blue-50 text-blue-700 border-b-2 border-blue-500"
              : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          Transactions
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[120px]">
        {activeTab === "payments" && (
          <div className="space-y-3">
            {loadingPayments && (
              <div className="text-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mx-auto mb-2"></div>
                <p className="text-gray-500 text-xs">Loading payments...</p>
              </div>
            )}
            {!loadingPayments && payments.length === 0 && (
              <div className="text-center py-6">
                <Clock className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-xs mb-1">No recent payments</p>
                <button
                  className="text-teal-600 hover:text-teal-700 text-xs font-medium flex items-center gap-1 mx-auto transition-colors"
                  onClick={() => navigate("/notifications")}
                >
                  View All Payments
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
            {!loadingPayments &&
              payments.length > 0 &&
              payments.map((payment) => (
                <div
                  key={payment.id}
                  className="p-3 bg-green-50 hover:bg-white rounded-xl border border-green-200 transition-all duration-200 relative"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-semibold text-gray-900 flex items-center gap-2">
                        {payment.payment_method}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ml-2 ${
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
                      </h4>
                      <div className="flex items-center mt-1 text-[10px] text-gray-500 gap-2">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTimeAgo(payment.created_at)}
                        {payment.reference_number && (
                          <span className="ml-2 bg-gray-100 px-2 py-0.5 rounded text-[10px] font-mono text-gray-700">
                            Ref: {payment.reference_number}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-1">
                      <p className="text-xs font-bold text-green-700">
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
          <div className="space-y-3">
            {loading && (
              <div className="text-center py-6">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-500 text-xs">Loading transactions...</p>
              </div>
            )}
            {!loading && recentTransactions.length === 0 && (
              <div className="text-center py-6">
                <Clock className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500 text-xs mb-1">
                  No recent transactions
                </p>
                <button
                  className="text-teal-600 hover:text-teal-700 text-xs font-medium flex items-center gap-1 mx-auto transition-colors"
                  onClick={() => navigate("/notifications")}
                >
                  View All Transactions
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
            {!loading &&
              recentTransactions.length > 0 &&
              recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="p-3 bg-blue-50 hover:bg-white rounded-xl border border-blue-200 transition-all duration-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-semibold text-gray-900">
                        {transaction.title}
                      </h4>
                      <div className="flex items-center mt-1 text-[10px] text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTimeAgo(transaction.timestamp)}
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-xs font-bold ${
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
