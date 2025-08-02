import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  Calendar,
  Package,
  TrendingUp,
  AlertCircle,
  Filter,
  Search,
  RefreshCw,
  Download,
  Eye,
  RotateCcw,
  Star,
  Target,
  Activity,
  Wallet,
  History,
  Trophy,
  Loader,
  FileText,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BASEURL } from "../utils/utils";

export default function WithdrawalHistory() {
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { authFetch } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWithdrawalHistory();
  }, []);

  const fetchWithdrawalHistory = async () => {
    try {
      setLoading(true);
      const response = await authFetch(`${BASEURL}/batch-withdrawals/`);
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setWithdrawalRequests(data);
      } else {
        setWithdrawalRequests([]);
      }
    } catch (error) {
      console.error("Error fetching withdrawal history:", error);
      toast.error("Failed to load withdrawal history");
      setWithdrawalRequests([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter requests based on active tab and search
  const filteredRequests = withdrawalRequests.filter(request => {
    const matchesTab = activeTab === 'all' || request.status === activeTab;
    const matchesSearch = searchTerm === '' || 
      request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.batch_id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Calculate summary statistics
  const summaryStats = {
    totalRequests: withdrawalRequests.length,
    totalApproved: withdrawalRequests.filter(r => r.status === 'accepted').length,
    totalPending: withdrawalRequests.filter(r => r.status === 'pending').length,
    totalDenied: withdrawalRequests.filter(r => r.status === 'denied').length,
    totalWithdrawnAmount: withdrawalRequests
      .filter(r => r.status === 'accepted')
      .reduce((sum, r) => sum + (r.amount || 0), 0),
    totalPendingAmount: withdrawalRequests
      .filter(r => r.status === 'pending')
      .reduce((sum, r) => sum + (r.amount || 0), 0),
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'pending':
        return {
          color: 'orange',
          bgClass: 'bg-orange-100 text-orange-800 border-orange-200',
          icon: Clock,
          label: 'Pending Review',
          description: 'Your request is being reviewed by our team'
        };
      case 'accepted':
        return {
          color: 'green',
          bgClass: 'bg-green-100 text-green-800 border-green-200',
          icon: CheckCircle,
          label: 'Approved & Paid',
          description: 'Your withdrawal has been processed successfully'
        };
      case 'denied':
        return {
          color: 'red',
          bgClass: 'bg-red-100 text-red-800 border-red-200',
          icon: XCircle,
          label: 'Declined',
          description: 'Your request was declined'
        };
      default:
        return {
          color: 'gray',
          bgClass: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: AlertCircle,
          label: status,
          description: 'Status unknown'
        };
    }
  };

  const RequestCard = ({ request }) => {
    const statusConfig = getStatusConfig(request.status);
    const StatusIcon = statusConfig.icon;
    
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              statusConfig.color === 'orange' ? 'bg-orange-100' :
              statusConfig.color === 'green' ? 'bg-green-100' :
              statusConfig.color === 'red' ? 'bg-red-100' : 'bg-gray-100'
            }`}>
              <StatusIcon className={`h-5 w-5 ${
                statusConfig.color === 'orange' ? 'text-orange-600' :
                statusConfig.color === 'green' ? 'text-green-600' :
                statusConfig.color === 'red' ? 'text-red-600' : 'text-gray-600'
              }`} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                Withdrawal Request
              </h3>
              <p className="text-sm text-gray-500">
                ID: {request.id.slice(0, 8)}...
              </p>
            </div>
          </div>
          
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.bgClass}`}>
            <StatusIcon className="h-4 w-4 mr-1" />
            {statusConfig.label}
          </div>
        </div>

        {/* Amount Section */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <span className="text-gray-600 text-sm block">Investment</span>
              <div className="font-bold text-gray-900">
                ${request.invested_amount?.toFixed(2) || 'N/A'}
              </div>
            </div>
            <div>
              <span className="text-gray-600 text-sm block">Interest Earned</span>
              <div className="font-bold text-green-600 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                ${request.interest_amount?.toFixed(2) || 'N/A'}
              </div>
            </div>
            <div>
              <span className="text-gray-600 text-sm block">Total Amount</span>
              <div className="font-bold text-xl text-gray-900 flex items-center">
                <DollarSign className="h-5 w-5 text-green-600 mr-1" />
                {request.amount?.toFixed(2) || 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-4">
          <div className="flex items-center space-x-2">
            <Package className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">Batch:</span>
            <span className="font-mono text-gray-900">
              {request.batch_id?.slice(0, 8)}...
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">Submitted:</span>
            <span className="text-gray-900">
              {new Date(request.created_at).toLocaleDateString()}
            </span>
          </div>
          {request.processed_at && (
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">Processed:</span>
              <span className="text-gray-900">
                {new Date(request.processed_at).toLocaleDateString()}
              </span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Wallet className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">Wallet:</span>
            <span className="font-mono text-gray-900 text-xs">
              {request.usdt_wallet_address?.slice(0, 6)}...{request.usdt_wallet_address?.slice(-4)}
            </span>
          </div>
        </div>

        {/* Status-specific content */}
        {request.status === 'denied' && request.admin_notes && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2 mb-1">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="font-medium text-red-800 text-sm">Reason for Decline</span>
            </div>
            <p className="text-red-700 text-sm">{request.admin_notes}</p>
          </div>
        )}

        {request.status === 'accepted' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2 mb-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800 text-sm">Payment Processed</span>
            </div>
            <p className="text-green-700 text-sm">
              Your withdrawal has been successfully processed and sent to your wallet.
            </p>
            {request.admin_notes && (
              <p className="text-green-600 text-sm mt-1">
                Note: {request.admin_notes}
              </p>
            )}
          </div>
        )}

        {request.status === 'pending' && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
            <div className="flex items-center space-x-2 mb-1">
              <Clock className="h-4 w-4 text-orange-600" />
              <span className="font-medium text-orange-800 text-sm">Processing</span>
            </div>
            <p className="text-orange-700 text-sm">
              Your request is being reviewed. Processing typically takes 1-3 business days.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          {request.status === 'denied' && (
            <button
              onClick={() => navigate(`/withdrawal?batch=${request.batch_id}`)}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Resubmit Request</span>
            </button>
          )}
          <button
            onClick={() => {/* Could expand to show more details */}}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            <Eye className="h-4 w-4" />
            <span>View Details</span>
          </button>
        </div>
      </div>
    );
  };

  const tabs = [
    { key: 'all', label: 'All Requests', count: summaryStats.totalRequests },
    { key: 'pending', label: 'Pending', count: summaryStats.totalPending },
    { key: 'accepted', label: 'Approved', count: summaryStats.totalApproved },
    { key: 'denied', label: 'Declined', count: summaryStats.totalDenied },
  ];

  return (
    <div className="min-h-screen bg-gray-50 lg:pl-16">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 pt-6 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors mr-4"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <History className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Withdrawal History</h1>
                <p className="text-sm text-gray-500">Track all your withdrawal requests</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading withdrawal history...</p>
            </div>
          </div>
        ) : withdrawalRequests.length === 0 ? (
          <div className="text-center py-16">
            <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <FileText className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No Withdrawal History
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven't made any withdrawal requests yet. Complete your investment batches to start withdrawing your earnings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2 justify-center"
              >
                <Trophy className="h-4 w-4" />
                <span>View Dashboard</span>
              </button>
              <button
                onClick={() => navigate('/withdrawal')}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center space-x-2 justify-center"
              >
                <Download className="h-4 w-4" />
                <span>New Withdrawal</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Activity className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-500">Total Requests</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {summaryStats.totalRequests}
                </div>
                <p className="text-xs text-blue-600 mt-1">All time</p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-500">Total Withdrawn</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  ${summaryStats.totalWithdrawnAmount.toFixed(2)}
                </div>
                <p className="text-xs text-green-600 mt-1">
                  {summaryStats.totalApproved} approved
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <span className="text-sm text-gray-500">Pending Amount</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  ${summaryStats.totalPendingAmount.toFixed(2)}
                </div>
                <p className="text-xs text-orange-600 mt-1">
                  {summaryStats.totalPending} pending
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Target className="h-6 w-6 text-purple-600" />
                  </div>
                  <span className="text-sm text-gray-500">Success Rate</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {summaryStats.totalRequests > 0 
                    ? Math.round((summaryStats.totalApproved / summaryStats.totalRequests) * 100)
                    : 0}%
                </div>
                <p className="text-xs text-purple-600 mt-1">
                  Approval rate
                </p>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 mb-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                {/* Tabs */}
                <div className="flex flex-wrap gap-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                        activeTab === tab.key
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span>{tab.label}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        activeTab === tab.key
                          ? 'bg-blue-200 text-blue-800'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by ID or batch..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full md:w-64"
                  />
                </div>
              </div>
            </div>

            {/* Withdrawal Requests */}
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <Filter className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Results Found
                </h3>
                <p className="text-gray-600">
                  No withdrawal requests match your current filters.
                </p>
                <button
                  onClick={() => {
                    setActiveTab('all');
                    setSearchTerm('');
                  }}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredRequests.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))}
              </div>
            )}

            {/* Refresh Button */}
            <div className="text-center mt-8">
              <button
                onClick={fetchWithdrawalHistory}
                disabled={loading}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh History</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}