import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDashboardContext } from "../context/DashboardContext";
import { BASEURL } from "../utils/utils";

// Helper to get "time ago" string
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

export default function XPayNotifications() {
  const navigate = useNavigate();
  const { authFetch } = useAuth();
  const { getDashboardData, setDashboardData } = useDashboardContext();
  const [activeTab, setActiveTab] = useState("payments");
  const [transactions, setTransactions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingPayments, setLoadingPayments] = useState(false);

  // Fetch transactions
  useEffect(() => {
    if (activeTab === "transactions") {
      const cachedTransactions = getDashboardData("transactions");
      if (cachedTransactions !== null) {
        // Use cached data (even if empty array)
        setTransactions(
          Array.isArray(cachedTransactions) ? cachedTransactions : []
        );
      } else {
        // Only fetch if we haven't cached anything yet
        setLoading(true);
        authFetch(BASEURL + "/api/payments/transactions")
          .then((e) => e.json())
          .then((data) => {
            const transactionData = Array.isArray(data) ? data : [];
            setTransactions(transactionData);
            setDashboardData("transactions", transactionData);
          })
          .catch((error) => {
            console.error("Error fetching transactions:", error);
            const emptyTransactions = [];
            setTransactions(emptyTransactions);
            setDashboardData("transactions", emptyTransactions);
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
  }, [activeTab, authFetch, getDashboardData, setDashboardData]);

  // Fetch payments
  useEffect(() => {
    if (activeTab === "payments") {
      setLoadingPayments(true);
      authFetch(BASEURL + "/api/payments/my-payments")
        .then((e) => e.json())
        .then((data) => {
          setPayments(data);
        })
        .catch((error) => {
          console.error("Error fetching payments:", error);
        })
        .finally(() => {
          setLoadingPayments(false);
        });
    }
  }, [activeTab, authFetch]);

  // Refresh current tab data
  const refreshCurrentTab = () => {
    if (activeTab === "payments") {
      setLoadingPayments(true);
      authFetch(BASEURL + "/api/payments/my-payments")
        .then((e) => e.json())
        .then((data) => {
          setPayments(data);
        })
        .catch((error) => {
          console.error("Error refreshing payments:", error);
        })
        .finally(() => {
          setLoadingPayments(false);
        });
    } else {
      setLoading(true);
      authFetch(BASEURL + "/tokens/transactions")
        .then((e) => e.json())
        .then((data) => {
          setTransactions(Array.isArray(data) ? data : []);
          setDashboardData("transactions", Array.isArray(data) ? data : []);
        })
        .catch((error) => {
          console.error("Error refreshing transactions:", error);
          setTransactions([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const isCurrentTabLoading =
    activeTab === "payments" ? loadingPayments : loading;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors mr-2"
                onClick={() => {
                  navigate("/dashboard");
                }}
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <h1 className="text-xl font-bold text-gray-900">
                {activeTab === "payments"
                  ? "Payment History"
                  : "Transaction History"}
              </h1>
            </div>

            {/* Refresh button */}
            <button
              onClick={refreshCurrentTab}
              disabled={isCurrentTabLoading}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              title={`Refresh ${activeTab}`}
            >
              <svg
                className={`h-5 w-5 ${
                  isCurrentTabLoading ? "animate-spin" : ""
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("payments")}
              className={`flex-1 px-3 sm:px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === "payments"
                  ? "bg-green-50 text-green-700 border-b-2 border-green-500"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 10c-4.418 0-8-1.79-8-4V7c0-2.21 3.582-4 8-4s8 1.79 8 4v7c0 2.21-3.582 4-8 4z"
                  />
                </svg>
                <span className="hidden sm:inline">Payment History</span>
                <span className="sm:hidden">Payments</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
              className={`flex-1 px-3 sm:px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === "transactions"
                  ? "bg-blue-50 text-blue-700 border-b-2 border-blue-500"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 10c-4.418 0-8-1.79-8-4V7c0-2.21 3.582-4 8-4s8 1.79 8 4v7c0 2.21-3.582 4-8 4z"
                  />
                </svg>
                <span className="hidden sm:inline">Transaction History</span>
                <span className="sm:hidden">Transactions</span>
              </div>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-3 sm:p-6 min-h-[400px]">
            {activeTab === "payments" && (
              <div className="space-y-4">
                {loadingPayments && payments.length === 0 && (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading payments...</p>
                  </div>
                )}
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="p-4 bg-green-50 hover:bg-white rounded-xl border border-green-200 transition-all duration-200 relative"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <h4 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                          {payment.payment_method}
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-full ml-2 ${
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
                        <p className="text-sm text-gray-500">
                          {payment.description || "No description"}
                        </p>
                        <div className="flex items-center mt-1 text-xs text-gray-500 gap-2">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTimeAgo(payment.created_at)}
                          {payment.reference_number && (
                            <span className="ml-2 bg-gray-100 px-2 py-0.5 rounded text-xs font-mono text-gray-700">
                              Ref: {payment.reference_number}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-2">
                        <p className="text-lg font-bold text-green-700">
                          +$
                          {payment.amount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                          })}
                        </p>
                        {payment.proof_image_path && (
                          <a
                            href={payment.proof_image_path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 underline hover:text-blue-800"
                          >
                            View Proof
                          </a>
                        )}
                      </div>
                    </div>
                    {payment.admin_notes && (
                      <div className="mt-2 text-xs text-gray-600 bg-gray-100 rounded p-2">
                        <span className="font-semibold text-gray-700">
                          Admin Notes:
                        </span>{" "}
                        {payment.admin_notes}
                      </div>
                    )}
                  </div>
                ))}
                {!loadingPayments && payments.length === 0 && (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No payments
                    </h3>
                    <p className="text-gray-500">
                      No payment history available.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "transactions" && (
              <div className="space-y-4">
                {loading && (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading transactions...</p>
                  </div>
                )}
                {!loading && transactions.length === 0 && (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No transactions
                    </h3>
                    <p className="text-gray-500">
                      No transaction history available.
                    </p>
                  </div>
                )}
                {!loading &&
                  transactions.length > 0 &&
                  transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="p-4 bg-blue-50 hover:bg-white rounded-xl border border-blue-200 transition-all duration-200"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-0.5">
                          <h4 className="text-base font-semibold text-gray-900">
                            {transaction.title}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {transaction.description}
                          </p>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTimeAgo(transaction.timestamp)}
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-lg font-bold ${
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
      </main>
    </div>
  );
}
