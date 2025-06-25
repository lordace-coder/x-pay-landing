import React, { useState, useEffect } from "react";
import { X, ExternalLink, Eye } from "lucide-react";

const ImagePopupAd = ({
  isOpen = false,
  onClose = () => {},
  imageUrl = "https://res.cloudinary.com/dkicx4pdh/image/upload/v1750868772/iif1mcidxjysskypehvu.png",
  ctaUrl = "https://example.com",
  ctaText = "Check Out",
  alt = "Advertisement",
  openInNewTab = true,
  showOverlay = true,
  overlayPosition = "bottom",
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Preload image and handle body scroll
  useEffect(() => {
    let img;

    if (isOpen) {
      img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        setImageLoaded(true);
        setIsVisible(true);
        document.body.style.overflow = "hidden";
      };
    } else {
      setIsVisible(false);
      setImageLoaded(false);
      document.body.style.overflow = "auto";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, imageUrl]);

  const handleClose = () => {
    setIsVisible(false);
    document.body.style.overflow = "auto";
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) handleClose();
  };

  const handleCTAClick = () => {
    if (openInNewTab) {
      window.open(ctaUrl, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = ctaUrl;
    }
    handleClose();
  };

  const getOverlayClasses = () => {
    switch (overlayPosition) {
      case "top":
        return "top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent items-start";
      case "center":
        return "inset-0 bg-black/50 items-center justify-center";
      case "bottom":
      default:
        return "bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent items-end";
    }
  };

  if (!isOpen || !imageLoaded || !isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black opacity-60" />

      {/* Ad Container */}
      <div className="relative w-full max-w-md md:max-w-lg transform transition-all scale-100 opacity-100">
        <div className="relative rounded-xl overflow-hidden shadow-2xl bg-gray-800">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 z-20 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
            aria-label="Close advertisement"
          >
            <X size={20} />
          </button>

          {/* Aspect ratio wrapper */}
          <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
            {!imageLoaded ? (
              <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                <Eye size={48} className="text-gray-400" />
              </div>
            ) : (
              <>
                <img
                  src={imageUrl}
                  alt={alt}
                  className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300"
                  onClick={handleCTAClick}
                  style={{ cursor: "pointer" }}
                />

                {/* Overlay CTA */}
                {showOverlay && (
                  <div
                    className={`absolute flex px-4 py-3 sm:p-6 ${getOverlayClasses()}`}
                  >
                    <button
                      onClick={handleCTAClick}
                      className="group bg-white text-gray-900 px-4 py-3 sm:px-6 sm:py-4 rounded-full font-semibold 
                            hover:bg-gray-100 transition-all duration-200 
                            shadow-lg hover:shadow-xl transform hover:scale-105
                            flex items-center gap-2 text-sm sm:text-base"
                    >
                      <span>{ctaText}</span>
                      <ExternalLink
                        size={18}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePopupAd;
