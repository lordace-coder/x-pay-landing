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
  const [canClose, setCanClose] = useState(false);
  const videoRef = useRef(null);

  // Get video URL from props or use default
  const videoUrl = props.videoUrl;

  // Expose functions to parent component
  useImperativeHandle(ref, () => ({
    showAd: () => {
      openPopup();
    },
    hideAd: () => {
      if (canClose) {
        closePopup();
      }
    },
    isAdOpen: () => isPopupOpen,
    canCloseAd: () => canClose,
  }));

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      // Allow closing after 70% of video is watched
      if (video.currentTime / video.duration > 0.7) {
        setCanClose(true);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCanClose(true);
      // Call onAdComplete callback if provided
      if (props.onAdComplete) {
        props.onAdComplete();
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("ended", handleEnded);
    };
  }, [isPopupOpen, props.onAdComplete]);

  const openPopup = () => {
    setIsPopupOpen(true);
    setCanClose(false);
    setCurrentTime(0);
    // Call onAdStart callback if provided
    if (props.onAdStart) {
      props.onAdStart();
    }
    // Auto-play when popup opens
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }, 100);
  };

  const closePopup = () => {
    toast("Complete the video to earn full reward", { type: "error" });

    if (canClose) {
      setIsPopupOpen(false);
      setIsPlaying(false);
      setCurrentTime(0);
      setCanClose(false);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      // Call onAdClose callback if provided
      if (props.onAdClose) {
        props.onAdClose();
      }
    }
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
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

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <>
      {/* Video Ad Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
          <div className="bg-black rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative">
            {/* Close Button - Only enabled after 70% watched */}
            <button
              onClick={closePopup}
              className={`absolute top-3 right-3 z-20 p-2 rounded-full transition-all duration-200 ${
                canClose
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed opacity-50"
              }`}
            >
              <X size={20} />
            </button>

            {/* Video Container */}
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full h-auto max-h-[80vh] object-cover"
                onContextMenu={(e) => e.preventDefault()}
                controlsList="nodownload nofullscreen noremoteplayback"
                disablePictureInPicture
                preload="metadata"
              >
                <source src={videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Custom Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="w-full bg-gray-600 rounded-full h-1.5">
                    <div
                      className="bg-red-500 h-1.5 rounded-full transition-all duration-100"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-white mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={togglePlayPause}
                      className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors duration-200"
                    >
                      {isPlaying ? (
                        <Pause size={18} className="text-white" />
                      ) : (
                        <Play size={18} className="text-white" />
                      )}
                    </button>

                    <button
                      onClick={toggleMute}
                      className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors duration-200"
                    >
                      {isMuted ? (
                        <VolumeX size={16} className="text-white" />
                      ) : (
                        <Volume2 size={16} className="text-white" />
                      )}
                    </button>
                  </div>

                  {!canClose && (
                    <div className="text-white text-xs bg-black/50 px-2 py-1 rounded">
                      {Math.ceil((0.7 - currentTime / duration) * duration)}s
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default VideoAdComponent;
