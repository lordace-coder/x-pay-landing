import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { X, Play, Pause, Volume2, VolumeX } from "lucide-react";
import { toast } from "react-toastify";

const VideoAdComponent = forwardRef((props, ref) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [watchedPercentage, setWatchedPercentage] = useState(0);
  const videoRef = useRef(null);

  // Get video URL from props or use default
  const videoUrl = props.videoUrl?.url;
  const actionUrl = props.videoUrl?.action_url;
  console.log("Video URL in VideoAdComponent:", videoUrl);
  // Set video source when videoUrl changes
  useEffect(() => {
    if (videoRef.current && videoUrl) {
      console.log("VideoURL changed:", videoUrl);
      setVideoError(false);
      videoRef.current.src = videoUrl;
      videoRef.current.load();
    }
  }, [videoUrl]);

  // Attach event listeners when popup is open
  useEffect(() => {
    if (!isPopupOpen) return;

    const video = videoRef.current;
    if (!video) {
      console.warn("Video ref not available when popup opened");
      return;
    }

    console.log("Attaching video event listeners");

    const handleTimeUpdate = () => {
      const currentTime = video.currentTime;
      const duration = video.duration;

      if (currentTime % 5 < 0.5) { // Log every ~5 seconds
        console.log("Time update - Current:", currentTime.toFixed(2), "Duration:", duration.toFixed(2));
      }

      setCurrentTime(currentTime);

      if (duration > 0) {
        const percentage = currentTime / duration;
        setWatchedPercentage(percentage);
      }
    };

    const handleLoadedMetadata = () => {
      console.log("Video metadata loaded. Duration:", video.duration);
      setDuration(video.duration);
      setVideoError(false);
    };

    const handleLoadedData = () => {
      console.log("Video data loaded and ready");
    };

    const handleError = (e) => {
      console.error("Video error occurred:", e);
      console.error("Video src:", video.src);
      console.error("Video error details:", video.error);
      setIsLoading(false);
      setVideoError(true);
      toast("Error loading video ad", { type: "error" });
    };

    const handlePlaying = () => {
      console.log("Video is playing");
      setIsLoading(false);
      setIsPlaying(true);
    };

    const handlePause = () => {
      console.log("Video paused");
      setIsPlaying(false);
    };

    const handleWaiting = () => {
      console.log("Video is buffering");
      setIsLoading(true);
    };

    const handleEnded = () => {
      console.log("Video ended");
      setIsPlaying(false);
      setWatchedPercentage(1);
      // Call onAdComplete callback if provided
      if (props.onAdComplete) {
        props.onAdComplete();
      }
      toast("Ad completed! You can now close it.", { type: "success" });
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("error", handleError);
    video.addEventListener("playing", handlePlaying);
    video.addEventListener("pause", handlePause);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("ended", handleEnded);

    return () => {
      console.log("Removing video event listeners");
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("error", handleError);
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("ended", handleEnded);
    };
  }, [isPopupOpen, props.onAdComplete]);

  const openPopup = () => {
    if (!videoUrl) {
      console.error("No video URL provided");
      toast("No video URL provided", { type: "error" });
      return;
    }

    console.log("Opening video popup with URL:", videoUrl);
    setIsPopupOpen(true);
    setCurrentTime(0);
    setWatchedPercentage(0);
    setVideoError(false);
    setIsLoading(false);

    // Call onAdStart callback if provided
    if (props.onAdStart) {
      props.onAdStart();
    }

    // Wait for the video element to be rendered, then load and play
    setTimeout(() => {
      if (!videoRef.current) {
        console.warn("Video ref not available");
        return;
      }

      const video = videoRef.current;
      console.log("Video element ready. Current src:", video.src);
      console.log("Video ready state:", video.readyState);

      // Ensure the video has the correct source
      if (!video.src || video.src !== videoUrl) {
        console.log("Setting video source in openPopup:", videoUrl);
        video.src = videoUrl;
        video.load();
      }

      // Play the video once it's ready
      const attemptPlay = () => {
        video.currentTime = 0;
        console.log("Attempting to play. Ready state:", video.readyState);

        const playPromise = video.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("Video playing successfully");
              setIsPlaying(true);
            })
            .catch((error) => {
              console.warn("Auto-play prevented:", error);
              setIsPlaying(false);
            });
        }
      };

      // If video is ready, play immediately
      if (video.readyState >= 3) {
        attemptPlay();
      } else {
        // Wait for canplay event
        video.addEventListener('canplay', attemptPlay, { once: true });
      }
    }, 200);
  };

  const canClose = watchedPercentage >= 0.7; // Can close after watching 70%

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    showAd: openPopup,
    hideAd: closePopup,
  }));

  const closePopup = () => {
    if (!canClose) {
      const remainingTime = Math.ceil((0.7 - watchedPercentage) * duration);
      toast(`Watch ${remainingTime} more seconds to close`, {
        type: "warning",
      });
      return;
    }

    setIsPopupOpen(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setWatchedPercentage(0);

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    // Call onAdClose callback if provided
    if (props.onAdClose) {
      props.onAdClose();
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.warn("Play failed:", error);
            toast("Unable to play video", { type: "error" });
          });
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVideoClick = () => {
    if (actionUrl) {
      // Open action URL in new tab when video is clicked
      window.open(actionUrl, "_blank", "noopener,noreferrer");

      // Track click if callback provided
      if (props.onAdClick) {
        props.onAdClick(actionUrl);
      }

      toast("Redirecting to advertiser...", { type: "info" });
    }
  };

  const formatTime = (time) => {
    if (!isFinite(time) || time < 0) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  if (!isPopupOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/95 flex items-center justify-center z-[9999] p-2 sm:p-4"
      onClick={(e) => {
        // Close if clicking backdrop and can close
        if (e.target === e.currentTarget && canClose) {
          closePopup();
        }
      }}
    >
      <div className="bg-black rounded-lg shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={closePopup}
          className={`absolute top-2 right-2 z-30 p-2 rounded-full transition-all duration-200 ${
            canClose
              ? "bg-red-600 hover:bg-red-700 text-white shadow-lg"
              : "bg-gray-600 text-gray-400 cursor-not-allowed opacity-50"
          }`}
          title={
            canClose
              ? "Close ad"
              : `Watch ${Math.ceil(
                  (0.7 - watchedPercentage) * duration
                )}s more to close`
          }
        >
          <X size={20} />
        </button>

        {/* Progress indicator in top-right */}
        {!canClose && (
          <div className="absolute top-2 left-2 z-30 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
            {Math.ceil((0.7 - watchedPercentage) * duration)}s remaining
          </div>
        )}

        {/* Video Container */}
        <div className="relative bg-black">
          {/* Buffering Spinner */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                <div className="text-white text-sm mt-2">Buffering...</div>
              </div>
            </div>
          )}

          {/* Error State */}
          {videoError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
              <div className="text-white text-center">
                <div className="text-xl mb-2">⚠️</div>
                <div>Failed to load video</div>
                <button
                  onClick={() => {
                    setVideoError(false);
                    if (videoRef.current) {
                      videoRef.current.load();
                    }
                  }}
                  className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          <video
            ref={videoRef}
            className="w-full h-auto max-h-[85vh] object-contain cursor-pointer"
            onClick={handleVideoClick}
            onContextMenu={(e) => e.preventDefault()}
            controlsList="nodownload nofullscreen noremoteplayback"
            disablePictureInPicture
            preload="auto"
            playsInline
            style={{ maxHeight: "calc(100vh - 120px)" }}
          >
            Your browser does not support the video tag.
          </video>

          {/* Click to visit overlay */}
          {actionUrl && (
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                         bg-black/60 text-white px-4 py-2 rounded-lg opacity-0 hover:opacity-100 
                         transition-opacity duration-300 pointer-events-none text-sm"
            >
              Click to visit advertiser
            </div>
          )}

          {/* Custom Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 sm:p-4">
            {/* Progress Bar */}
            <div className="mb-3">
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full transition-all duration-100"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-white mt-1">
                <span>{formatTime(currentTime)}</span>
                <span className="text-gray-300">
                  {Math.round(watchedPercentage * 100)}% watched
                </span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <button
                  onClick={togglePlayPause}
                  disabled={isLoading || videoError}
                  className="bg-white/20 hover:bg-white/30 disabled:bg-gray-600 disabled:cursor-not-allowed 
                           p-2 rounded-full transition-colors duration-200"
                >
                  {isPlaying ? (
                    <Pause size={18} className="text-white" />
                  ) : (
                    <Play size={18} className="text-white" />
                  )}
                </button>

                <button
                  onClick={toggleMute}
                  disabled={isLoading || videoError}
                  className="bg-white/20 hover:bg-white/30 disabled:bg-gray-600 disabled:cursor-not-allowed 
                           p-2 rounded-full transition-colors duration-200"
                >
                  {isMuted ? (
                    <VolumeX size={16} className="text-white" />
                  ) : (
                    <Volume2 size={16} className="text-white" />
                  )}
                </button>

                {actionUrl && (
                  <button
                    onClick={handleVideoClick}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 
                             rounded text-sm transition-colors duration-200"
                  >
                    Visit Site
                  </button>
                )}
              </div>

              {canClose && (
                <div className="text-green-400 text-xs bg-green-900/50 px-2 py-1 rounded">
                  Can close now!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

VideoAdComponent.displayName = "VideoAdComponent";
export default VideoAdComponent