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
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if transactions are already cached
    const cachedTransactions = getDashboardData("transactions");

    if (cachedTransactions && cachedTransactions.length > 0) {
      // Use cached data
      setTransactions(cachedTransactions);
    } else {
      // Fetch fresh data
      setLoading(true);
      authFetch(BASEURL + "/api/payments/transactions")
        .then((e) => e.json())
        .then((data) => {
          console.log("Fetched transactions:", data);
          if (data && Array.from(data).length === 0) {
            console.warn("No transactions found in the response.");
          } else {
            setTransactions(data);
            // Cache the fetched data
            setDashboardData("transactions", data);
          }
        })
        .catch((error) => {
          console.error("Error fetching transactions:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [authFetch, getDashboardData, setDashboardData]);

  // Function to refresh transactions data
  const refreshTransactions = () => {
    setLoading(true);
    authFetch(BASEURL + "/tokens/transactions")
      .then((e) => e.json())
      .then((data) => {
        setTransactions(data);
        // Update cached data
        setDashboardData("transactions", data);
      })
      .catch((error) => {
        console.error("Error refreshing transactions:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
              <h1 className="text-xl font-bold text-gray-900">Transactions</h1>
            </div>

            {/* Refresh button */}
            <button
              onClick={refreshTransactions}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              title="Refresh transactions"
            >
              <svg
                className={`h-5 w-5 ${loading ? "animate-spin" : ""}`}
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {loading && transactions.length === 0 && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading transactions...</p>
            </div>
          )}

          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="p-4 bg-gray-50 hover:bg-white rounded-xl border border-gray-200 transition-all duration-200"
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
          </div>
        </div>
      </main>
    </div>
  );
}
