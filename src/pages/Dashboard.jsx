import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  DollarSign,
  Play,
  Eye,
  Bell,
  LogOut,
  User,
  Wallet,
  Gift,
  ChevronRight,
  Video,
  RefreshCw,
  User2Icon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useDashboardContext } from "../context/DashboardContext";
import { useNavigate } from "react-router-dom";
import WatchEarnComponent from "../components/WatchAndEarn";
import RecentActivity from "../components/RecentActivity";
import { BASEURL } from "../utils/utils";

export default function XPayDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [videosWatched, setVideosWatched] = useState({});
  const [loading, setLoading] = useState(false);
  const { user: userData, logout, authFetch } = useAuth();
  const { getDashboardData, setDashboardData } = useDashboardContext();
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize videos data on mount
    const initializeData = async () => {
      const cachedVideosData = getDashboardData("videosWatched");

      if (cachedVideosData) {
        setVideosWatched(cachedVideosData);
      } else {
        await getVideosLeft();
      }
    };

    initializeData();

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []); // Empty dependency array to run only on mount

  // Separate useEffect for caching user data
  useEffect(() => {
    if (userData) {
      setDashboardData("userData", userData);
    }
  }, [userData]); // Only depend on userData

  const getVideosLeft = async (forceRefresh = false) => {
    try {
      setLoading(true);

      // If not forcing refresh, check cache first
      if (!forceRefresh) {
        const cachedData = getDashboardData("videosWatched");
        const lastFetch = getDashboardData("videosLastFetch");
        const now = Date.now();

        // Use cached data if it's less than 5 minutes old
        if (cachedData && lastFetch && now - lastFetch < 5 * 60 * 1000) {
          setVideosWatched(cachedData);
          setLoading(false);
          return;
        }
      }

      const res = await authFetch(BASEURL + "/videos/remaining");
      const data = await res.json();

      setVideosWatched(data);

      // Cache the data with timestamp
      setDashboardData("videosWatched", data);
      setDashboardData("videosLastFetch", Date.now());
    } catch (err) {
      console.error("Failed to fetch videos left:", err);
    } finally {
      setLoading(false);
    }
  };

  // Function to refresh all dashboard data
  const refreshDashboardData = async () => {
    await getVideosLeft(true);
    // You can add other data refresh calls here
  };

  // Remove this useEffect that was causing re-renders
  // Videos data will be cached when it's fetched in getVideosLeft

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 pt-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Refresh button */}
              <button
                onClick={refreshDashboardData}
                disabled={loading}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
                title="Refresh dashboard data"
              >
                <RefreshCw
                  className={`h-5 w-5 ${loading ? "animate-spin" : ""}`}
                />
              </button>

              <button
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => navigate("/notifications")}
              >
                <Bell className="h-5 w-5" />
              </button>
              <button
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={logout}
              >
                <LogOut className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {userData.full_name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userData.full_name.split(" ")[0]}!
          </h2>
          <p className="text-gray-600">
            Here's what's happening with your investments today.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Capital */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-xl">
                <Wallet className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">Capital</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              ${userData.capital.toLocaleString()}
            </div>
          </div>

          {/* Profits */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-xl">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-sm text-gray-500">Profits</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              ${userData.balance.toLocaleString()}
            </div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              Earn up to 55.4% this week
            </p>
          </div>

          {/* Today Earnings */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative">
            {loading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-2xl">
                <RefreshCw className="h-4 w-4 animate-spin text-purple-600" />
              </div>
            )}
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-xl">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-sm text-gray-500">Today's Earnings</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              ${videosWatched.earned_today ?? 0}
            </div>
            <p className="text-xs text-purple-600 flex items-center">
              <Play className="h-3 w-3 mr-1" />
              From{" "}
              {(videosWatched.watched_today ?? 0) === 1
                ? "video"
                : "videos"}{" "}
              watched
            </p>
          </div>

          {/* Videos Watched */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative">
            {loading && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-2xl">
                <RefreshCw className="h-4 w-4 animate-spin text-orange-600" />
              </div>
            )}
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-100 rounded-xl">
                <Play className="h-6 w-6 text-orange-600" />
              </div>
              <span className="text-sm text-gray-500">Videos Watched</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {videosWatched.watched_today ?? 0}
            </div>
            <p className="text-xs text-orange-600 flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              {videosWatched.remaining_today ?? 0}{" "}
              {(videosWatched.remaining_today ?? 0) === 1 ? "video" : "videos"}{" "}
              left
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Watch and Earn */}
          <WatchEarnComponent
            onRefresh={() => getVideosLeft(true)}
            availableVideos={videosWatched.remaining_today ?? 0}
          />

          {/* Sidebar Content */}
          <div className="space-y-6">
            {/* Promo Banner */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8"></div>
              <div className="relative">
                <div className="flex items-center mb-3">
                  <Gift className="h-6 w-6 mr-2" />
                  <span className="text-sm font-medium opacity-90">
                    Special Offer
                  </span>
                </div>
                <h4 className="text-xl font-bold mb-2">Earn More Tokens</h4>
                <p className="text-sm opacity-90 mb-4">
                  Purchase extra X-Pay tokens to boost your daily profit and
                  earn more.
                </p>
                <button
                  className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors"
                  onClick={() => navigate("/purchase-tokens")}
                >
                  Purchase Now
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <RecentActivity />

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Quick Actions
              </h3>

              <div className="space-y-3">
                <button
                  className="w-full bg-gray-50 hover:bg-gray-100 p-4 rounded-xl transition-colors flex items-center justify-between group"
                  onClick={() => navigate("/withdraw")}
                >
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-gray-600 mr-3" />
                    <span className="font-medium text-gray-900">
                      Make Withdrawal
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                </button>
                <button
                  className="w-full bg-gray-50 hover:bg-gray-100 p-4 rounded-xl transition-colors flex items-center justify-between group"
                  onClick={() => navigate("/ref")}
                >
                  <div className="flex items-center">
                    <User2Icon className="h-5 w-5 text-gray-600 mr-3" />
                    <span className="font-medium text-gray-900">
                      Check Referrals
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                </button>
                <button
                  className="w-full bg-gray-50 hover:bg-gray-100 p-4 rounded-xl transition-colors flex items-center justify-between group"
                  onClick={() => navigate("/ads")}
                >
                  <div className="flex items-center">
                    <Video className="h-5 w-5 text-gray-600 mr-3" />
                    <span className="font-medium text-gray-900">
                      Upload Video Ads
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
