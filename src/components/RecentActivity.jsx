import React, { useEffect, useState } from "react";
import { Activity, BarChart3, ChevronRight, User } from "lucide-react";
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
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-gray-600" />
          <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
        </div>
        <User className="w-5 h-5 text-gray-400" />
      </div>

      <div className="text-center py-8">
        <p className="text-gray-500 text-sm mb-4">No recent transactions</p>
        <button className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1 mx-auto transition-colors">
          View All Transactions
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
