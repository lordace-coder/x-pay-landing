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
      const fetchedVideoUrl = await onFetchVideo();

      if (fetchedVideoUrl) {
        setVideoUrl(fetchedVideoUrl);

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
    return data.video_url;
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
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Video className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Watch & Earn</h3>
            <p className="text-sm text-gray-500">
              Complete videos to earn rewards
            </p>
          </div>
        </div>
        <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
          {availableVideos} Available
        </span>
      </div>

      {/* Main Content */}
      <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 mb-6">
        <div className="text-center">
          {/* Video Count Display */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {availableVideos}
              </div>
              <div className="text-xs text-gray-500 -mt-1">Videos</div>
            </div>
          </div>

          {/* Description */}
          <h4 className="text-lg font-semibold text-gray-900 mb-2">
            Ready to Watch
          </h4>
          <p className="text-sm text-gray-600 mb-6 max-w-sm mx-auto">
            You have {availableVideos} videos waiting. Watch them to earn
            rewards and boost your investment portfolio.
          </p>

          {/* Watch Button */}
          <button
            onClick={handleWatchVideo}
            disabled={isLoading || availableVideos === 0}
            className={`font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform shadow-lg flex items-center mx-auto ${
              isLoading || availableVideos === 0
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white hover:scale-105 hover:shadow-xl"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Loading Video...
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2 fill-current" />
                Start Watching
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress Indicator */}
      {/* <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600">Daily Progress</span>
          <span className="text-gray-900 font-medium">3/5 completed</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: "60%" }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Complete 2 more videos to unlock bonus rewards
        </p>
      </div> */}

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
