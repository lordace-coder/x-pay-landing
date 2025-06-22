import React, { useState, useEffect } from "react";
import {
  Users,
  DollarSign,
  TrendingUp,
  Copy,
  Share2,
  Eye,
  Calendar,
  Filter,
  Check,
  X,
} from "lucide-react";

const ReferralTrackingPage = () => {
  const [timeFilter, setTimeFilter] = useState("all");
  const [copySuccess, setCopySuccess] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [shareError, setShareError] = useState("");

  // Mock data - replace with real API data
  const [dashboardData] = useState({
    totalEarnings: 2847.5,
    totalReferrals: 23,
    activeReferrals: 18,
    monthlyEarnings: 485.2,
    referralLink: "https://app.example.com/ref/user123456",
  });

  const [referralsList] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      joinDate: "2024-01-15",
      totalInvested: 8500.0,
      totalEarnings: 425.0,
      investments: [
        { date: "2024-01-20", amount: 2000.0, earnings: 100.0 },
        { date: "2024-03-15", amount: 3500.0, earnings: 175.0 },
        { date: "2024-06-18", amount: 3000.0, earnings: 150.0 },
      ],
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "m.chen@email.com",
      joinDate: "2024-02-08",
      totalInvested: 12000.0,
      totalEarnings: 600.0,
      investments: [
        { date: "2024-02-10", amount: 5000.0, earnings: 250.0 },
        { date: "2024-04-22", amount: 4000.0, earnings: 200.0 },
        { date: "2024-06-20", amount: 3000.0, earnings: 150.0 },
      ],
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      email: "emma.r@email.com",
      joinDate: "2024-03-12",
      totalInvested: 6200.0,
      totalEarnings: 310.0,
      investments: [
        { date: "2024-03-15", amount: 2500.0, earnings: 125.0 },
        { date: "2024-05-30", amount: 3700.0, earnings: 185.0 },
      ],
    },
    {
      id: 4,
      name: "David Park",
      email: "d.park@email.com",
      joinDate: "2024-04-05",
      totalInvested: 3800.0,
      totalEarnings: 190.0,
      investments: [
        { date: "2024-04-08", amount: 1500.0, earnings: 75.0 },
        { date: "2024-06-10", amount: 2300.0, earnings: 115.0 },
      ],
    },
    {
      id: 5,
      name: "Lisa Thompson",
      email: "lisa.t@email.com",
      joinDate: "2024-01-28",
      totalInvested: 4500.0,
      totalEarnings: 225.0,
      investments: [
        { date: "2024-02-01", amount: 2000.0, earnings: 100.0 },
        { date: "2024-02-15", amount: 2500.0, earnings: 125.0 },
      ],
    },
  ]);

  // Enhanced copy functionality
  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(dashboardData.referralLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    } catch (err) {
      console.error("Failed to copy: ", err);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = dashboardData.referralLink;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy");
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 3000);
      } catch (fallbackErr) {
        console.error("Fallback copy failed: ", fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  // Enhanced share functionality
  const shareReferralLink = async () => {
    const shareData = {
      title: "Join me on this amazing investment platform!",
      text: "I've been earning great returns on my investments. Join using my referral link and start investing today!",
      url: dashboardData.referralLink,
    };

    try {
      // Check if Web Share API is supported
      if (navigator.share) {
        await navigator.share(shareData);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
      } else {
        // Fallback: Copy to clipboard and show message
        await navigator.clipboard.writeText(
          `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`
        );
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
      }
    } catch (err) {
      if (err.name === "AbortError") {
        // User cancelled the share, don't show error
        return;
      }
      console.error("Share failed: ", err);
      setShareError("Share failed. Link copied to clipboard instead.");

      // Fallback: try to copy to clipboard
      try {
        await navigator.clipboard.writeText(dashboardData.referralLink);
        setTimeout(() => setShareError(""), 3000);
      } catch (copyErr) {
        setShareError("Share and copy both failed.");
        setTimeout(() => setShareError(""), 3000);
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredReferrals = referralsList;

  const StatCard = ({ icon: Icon, title, value, subtitle, color = "blue" }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-${color}-50`}>
          <Icon size={24} className={`text-${color}-600`} />
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm font-medium text-gray-900">{title}</p>
        {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
      </div>
    </div>
  );

  const ReferralCard = ({ referral }) => (
    <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {referral.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{referral.name}</h3>
            <p className="text-sm text-gray-500">{referral.email}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Total Invested</p>
          <p className="font-semibold text-gray-900">
            {formatCurrency(referral.totalInvested)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Your Earnings</p>
          <p className="font-semibold text-green-600">
            {formatCurrency(referral.totalEarnings)}
          </p>
        </div>
      </div>

      <div className="text-xs text-gray-500">
        <span>Joined {formatDate(referral.joinDate)}</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Referral Dashboard
          </h1>
          <p className="text-gray-600">
            Track your referrals and earnings • Earn 5% from every investment
          </p>
        </div>

        {/* Success/Error Messages */}
        {(copySuccess || shareSuccess || shareError) && (
          <div className="mb-6">
            {copySuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center space-x-2">
                <Check size={16} />
                <span>Referral link copied to clipboard!</span>
              </div>
            )}
            {shareSuccess && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg flex items-center space-x-2">
                <Check size={16} />
                <span>Successfully shared your referral link!</span>
              </div>
            )}
            {shareError && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg flex items-center space-x-2">
                <X size={16} />
                <span>{shareError}</span>
              </div>
            )}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={DollarSign}
            title="Total Earnings"
            value={formatCurrency(dashboardData.totalEarnings)}
            subtitle="All time earnings"
            color="green"
          />
          <StatCard
            icon={TrendingUp}
            title="This Month"
            value={formatCurrency(dashboardData.monthlyEarnings)}
            subtitle="Monthly earnings"
            color="blue"
          />
          <StatCard
            icon={Users}
            title="Total Referrals"
            value={dashboardData.totalReferrals}
            subtitle="People you've referred"
            color="purple"
          />
          <StatCard
            icon={Eye}
            title="Active Users"
            value={dashboardData.activeReferrals}
            subtitle="Currently investing"
            color="indigo"
          />
        </div>

        {/* Referral Link Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Your Referral Link
          </h2>
          <div className="flex items-center space-x-3">
            <div className="flex-1 bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
              <p className="text-sm text-gray-600 font-mono break-all">
                {dashboardData.referralLink}
              </p>
            </div>
            <button
              onClick={copyReferralLink}
              disabled={copySuccess}
              className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center space-x-2 min-w-[90px] justify-center ${
                copySuccess
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              }`}
            >
              {copySuccess ? <Check size={16} /> : <Copy size={16} />}
              <span>{copySuccess ? "Copied!" : "Copy"}</span>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Share this link with friends and earn 5% commission on their
            investments.
            {navigator.share
              ? " Use the share button to send via your preferred app."
              : " Copy the link to share it manually."}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Referral History
          </h2>
        </div>

        {/* Referrals Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {filteredReferrals.map((referral) => (
            <ReferralCard key={referral.id} referral={referral} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReferralTrackingPage;
