import React, { useState } from "react";
import {
  Bell,
  DollarSign,
  TrendingUp,
  Play,
  Clock,
  ArrowUpRight,
  Calendar,
  MoreVertical,
  ArrowLeft,
} from "lucide-react";

export default function XPayNotifications() {
  const [activeTab, setActiveTab] = useState("notifications");

  const notifications = [
    {
      id: 1,
      type: "earning",
      icon: <Play className="h-5 w-5" />,
      title: "Video Earning",
      message: 'You earned $15.50 from watching "Crypto Market Analysis"',
      time: "2 minutes ago",
      color: "bg-green-100 text-green-600",
    },
    {
      id: 2,
      type: "investment",
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Investment Update",
      message: "Your portfolio gained 3.2% today. Total profit: $2,847.50",
      time: "1 hour ago",
      color: "bg-blue-100 text-blue-600",
    },
  ];

  const transactions = [
    {
      id: 1,
      type: "earning",
      title: "Video Earning",
      description: "Crypto Market Analysis",
      amount: 15.5,
      status: "completed",
      time: "2 minutes ago",
      icon: <ArrowUpRight className="h-4 w-4" />,
      color: "text-green-600",
    },
    {
      id: 2,
      type: "investment",
      title: "Investment Return",
      description: "Portfolio Daily Return",
      amount: 125.0,
      status: "completed",
      time: "1 hour ago",
      icon: <ArrowUpRight className="h-4 w-4" />,
      color: "text-green-600",
    },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-orange-100 text-orange-800",
      failed: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
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
                  alert("Navigate to dashboard");
                }}
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center justify-center w-10 h-10 bg-black rounded-xl mr-4">
                <span className="text-xl font-bold text-white">X</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Notifications
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors relative ${
                activeTab === "notifications"
                  ? "text-gray-900 bg-gray-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </div>
              {activeTab === "notifications" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
              )}
            </button>

            <button
              onClick={() => setActiveTab("transactions")}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors relative ${
                activeTab === "transactions"
                  ? "text-gray-900 bg-gray-50"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <DollarSign className="h-4 w-4" />
                <span>Transactions</span>
              </div>
              {activeTab === "transactions" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
              )}
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "notifications" && (
              <div>
                {/* Notifications List */}
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`p-2 rounded-xl ${notification.color}`}>
                          {notification.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold text-gray-900">
                              {notification.title}
                            </h4>
                            <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            {notification.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {notifications.length === 0 && (
                  <div className="text-center py-12">
                    <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No notifications
                    </h3>
                    <p className="text-gray-500">No notifications to show</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "transactions" && (
              <div>
                {/* Transaction Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-green-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-600 text-sm font-medium">
                          Total Earned
                        </p>
                        <p className="text-2xl font-bold text-green-700">
                          $140.50
                        </p>
                      </div>
                      <ArrowUpRight className="h-8 w-8 text-green-600" />
                    </div>
                  </div>

                  <div className="bg-orange-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-600 text-sm font-medium">
                          Pending
                        </p>
                        <p className="text-2xl font-bold text-orange-700">
                          $0.00
                        </p>
                      </div>
                      <Clock className="h-8 w-8 text-orange-600" />
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-600 text-sm font-medium">
                          This Month
                        </p>
                        <p className="text-2xl font-bold text-blue-700">
                          $650.00
                        </p>
                      </div>
                      <Calendar className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                </div>

                {/* Transactions List */}
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div
                            className={`p-2 rounded-xl bg-gray-100 ${transaction.color}`}
                          >
                            {transaction.icon}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {transaction.title}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {transaction.description}
                            </p>
                            <div className="flex items-center mt-1">
                              <Clock className="h-3 w-3 text-gray-400 mr-1" />
                              <span className="text-xs text-gray-500">
                                {transaction.time}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div
                            className={`text-lg font-bold ${
                              transaction.amount > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {transaction.amount > 0 ? "+" : ""}$
                            {Math.abs(transaction.amount).toFixed(2)}
                          </div>
                          <div className="mt-1">
                            {getStatusBadge(transaction.status)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
