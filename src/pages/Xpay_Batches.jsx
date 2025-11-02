import {
  BarChart3,
  Package,
  Plus,
  RefreshCw,
  MinusCircle,
  AlertTriangle,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { BASEURL } from "../utils/utils";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDashboardContext } from "../context/DashboardContext";
import { toast } from "react-toastify";

function Xpay_Batches() {
  const [batchData, setBatchData] = useState(null);
  const [batchLoading, setBatchLoading] = useState(false);
  const navigate = useNavigate();
  const { getDashboardData, setDashboardData } = useDashboardContext();

  useEffect(() => {
    getBatchData();
    // eslint-disable-next-line
  }, []);

  const getBatchData = async (forceRefresh = false) => {
    try {
      setBatchLoading(true);
      if (!forceRefresh) {
        const cachedData = getDashboardData("batchData");
        const lastFetch = getDashboardData("batchLastFetch");
        const now = Date.now();
        if (cachedData && lastFetch && now - lastFetch < 5 * 60 * 1000) {
          setBatchData(cachedData);
          setBatchLoading(false);
          return;
        }
      }
      // const res = await authFetch(BASEURL + "/investment/batches");
      // const data = await res.json();
      // setBatchData(data);
      // setDashboardData("batchData", data);
      // setDashboardData("batchLastFetch", Date.now());
    } catch (err) {
      console.error("Failed to fetch batch data:", err);
      toast.error("Failed to fetch investment data. Please try again later.");
    } finally {
      setBatchLoading(false);
    }
  };

  // --- UI Card Components ---
  const ActiveBatchCard = ({ batch }) => {
    const canWithdraw = batch.days_remaining <= 15 && batch.videos_watched > 30;
    const isEmergency = batch.days_remaining > 15;

    return (
      <div className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors bg-slate-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="font-medium text-gray-900">
              ${batch.invested_amount.toLocaleString()} Investment
            </span>
            <span className="px-2 py-1 text-xs rounded-full font-medium bg-green-100 text-green-700">
              {batch.status}
            </span>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              ${batch.total_value.toFixed(2)}
            </div>
            <div className="text-xs text-green-600">
              +${batch.current_interest.toFixed(2)} interest
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Progress</span>
            <div className="font-medium">
              {batch.completion_percentage.toFixed(1)}%
            </div>
          </div>
          <div>
            <span className="text-gray-500">Videos</span>
            <div className="font-medium">
              {batch.videos_watched}/{batch.total_videos_required}
            </div>
          </div>
          <div>
            <span className="text-gray-500">Days Left</span>
            <div className="font-medium">{batch.days_remaining}</div>
          </div>
          <div>
            <span className="text-gray-500">Rate</span>
            <div className="font-medium">{batch.interest_rate}%</div>
          </div>
        </div>
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[var(--bs-primary)] h-2 rounded-full transition-all duration-300"
              style={{ width: `${batch.completion_percentage}%` }}
            />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {canWithdraw && (
            <button
              onClick={() => handleWithdrawBatch(batch)}
              className="w-full bg-gradient-to-r  from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-medium py-2 px-4 rounded transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <MinusCircle className="h-4 w-4" />
              <span>Early Withdrawal (20% Interest)</span>
            </button>
          )}
          {isEmergency && (
            <button
              onClick={() => handleWithdrawBatch(batch)}
              className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 px-4 rounded transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Emergency Withdrawal (Principal Only)</span>
            </button>
          )}
          {!canWithdraw && !isEmergency && (
            <div className="text-center py-2 text-sm text-gray-500">
              Complete more videos or wait to unlock withdrawal options
            </div>
          )}
        </div>
      </div>
    );
  };

  const CompletedBatchCard = ({ batch }) => {
    return (
      <div className="border border-gray-200 rounded-xl p-4 bg-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 rounded-full bg-gray-400" />
            <span className="font-medium text-gray-900">
              ${batch.invested_amount.toLocaleString()} Investment
            </span>
            <span className="px-2 py-1 text-xs rounded-full font-medium bg-gray-200 text-gray-700">
              {batch.status}
            </span>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              ${batch.total_value.toFixed(2)}
            </div>
            <div className="text-xs text-gray-600">
              +${batch.current_interest.toFixed(2)} interest
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Progress</span>
            <div className="font-medium">
              {batch.completion_percentage.toFixed(1)}%
            </div>
          </div>
          <div>
            <span className="text-gray-500">Videos</span>
            <div className="font-medium">
              {batch.videos_watched}/{batch.total_videos_required}
            </div>
          </div>
          <div>
            <span className="text-gray-500">Days Left</span>
            <div className="font-medium">{batch.days_remaining}</div>
          </div>
          <div>
            <span className="text-gray-500">Rate</span>
            <div className="font-medium">{batch.interest_rate}%</div>
          </div>
        </div>
      </div>
    );
  };

  const handleWithdrawBatch = (batch) => {
    navigate("/emergency-withdrawal");
  };

  // --- UI ---
  return (
    <div className="min-h-screen  lg:pl-16">
      <header className="bg-white border-b border-gray-200 pt-6 sticky top-0 z-40 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Investment Batches
              </h1>
            </div>
            <button
              onClick={() => navigate("/purchase-tokens")}
              className="px-4 py-2 bg-[var(--bs-primary)] text-white rounded-lg font-medium hover:bg-[var(--bs-primary-hover)] transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>New Batch</span>
            </button>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
        <div className="trans_5  rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          {batchLoading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-500">Loading batches...</span>
            </div>
          ) : batchData && batchData.batches && batchData.batches.length > 0 ? (
            <div className="space-y-6">
              {/* Completed Batches */}
              {batchData.batches
                .filter((batch) => batch.status === "completed")
                .map((batch) => (
                  <CompletedBatchCard key={batch.batch_uuid} batch={batch} />
                ))}
              {/* Active Batches */}
              {batchData.batches
                .filter((batch) => batch.status === "active")
                .map((batch) => (
                  <ActiveBatchCard key={batch.batch_uuid} batch={batch} />
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                No Investment Batches
              </h4>
              <p className="text-gray-500 mb-4">
                Create your first investment batch to start earning interest.
              </p>
              <button
                onClick={() => navigate("/purchase-tokens")}
                className="px-6 py-3 bg-[var(--bs-primary)] text-white rounded-lg font-medium hover:bg-[var(--bs-primary-hover)] transition-colors flex items-center space-x-2 mx-auto"
              >
                <Plus className="h-4 w-4" />
                <span>Create First Batch</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Xpay_Batches;
