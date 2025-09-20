import React, { useState, useEffect } from "react";
import Pricing from "../components/PricingSection";
import { BASEURL } from "../utils/utils";

export default function PurchaseTokens() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  // Fetch investment window status
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(BASEURL + "/investment/investment-window-status");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (err) {
        setError(err.message || "Failed to fetch investment window status");
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (!data || data.is_open) return;

    const updateCountdown = () => {
      const now = new Date().getTime();
      const targetTime = new Date(data.window_info.opens_at).getTime();
      const difference = targetTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        // Window should be open now, refetch data
        setTimeLeft(null);
        fetch(BASEURL + "/investment/investment-window-status")
          .then(response => response.json())
          .then(result => setData(result))
          .catch(err => setError(err.message));
      }
    };

    // Update immediately
    updateCountdown();

    // Set up interval to update every second
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [data]);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading investment window status...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-md">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Investment window is open - show pricing component
  if (data && data.is_open) {
    return <Pricing />;
  }

  // Investment window is closed - show countdown
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center bg-white p-12 rounded-2xl shadow-xl max-w-2xl mx-4">
        <div className="mb-8">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Investment Window Closed</h1>
          <p className="text-gray-600 text-lg">The next investment window opens in:</p>
        </div>

        {timeLeft && (
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl">
              <div className="text-3xl font-bold">{timeLeft.days}</div>
              <div className="text-sm opacity-90">Days</div>
            </div>
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-6 rounded-xl">
              <div className="text-3xl font-bold">{timeLeft.hours}</div>
              <div className="text-sm opacity-90">Hours</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl">
              <div className="text-3xl font-bold">{timeLeft.minutes}</div>
              <div className="text-sm opacity-90">Minutes</div>
            </div>
            <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white p-6 rounded-xl">
              <div className="text-3xl font-bold">{timeLeft.seconds}</div>
              <div className="text-sm opacity-90">Seconds</div>
            </div>
          </div>
        )}

        {data?.next_window && (
          <div className="bg-gray-50 p-6 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-2">Next Investment Window</h3>
            <p className="text-gray-600 text-sm">
              Opens: {new Date(data.next_window.next_window_start).toLocaleString()}
            </p>
            <p className="text-gray-600 text-sm">
              Closes: {new Date(data.next_window.next_window_end).toLocaleString()}
            </p>
          </div>
        )}

        <div className="mt-8">
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Refresh Status
          </button>
        </div>
      </div>
    </div>
  );
}