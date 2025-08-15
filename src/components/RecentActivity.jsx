import React, { useEffect, useState } from "react";
import { Activity, BarChart3, ChevronRight } from "lucide-react";
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
        <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
        <button
          className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center transition-colors"
          onClick={() => navigate("/notifications")}
        >
          View All Transactions
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>

      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <BarChart3 className="h-8 w-8 text-gray-400" />
        </div>
        <p className="text-gray-500 text-sm">No recent transactions.</p>
      </div>
    </div>
  );
}
