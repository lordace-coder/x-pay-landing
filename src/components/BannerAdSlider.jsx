import React, { useState, useEffect, useCallback } from "react";
import {
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
} from "lucide-react";
import { BASEURL } from "../utils/utils";

// Internal configuration - can be overridden via props if needed
const BannerAdSlider = ({
  apiUrl = BASEURL + "/ads/random-banners", // Replace with your actual BASEURL
  adsCount = 4,
  autoSlide = true,
  slideInterval = 5000,
  showControls = false, // Disabled controls
  showIndicators = true,
  openInNewTab = true,
  height = "300px",
  maxHeight = "400px",
  className = "w-full md:w-[70] px-4 py-3 trans_1",
  containerClassName = "max-w-4xl mx-auto shadow-md",
  maintainAspectRatio = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoSlide);
  const [imageLoaded, setImageLoaded] = useState({});
  const [imageDimensions, setImageDimensions] = useState({});
  const [fetchedAds, setFetchedAds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Use only fetched ads
  const activeAds = fetchedAds;

  // Fetch ads from API
  const fetchAds = useCallback(async () => {
    if (!apiUrl || apiUrl === "YOUR_BASEURL_HERE/ads/random-banners") {
      console.warn(
        "Please update the apiUrl in BannerAdSlider component with your actual API URL"
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}?count=${adsCount}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ads: ${response.status}`);
      }
      const data = await response.json();
      setFetchedAds(data);
      console.log("Banner ads loaded:", data.length);
    } catch (err) {
      console.error("Failed to fetch ads:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [apiUrl, adsCount]);

  // Initial fetch on mount
  useEffect(() => {
    fetchAds();
  }, [fetchAds]);

  // Preload images and get their dimensions
  useEffect(() => {
    activeAds.forEach((ad) => {
      const img = new Image();
      img.src = ad.media_url;
      img.onload = () => {
        setImageLoaded((prev) => ({ ...prev, [ad.id]: true }));
        setImageDimensions((prev) => ({
          ...prev,
          [ad.id]: { width: img.naturalWidth, height: img.naturalHeight },
        }));
      };
      img.onerror = () => {
        console.error(`Failed to load image: ${ad.media_url}`);
      };
    });
  }, [activeAds]);

  // Auto slide functionality
  useEffect(() => {
    if (!isPlaying || activeAds.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === activeAds.length - 1 ? 0 : prevIndex + 1
      );
    }, slideInterval);

    return () => clearInterval(interval);
  }, [isPlaying, slideInterval, activeAds.length]);

  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? activeAds.length - 1 : prevIndex - 1
    );
  }, [activeAds.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === activeAds.length - 1 ? 0 : prevIndex + 1
    );
  }, [activeAds.length]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleCTAClick = (ad) => {
    if (openInNewTab) {
      window.open(ad.target_url, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = ad.target_url;
    }
  };

  if (!activeAds || activeAds.length === 0) return null;

  const currentAd = activeAds[currentIndex];

  // Calculate container style with controlled dimensions
  const getContainerStyle = () => {
    const baseHeight = height === "auto" ? "200px" : height;
    const maxHeightValue = maxHeight || "250px";

    if (!maintainAspectRatio) {
      return {
        height: baseHeight,
        maxHeight: maxHeightValue,
      };
    }

    // Limit aspect ratio to prevent extreme dimensions
    if (currentAd && imageDimensions[currentAd.id]) {
      const { width, height: imgHeight } = imageDimensions[currentAd.id];
      let aspectRatio = width / imgHeight;

      // Constrain aspect ratio to reasonable bounds
      aspectRatio = Math.max(1.5, Math.min(3.5, aspectRatio)); // Between 1.5:1 and 3.5:1

      return {
        height: baseHeight,
        maxHeight: maxHeightValue,
        aspectRatio: aspectRatio.toString(),
      };
    }

    return {
      height: baseHeight,
      maxHeight: maxHeightValue,
    };
  };

  return (
    <div className={className}>
      <div
        className={`relative w-full bg-gray-50 rounded-lg overflow-hidden shadow-lg ${containerClassName}`}
        style={getContainerStyle()}
      >
        {/* Main Banner Container */}
        <div className="relative w-full h-full max-h-[350px] overflow-hidden">
          {/* Image Slider */}
          <div className="relative w-full h-full overflow-hidden">
            {activeAds.map((ad, index) => (
              <div
                key={ad.id}
                className={`absolute inset-0 w-full h-full transition-transform duration-500 ease-in-out ${
                  index === currentIndex
                    ? "translate-x-0"
                    : index < currentIndex
                    ? "-translate-x-full"
                    : "translate-x-full"
                }`}
              >
                {imageLoaded[ad.id] ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50 p-2">
                    <img
                      src={ad.media_url}
                      alt={ad.title || `Advertisement ${ad.id}`}
                      className="max-w-full max-h-full object-contain cursor-pointer hover:scale-105 transition-transform duration-300 rounded"
                      onClick={() => handleCTAClick(ad)}
                      style={{
                        maxWidth: "100%",
                        maxHeight: "100%",
                        height: "auto",
                        width: "auto",
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                    <div className="text-gray-400">Loading image...</div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Gradient Overlay for CTA */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/50 pointer-events-none" />

          {/* CTA Button */}
          {currentAd && (
            <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2">
              <button
                onClick={() => handleCTAClick(currentAd)}
                className="group bg-white/90 hover:bg-white text-gray-800 
                          px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-full 
                          font-medium text-[10px] sm:text-xs
                          hover:shadow-sm transition-all duration-200 
                          flex items-center gap-1"
              >
                <span>{currentAd.cta_text || "Learn More"}</span>
                <ExternalLink
                  size={10}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </button>
            </div>
          )}

          {/* Navigation Controls */}
          {showControls && activeAds.length > 1 && (
            <>
              {/* Previous Button */}
              <button
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-colors"
                aria-label="Previous ad"
              >
                <ChevronLeft size={20} />
              </button>

              {/* Next Button */}
              <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-colors"
                aria-label="Next ad"
              >
                <ChevronRight size={20} />
              </button>

              {/* Play/Pause Button */}
              {autoSlide && (
                <button
                  onClick={togglePlayPause}
                  className="absolute top-4 left-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-colors"
                  aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>
              )}
            </>
          )}

          {/* Indicators */}
          {showIndicators && activeAds.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {activeAds.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentIndex
                      ? "bg-white w-6"
                      : "bg-white/50 hover:bg-white/70"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Progress Bar (optional) */}
          {isPlaying && activeAds.length > 1 && (
            <div className="absolute bottom-0 left-0 w-full h-1 bg-black/20">
              <div
                className="h-full bg-white transition-all duration-100 ease-linear"
                style={{
                  width: `${
                    ((Date.now() % slideInterval) / slideInterval) * 100
                  }%`,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BannerAdSlider;
