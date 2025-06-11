import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  DollarSign,
  Play,
  Eye,
  Clock,
  Bell,
  Settings,
  LogOut,
  User,
  PieChart,
  BarChart3,
  Calendar,
  Gift,
  Star,
  ChevronRight,
  Wallet,
  Target,
  Award,
} from "lucide-react";

export default function XPayDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState("7d");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const userData = {
    name: "John Smith",
    capital: 25000,
    profits: 3847.5,
    totalEarnings: 28847.5,
    dailyEarnings: 245.3,
    videosWatched: 127,
    availableVideos: 8,
  };

  const videos = [
    {
      id: 1,
      title: "Crypto Market Analysis",
      duration: "12:45",
      earning: 15.5,
      thumbnail: "📊",
      views: "2.1k",
    },
    {
      id: 2,
      title: "Stock Trading Basics",
      duration: "08:30",
      earning: 12.0,
      thumbnail: "📈",
      views: "1.8k",
    },
    {
      id: 3,
      title: "Investment Strategies",
      duration: "15:20",
      earning: 18.75,
      thumbnail: "💼",
      views: "3.2k",
    },
    {
      id: 4,
      title: "Market Trends 2024",
      duration: "10:15",
      earning: 14.25,
      thumbnail: "🎯",
      views: "1.5k",
    },
  ];

  const recentTransactions = [
    {
      type: "Video Earning",
      amount: 15.5,
      time: "2 hours ago",
      status: "completed",
    },
    {
      type: "Investment Return",
      amount: 125.0,
      time: "1 day ago",
      status: "completed",
    },
    {
      type: "Video Earning",
      amount: 12.0,
      time: "2 days ago",
      status: "completed",
    },
    { type: "Bonus", amount: 50.0, time: "3 days ago", status: "completed" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 pt-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-black rounded-xl mr-4">
                <span className="text-xl font-bold text-white">X</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                <Settings className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {userData.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {userData.name.split(" ")[0]}!
          </h2>
          <p className="text-gray-600">
            Here's what's happening with your investments today.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Capital Card */}
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
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +2.5% from last month
            </p>
          </div>

          {/* Profits Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-xl">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-sm text-gray-500">Profits</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              ${userData.profits.toLocaleString()}
            </div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15.4% this week
            </p>
          </div>

          {/* Daily Earnings Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-xl">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <span className="text-sm text-gray-500">Today's Earnings</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              ${userData.dailyEarnings}
            </div>
            <p className="text-xs text-purple-600 flex items-center">
              <Play className="h-3 w-3 mr-1" />
              From 12 videos watched
            </p>
          </div>

          {/* Videos Watched Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-100 rounded-xl">
                <Play className="h-6 w-6 text-orange-600" />
              </div>
              <span className="text-sm text-gray-500">Videos Watched</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">
              {userData.videosWatched}
            </div>
            <p className="text-xs text-orange-600 flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              {userData.availableVideos} new available
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Available Videos */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Watch & Earn
                </h3>
                <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                  {userData.availableVideos} New
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    className="group border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
                        {video.thumbnail}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">
                          {video.title}
                        </h4>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {video.duration}
                          </span>
                          <span className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" />
                            {video.views}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-green-600 font-semibold text-sm">
                            +${video.earning}
                          </span>
                          <button className="bg-gray-900 text-white px-3 py-1 rounded-lg text-xs hover:bg-gray-800 transition-colors flex items-center">
                            <Play className="h-3 w-3 mr-1" />
                            Watch
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 bg-gray-50 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center">
                View All Videos
                <ChevronRight className="h-4 w-4 ml-2" />
              </button>
            </div>

            {/* Investment Overview Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Investment Overview
                </h3>
                <div className="flex space-x-2">
                  {["7d", "30d", "90d"].map((period) => (
                    <button
                      key={period}
                      onClick={() => setSelectedPeriod(period)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        selectedPeriod === period
                          ? "bg-gray-900 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simplified Chart Placeholder */}
              <div className="h-48 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">
                    Portfolio Performance Chart
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    +12.5% growth this period
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Custom Banner Ad */}
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
                <h4 className="text-xl font-bold mb-2">Premium Upgrade</h4>
                <p className="text-sm opacity-90 mb-4">
                  Get 50% more earnings from videos and exclusive investment
                  insights.
                </p>
                <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors">
                  Upgrade Now
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Recent Activity
              </h3>

              <div className="space-y-4">
                {recentTransactions.map((transaction, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <DollarSign className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {transaction.type}
                        </p>
                        <p className="text-xs text-gray-500">
                          {transaction.time}
                        </p>
                      </div>
                    </div>
                    <span className="text-green-600 font-semibold text-sm">
                      +${transaction.amount}
                    </span>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 text-gray-600 text-sm hover:text-gray-900 transition-colors flex items-center justify-center">
                View All Transactions
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Quick Actions
              </h3>

              <div className="space-y-3">
                <button className="w-full bg-gray-50 hover:bg-gray-100 p-4 rounded-xl transition-colors flex items-center justify-between group">
                  <div className="flex items-center">
                    <Target className="h-5 w-5 text-gray-600 mr-3" />
                    <span className="font-medium text-gray-900">
                      Set Investment Goal
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                </button>

                <button className="w-full bg-gray-50 hover:bg-gray-100 p-4 rounded-xl transition-colors flex items-center justify-between group">
                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-gray-600 mr-3" />
                    <span className="font-medium text-gray-900">
                      View Achievements
                    </span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />
                </button>

                <button className="w-full bg-gray-50 hover:bg-gray-100 p-4 rounded-xl transition-colors flex items-center justify-between group">
                  <div className="flex items-center">
                    <PieChart className="h-5 w-5 text-gray-600 mr-3" />
                    <span className="font-medium text-gray-900">
                      Portfolio Analysis
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
