import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Eye } from 'lucide-react';

const ImagePopupAd = ({ 
  isOpen = false, 
  onClose = () => {},
  imageUrl ,
  ctaUrl = "https://example.com",
  ctaText = "Shop Now",
  alt = "Advertisement",
  openInNewTab = true,
  showOverlay = true,
  overlayPosition = "bottom", // "bottom", "top", "center"
  size = "large" // "small", "medium", "large"
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = 'hidden';
    } else {
      setIsVisible(false);
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(), 300);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleCTAClick = () => {
    if (openInNewTab) {
      window.open(ctaUrl, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = ctaUrl;
    }
    handleClose();
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'max-w-sm max-h-96';
      case 'medium':
        return 'max-w-lg max-h-[500px]';
      case 'large':
      default:
        return 'max-w-2xl max-h-[600px]';
    }
  };

  const getOverlayClasses = () => {
    switch (overlayPosition) {
      case 'top':
        return 'top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent items-start';
      case 'center':
        return 'inset-0 bg-black/50 items-center justify-center';
      case 'bottom':
      default:
        return 'bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent items-end';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isVisible ? 'opacity-60' : 'opacity-0'
        }`}
        onClick={handleBackdropClick}
      />
      
      {/* Popup Container */}
      <div 
        className={`relative transform transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        } ${getSizeClasses()}`}
      >
        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white transition-all duration-200 backdrop-blur-sm"
            aria-label="Close advertisement"
          >
            <X size={20} />
          </button>

          {/* Loading Skeleton */}
          {!imageLoaded && (
            <div className="w-full h-96 bg-gray-200 animate-pulse flex items-center justify-center">
              <Eye size={48} className="text-gray-400" />
            </div>
          )}

          {/* Main Image */}
          <div className="relative">
            <img 
              src={imageUrl} 
              alt={alt}
              className={`w-full h-auto object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onClick={handleCTAClick}
              style={{ cursor: 'pointer' }}
            />

            {/* Overlay with CTA */}
            {showOverlay && imageLoaded && (
              <div className={`absolute flex p-6 ${getOverlayClasses()}`}>
                <button
                  onClick={handleCTAClick}
                  className="group bg-white text-gray-900 px-8 py-4 rounded-full font-semibold 
                           hover:bg-gray-100 transition-all duration-200 
                           shadow-lg hover:shadow-xl transform hover:scale-105
                           flex items-center gap-3"
                >
                  <span>{ctaText}</span>
                  <ExternalLink 
                    size={18} 
                    className="transition-transform group-hover:translate-x-1" 
                  />
                </button>
              </div>
            )}

            {/* Click anywhere indicator */}
            <div className="absolute inset-0 hover:bg-black/10 transition-colors cursor-pointer" 
                 onClick={handleCTAClick}>
              <div className="absolute bottom-4 left-4 text-xs text-white/80 bg-black/30 px-2 py-1 rounded backdrop-blur-sm">
                Click anywhere to continue
              </div>
            </div>
          </div>

          {/* Bottom CTA Bar (alternative to overlay) */}
          {!showOverlay && (
            <div className="p-4 bg-gray-50 border-t">
              <button
                onClick={handleCTAClick}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 
                         rounded-lg font-semibold transition-colors flex items-center 
                         justify-center gap-2"
              >
                {ctaText}
                <ExternalLink size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ImagePopupAd;