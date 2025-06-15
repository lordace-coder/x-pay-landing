import React, { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BASEURL } from "../utils/utils";

// Reuse the same helper
function formatTimeAgo(inputTime) {
  const now = new Date();
  const time = new Date(inputTime);
  const diff = Math.floor((now - time) / 1000); // in seconds

  if (diff < 60) return `${diff} second${diff === 1 ? "" : "s"} ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)} minute(s) ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hour(s) ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)} day(s) ago`;
  return time.toLocaleDateString();
}

export default function RecentActivity() {
  const navigate = useNavigate();
  const { authFetch } = useAuth();
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    authFetch(BASEURL + "/tokens/transactions")
      .then((res) => res.json())
      .then((data) => setRecentTransactions(data.slice(0, 5))) // show only recent 5
      .catch((err) => console.error("Failed to load transactions", err));
  }, []);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>

      <div className="space-y-4">
        {recentTransactions.map((transaction, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
          >
            <div>
              <p className="font-medium text-gray-900 text-sm">
                {transaction.title}
              </p>
              <p className="text-xs text-gray-500">
                {formatTimeAgo(transaction.timestamp)}
              </p>
            </div>
            <span
              className={`font-semibold text-sm ${
                transaction.amount > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {transaction.amount > 0 ? "+" : "-"}$
              {Math.abs(transaction.amount).toFixed(2)}
            </span>
          </div>
        ))}

        {recentTransactions.length === 0 && (
          <p className="text-sm text-gray-500">No recent transactions.</p>
        )}
      </div>

      <button
        className="w-full mt-4 text-gray-600 text-sm hover:text-gray-900 transition-colors flex items-center justify-center"
        onClick={() => {
          navigate("/notifications");
        }}
      >
        View All Transactions
        <ChevronRight className="h-4 w-4 ml-1" />
      </button>
    </div>
  );
}
