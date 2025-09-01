import React, { useEffect, useState } from "react";
import { Clock, Copy, Check } from "lucide-react";
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
  const [copiedRef, setCopiedRef] = useState(null);

  // Initial data fetch for both payments and transactions
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Start loading both
        setLoadingPayments(true);
        setLoading(true);

        // Fetch payments
        const paymentsPromise = authFetch(`${BASEURL}/api/payments/my-payments`)
          .then((res) => res.json())
          .then((data) => {
            setPayments(Array.isArray(data) ? data : []);
          });

        // Check cache for transactions first
        const transactionsPromise = authFetch(
          `${BASEURL}/api/payments/transactions`
        )
          .then((res) => res.json())
          .then((data) => {
            const transactionData = Array.isArray(data) ? data : [];
            setTransactions(transactionData);
            setDashboardData("transactions", transactionData);
          });

        // Wait for both to complete
        await Promise.all([paymentsPromise, transactionsPromise]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingPayments(false);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Refresh function for both tabs
  const refreshCurrentTab = async () => {
    try {
      if (activeTab === "payments") {
        setLoadingPayments(true);
        const response = await authFetch(`${BASEURL}/api/payments/my-payments`);
        const data = await response.json();
        setPayments(Array.isArray(data) ? data : []);
        setLoadingPayments(false);
      } else {
        setLoading(true);
        const response = await authFetch(
          `${BASEURL}/api/payments/transactions`
        );
        const data = await response.json();
        const transactionData = Array.isArray(data) ? data : [];
        setTransactions(transactionData);
        setDashboardData("transactions", transactionData);
        setLoading(false);
      }
    } catch (error) {
      console.error(`Error refreshing ${activeTab}:`, error);
      setLoadingPayments(false);
      setLoading(false);
    }
  };

  const isCurrentTabLoading =
    activeTab === "payments" ? loadingPayments : loading;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedRef(text);
    setTimeout(() => setCopiedRef(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-2">
      {/* Header - Improved mobile responsiveness */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="w-full px-2 sm:px-4 lg:px-6 max-w-7xl mx-auto">
          <div className="flex justify-between items-center h-12 sm:h-14">
            <div className="flex items-center min-w-0 flex-1">
              <button
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors mr-1 sm:mr-2 flex-shrink-0"
                onClick={() => {
                  navigate("/dashboard");
                }}
              >
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5"
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
              <p className="text-base sm:text-lg pl-5 font-bold text-gray-900 truncate">
                {activeTab === "payments"
                  ? "Payment History"
                  : "Transaction History"}
              </p>
            </div>

            {/* Refresh button */}
            <button
              onClick={refreshCurrentTab}
              disabled={isCurrentTabLoading}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 flex-shrink-0 ml-2"
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

      {/* Main Content - Full width on mobile */}
      <main className="w-full md:w-[90vw] px-2 sm:px-4 py-2 sm:py-4 max-w-7xl mx-auto">
        {/* Tab Navigation - Full width and improved mobile design */}
        <div className="bg-white rounded-lg sm:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("payments")}
              className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium transition-all duration-200 ${
                activeTab === "payments"
                  ? "bg-green-50 text-green-700 border-b-2 border-green-500 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5"
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
                <span className="font-semibold">
                  <span className="hidden xs:inline">Payment History</span>
                  <span className="xs:hidden">Payments</span>
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
              className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium transition-all duration-200 ${
                activeTab === "transactions"
                  ? "bg-blue-50 text-blue-700 border-b-2 border-blue-500 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                  />
                </svg>
                <span className="font-semibold">
                  <span className="hidden xs:inline">Transaction History</span>
                  <span className="xs:hidden">Transactions</span>
                </span>
              </div>
            </button>
          </div>

          {/* Tab Content - Improved spacing and typography */}
          <div className="p-2 sm:p-4 min-h-[400px]">
            {activeTab === "payments" && (
              <div className="space-y-2 sm:space-y-3">
                {loadingPayments && payments.length === 0 && (
                  <div className="text-center py-12 sm:py-16">
                    <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-500 text-sm sm:text-base">
                      Loading payments...
                    </p>
                  </div>
                )}
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="p-3 sm:p-4 bg-green-50 hover:bg-white rounded-lg border border-green-200 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                            {payment.payment_method}
                          </p>
                          <span
                            className={`text-2xs sm:text-xs font-bold px-2 py-0.5 rounded-full ${
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
                        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                          {payment.description || "No description"}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-2xs sm:text-xs text-gray-500">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTimeAgo(payment.created_at)}
                          </div>
                          {payment.reference_number && (
                            <div className="flex items-center bg-gray-100 px-2 py-0.5 rounded">
                              <span className="font-mono text-gray-700 truncate max-w-20 sm:max-w-none">
                                Ref: {payment.reference_number}
                              </span>
                              <button
                                onClick={() =>
                                  copyToClipboard(payment.reference_number)
                                }
                                className="ml-1 p-0.5 hover:text-blue-600"
                                title="Copy reference"
                              >
                                {copiedRef === payment.reference_number ? (
                                  <Check className="h-3 w-3" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-1 flex-shrink-0">
                        <p className="text-base sm:text-lg font-bold text-green-700">
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
                            className="text-xs sm:text-sm text-blue-600 underline hover:text-blue-800 transition-colors"
                          >
                            View Proof
                          </a>
                        )}
                      </div>
                    </div>
                    {payment.admin_notes && (
                      <div className="mt-2 text-2xs sm:text-xs text-gray-600 bg-gray-100 rounded-lg p-2">
                        <span className="font-semibold text-gray-700">
                          Admin Notes:
                        </span>{" "}
                        {payment.admin_notes}
                      </div>
                    )}
                  </div>
                ))}
                {!loadingPayments && payments.length === 0 && (
                  <div className="text-center py-12 sm:py-16">
                    <Clock className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
                      No payments
                    </h3>
                    <p className="text-gray-500 text-sm sm:text-base">
                      No payment history available.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "transactions" && (
              <div className="space-y-2 sm:space-y-3">
                {loading && (
                  <div className="text-center py-12 sm:py-16">
                    <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500 text-sm sm:text-base">
                      Loading transactions...
                    </p>
                  </div>
                )}
                {!loading && transactions.length === 0 && (
                  <div className="text-center py-12 sm:py-16">
                    <Clock className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
                      No transactions
                    </h3>
                    <p className="text-gray-500 text-sm sm:text-base">
                      No transaction history available.
                    </p>
                  </div>
                )}
                {!loading &&
                  transactions.length > 0 &&
                  transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="p-3 sm:p-4 bg-blue-50 hover:bg-white rounded-lg border border-blue-200 transition-all duration-200 hover:shadow-md"
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="space-y-1 min-w-0 flex-1">
                          <p className="text-sm sm:text-base font-semibold text-gray-900">
                            {transaction.title}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
                            {transaction.description}
                          </p>
                          <div className="flex items-center text-2xs sm:text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {formatTimeAgo(transaction.timestamp)}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p
                            className={`text-base sm:text-lg font-bold ${
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
