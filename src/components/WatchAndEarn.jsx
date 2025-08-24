import React, { useRef, useState } from "react";
import { Play, Video, Loader2 } from "lucide-react";

// Import your VideoAdComponent here
import VideoAdComponent from "./VideoModal";
import { useAuth } from "../context/AuthContext";
import { BASEURL } from "../utils/utils";
import { toast } from "react-toastify";

const WatchEarnComponent = ({ availableVideos = 2, onRefresh }) => {
  const videoAdRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoId, setVideoId] = useState(null);
  const { authFetch } = useAuth();

  const handleWatchVideo = async () => {
    try {
      setIsLoading(true);

      // Fetch video URL from backend
      const fetchedAd = await onFetchVideo();

      if (fetchedAd) {
        setVideoUrl(fetchedAd);

        // Small delay to ensure video URL is set
        setTimeout(() => {
          if (videoAdRef.current) {
            videoAdRef.current.showAd();
          }
          setIsLoading(false);
        }, 100);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching video:", error);
      toast("Error fetching video ,Please try again", { type: "error" });
      setIsLoading(false);
    }
  };

  const handleVideoClose = () => {
    setVideoUrl(null);
  };

  const onFetchVideo = async (_) => {
    const data = await (await authFetch(BASEURL + "/videos/today")).json();
    setVideoId(data.video_id);
    return data;
  };

  const markVideoComplete = async () => {
    videoAdRef.current.hideAd();
    try {
      const req = await authFetch(
        BASEURL + `/videos/videos/${videoId}/complete`,
        { method: "post" }
      );
    } catch (error) {}

    try {
      onRefresh();
    } catch (error) {}

    toast("Earned bonus for watching video", { type: "success" });
  };
  return (
    <div className="trans_4 rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <Video className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Watch & Earn</h3>
            <p className="text-sm text-gray-500">
              Complete videos to earn rewards
            </p>
          </div>
        </div>
        <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 text-xs font-semibold px-4 py-2 rounded-full shadow-sm">
          {availableVideos} Available
        </span>
      </div>

      {/* Main Content */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-8 mb-6 border border-blue-100">
        <div className="text-center">
          {/* Video Count Display */}
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full shadow-xl mb-6 border-4 border-blue-100">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {availableVideos}
              </div>
              <div className="text-xs text-gray-500 font-medium">Videos</div>
            </div>
          </div>

          {/* Description */}
          <h4 className="text-xl font-bold text-gray-900 mb-3">
            Ready to Watch
          </h4>
          <p className="text-sm text-gray-600 mb-8 max-w-sm mx-auto leading-relaxed">
            You have {availableVideos} videos waiting. Watch them to earn
            rewards and boost your investment portfolio.
          </p>

          {/* Watch Button */}
          <button
            onClick={handleWatchVideo}
            disabled={isLoading || availableVideos === 0}
            className={`font-semibold px-10 py-4 rounded-xl transition-all duration-300 transform shadow-lg flex items-center mx-auto ${
              isLoading || availableVideos === 0
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white hover:scale-105 hover:shadow-2xl active:scale-95"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                Loading Video...
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-3 fill-current" />
                Start Watching
              </>
            )}
          </button>
        </div>
      </div>

      {/* Video Ad Component */}
      <VideoAdComponent
        ref={videoAdRef}
        videoUrl={videoUrl}
        onAdComplete={markVideoComplete}
        onAdClose={handleVideoClose}
      />
    </div>
  );
};

export default WatchEarnComponent;
