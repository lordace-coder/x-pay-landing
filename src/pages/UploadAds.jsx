import React, { useState, useRef } from "react";
import {
  Upload,
  X,
  AlertCircle,
  CheckCircle,
  Image as ImageLucide,
  Video,
  Clock,
  RefreshCw,
} from "lucide-react";
import { BASEURL } from "../utils/utils";
import { useAuth } from "../context/AuthContext";

const AdUploadPage = () => {
  const [formData, setFormData] = useState({
    advertiser_name: "",
    ad_type: "banner",
    media_file: null,
    target_url: "",
    description: "",
  });

  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState({});
  const [fileProcessing, setFileProcessing] = useState(false);
  const [uploadHistory, setUploadHistory] = useState([]);

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const { authFetch } = useAuth();
  // File validation with detailed error messages
  const validateFile = (file) => {
    const errors = {};

    if (formData.ad_type === "banner") {
      if (!file.type.startsWith("image/")) {
        errors.file = "Banner ads must be image files (JPG, PNG, GIF, WebP)";
      } else if (file.size > 5 * 1024 * 1024) {
        errors.file = `Banner images must be under 5MB. Your file is ${formatFileSize(
          file.size
        )}`;
      }

      // Check image dimensions
      const img = new Image();
      img.onload = () => {
        if (img.width < 400 || img.height < 400) {
          setErrors((prev) => ({
            ...prev,
            file: `Image resolution too low. Minimum 400x400px required. Your image is ${img.width}x${img.height}px`,
          }));
        }
      };
      img.src = URL.createObjectURL(file);
    } else if (formData.ad_type === "video") {
      if (!file.type.startsWith("video/")) {
        errors.file = "Video ads must be video files (MP4, WebM, MOV)";
      } else if (file.size > 50 * 1024 * 1024) {
        errors.file = `Video files must be under 50MB. Your file is ${formatFileSize(
          file.size
        )}`;
      }
    }

    return errors;
  };

  // Enhanced file selection with processing state
  const handleFileSelect = async (file) => {
    setFileProcessing(true);
    setErrors({});

    // Simulate file processing delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const fileErrors = validateFile(file);

    if (Object.keys(fileErrors).length > 0) {
      setErrors(fileErrors);
      setFileProcessing(false);
      return;
    }

    setFormData((prev) => ({ ...prev, media_file: file }));

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview({
        url: e.target.result,
        type: file.type,
        name: file.name,
        size: file.size,
      });
      setFileProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  // Enhanced form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.advertiser_name.trim()) {
      newErrors.advertiser_name = "Advertiser name is required";
    } else if (formData.advertiser_name.trim().length < 2) {
      newErrors.advertiser_name =
        "Advertiser name must be at least 2 characters";
    }

    if (!formData.media_file) {
      newErrors.media_file = "Please upload a media file";
    }

    if (!formData.target_url.trim()) {
      newErrors.target_url = "Target URL is required";
    } else {
      try {
        const url = new URL(formData.target_url);
        if (!["http:", "https:"].includes(url.protocol)) {
          newErrors.target_url = "Please enter a valid HTTP/HTTPS URL";
        }
      } catch {
        newErrors.target_url =
          "Please enter a valid URL (e.g., https://example.com)";
      }
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    } else if (formData.description.trim().length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    return newErrors;
  };

  // Convert file to base64 for API
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Simulate upload progress
  const simulateUploadProgress = () => {
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          resolve();
        }
        setUploadProgress(Math.min(progress, 100));
      }, 200);
    });
  };

  // Enhanced form submission with progress tracking
  const handleSubmit = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setUploading(true);
    setUploadStatus(null);
    setUploadProgress(0);

    try {
      // Prepare FormData payload
      const formDataPayload = new FormData();
      formDataPayload.append("advertiser_name", formData.advertiser_name);
      formDataPayload.append("ad_type", formData.ad_type);
      formDataPayload.append("media_file", formData.media_file);
      formDataPayload.append("target_url", formData.target_url);
      formDataPayload.append("description", formData.description);

      // Make API call using authFetch
      console.log("Uploading ad...");
      const response = await authFetch(BASEURL + "/ads/", {
        method: "POST",
        body: formDataPayload,
      });

      if (response.ok) {
        setUploadStatus("success");
        // Add to upload history
        const newUpload = {
          id: Date.now(),
          advertiser_name: formData.advertiser_name,
          ad_type: formData.ad_type,
          timestamp: new Date(),
          status: "success",
        };
        setUploadHistory((prev) => [newUpload, ...prev].slice(0, 5));
        // Reset form
        setFormData({
          advertiser_name: "",
          ad_type: "banner",
          media_file: null,
          target_url: "",
          description: "",
        });
        setPreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        throw new Error(`Upload failed with status: ${response.status}`);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadStatus("error");
      // Add failed upload to history
      const failedUpload = {
        id: Date.now(),
        advertiser_name: formData.advertiser_name,
        ad_type: formData.ad_type,
        timestamp: new Date(),
        status: "error",
      };
      setUploadHistory((prev) => [failedUpload, ...prev].slice(0, 5));
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // Retry upload
  const retryUpload = () => {
    setUploadStatus(null);
    handleSubmit();
  };

  const removeFile = () => {
    setFormData((prev) => ({ ...prev, media_file: null }));
    setPreview(null);
    setErrors((prev) => ({ ...prev, file: null, media_file: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "short",
    }).format(date);
  };

  // Loading spinner component
  const LoadingSpinner = ({ size = 20 }) => (
    <div
      className={`inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`}
      style={{ width: size, height: size }}
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Upload Advertisement
          </h1>
          <p className="text-gray-600">
            Create and upload your banner or video advertisements
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-8">
            {/* Upload Status */}
            {uploadStatus && (
              <div
                className={`p-4 rounded-lg flex items-center gap-3 ${
                  uploadStatus === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {uploadStatus === "success" ? (
                  <>
                    <CheckCircle size={20} />
                    <span>Advertisement uploaded successfully!</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={20} />
                    <div className="flex-1">
                      <span>Failed to upload advertisement.</span>
                      <button
                        onClick={retryUpload}
                        className="ml-2 text-red-900 underline hover:no-underline font-medium inline-flex items-center gap-1"
                      >
                        <RefreshCw size={14} />
                        Try again
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Upload Progress */}
            {uploading && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-3 mb-3">
                  <LoadingSpinner size={20} />
                  <span className="font-medium text-gray-900">
                    Uploading Advertisement...
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {Math.round(uploadProgress)}% completed
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Form Fields */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold mb-4">
                    Advertisement Details
                  </h2>

                  {/* Advertiser Name */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Advertiser Name *
                    </label>
                    <input
                      type="text"
                      value={formData.advertiser_name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          advertiser_name: e.target.value,
                        }))
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                        errors.advertiser_name
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      placeholder="Enter advertiser or company name"
                    />
                    {errors.advertiser_name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.advertiser_name}
                      </p>
                    )}
                  </div>

                  {/* Ad Type */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Advertisement Type *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            ad_type: "banner",
                          }));
                          setPreview(null);
                          setFormData((prev) => ({
                            ...prev,
                            media_file: null,
                          }));
                        }}
                        className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${
                          formData.ad_type === "banner"
                            ? "border-teal-600 bg-teal-50 text-teal-700"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <ImageLucide size={24} />
                        <span className="font-medium">Banner</span>
                        <span className="text-xs text-gray-500">
                          Square popup ad
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            ad_type: "video",
                          }));
                          setPreview(null);
                          setFormData((prev) => ({
                            ...prev,
                            media_file: null,
                          }));
                        }}
                        className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${
                          formData.ad_type === "video"
                            ? "border-teal-600 bg-teal-50 text-teal-700"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Video size={24} />
                        <span className="font-medium">Video</span>
                        <span className="text-xs text-gray-500">
                          Video advertisement
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Target URL */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target URL *
                    </label>
                    <input
                      type="url"
                      value={formData.target_url}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          target_url: e.target.value,
                        }))
                      }
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                        errors.target_url ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="https://example.com"
                    />
                    {errors.target_url && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.target_url}
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description * ({formData.description.length}/500)
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                      rows={4}
                      maxLength={500}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
                        errors.description
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      placeholder="Describe your advertisement (minimum 10 characters)..."
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - File Upload */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold mb-4">
                    Upload{" "}
                    {formData.ad_type === "banner"
                      ? "Banner Image"
                      : "Video File"}
                  </h2>

                  {fileProcessing ? (
                    /* Processing State */
                    <div className="border-2 border-dashed border-teal-300 bg-teal-50 rounded-lg p-8 text-center">
                      <div className="space-y-4">
                        <div className="mx-auto w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
                          <LoadingSpinner size={24} />
                        </div>
                        <p className="text-lg font-medium text-teal-700">
                          Processing file...
                        </p>
                      </div>
                    </div>
                  ) : !preview ? (
                    /* Upload Area */
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        dragActive
                          ? "border-teal-500 bg-teal-50"
                          : errors.media_file || errors.file
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <div className="space-y-4">
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          {formData.ad_type === "banner" ? (
                            <ImageLucide size={24} className="text-gray-400" />
                          ) : (
                            <Video size={24} className="text-gray-400" />
                          )}
                        </div>

                        <div>
                          <p className="text-lg font-medium text-gray-700">
                            Drop your {formData.ad_type} here, or{" "}
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="text-teal-600 hover:text-teal-700 underline"
                            >
                              browse
                            </button>
                          </p>

                          <p className="text-sm text-gray-500 mt-2">
                            {formData.ad_type === "banner"
                              ? "JPG, PNG, GIF, WebP up to 5MB (Minimum 400x400px)"
                              : "MP4, WebM, MOV up to 50MB (Keep under 30 seconds)"}
                          </p>
                        </div>
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept={
                          formData.ad_type === "banner" ? "image/*" : "video/*"
                        }
                        onChange={handleFileInputChange}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    /* Preview Area */
                    <div className="space-y-4">
                      <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                        {preview.type.startsWith("image/") ? (
                          <img
                            src={preview.url}
                            alt="Preview"
                            className="w-full h-64 object-contain"
                          />
                        ) : (
                          <video
                            ref={videoRef}
                            src={preview.url}
                            className="w-full h-64 object-contain"
                            controls
                          />
                        )}

                        <button
                          type="button"
                          onClick={removeFile}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span className="truncate">{preview.name}</span>
                        <span>{formatFileSize(preview.size)}</span>
                      </div>
                    </div>
                  )}

                  {(errors.media_file || errors.file) && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.media_file || errors.file}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={uploading || fileProcessing}
                className={`px-8 py-3 rounded-lg font-semibold text-white transition-all ${
                  uploading || fileProcessing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-teal-600 hover:bg-teal-700 hover:shadow-lg transform hover:scale-105"
                }`}
              >
                {uploading ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size={18} />
                    Uploading...
                  </div>
                ) : fileProcessing ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size={18} />
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Upload size={18} />
                    Upload Advertisement
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Sidebar - Upload History */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock size={18} />
                Recent Uploads
              </h3>

              {uploadHistory.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Upload size={20} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm">No recent uploads</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {uploadHistory.map((upload) => (
                    <div
                      key={upload.id}
                      className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {upload.status === "success" ? (
                          <CheckCircle
                            size={14}
                            className="text-green-600 flex-shrink-0"
                          />
                        ) : (
                          <AlertCircle
                            size={14}
                            className="text-red-600 flex-shrink-0"
                          />
                        )}
                        <span className="text-sm font-medium truncate">
                          {upload.advertiser_name}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 flex items-center justify-between">
                        <span className="capitalize flex items-center gap-1">
                          {upload.ad_type === "banner" ? (
                            <ImageLucide size={12} />
                          ) : (
                            <Video size={12} />
                          )}
                          {upload.ad_type}
                        </span>
                        <span>{formatTime(upload.timestamp)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Guidelines */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">
            Advertisement Guidelines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <ImageLucide size={16} className="text-teal-600" />
                Banner Ads
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Square format (1:1 ratio) works best for popups</li>
                <li>• Minimum resolution: 400x400px</li>
                <li>• Keep text clear and readable</li>
                <li>• Include clear call-to-action</li>
                <li>• Avoid too much text</li>
                <li>• Use high-quality, professional images</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                <Video size={16} className="text-teal-600" />
                Video Ads
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Keep videos under 30 seconds</li>
                <li>• Include captions for accessibility</li>
                <li>• Ensure good video quality (HD preferred)</li>
                <li>• Clear audio (if applicable)</li>
                <li>• Strong opening to grab attention</li>
                <li>• End with clear call-to-action</li>
              </ul>
            </div>
          </div>

          {/* Additional Tips */}
          <div className="mt-6 p-4 bg-teal-50 rounded-lg border-l-4 border-teal-600">
            <h4 className="font-medium text-teal-900 mb-2">💡 Pro Tips</h4>
            <ul className="text-sm text-teal-800 space-y-1">
              <li>• Test your ads on different devices before uploading</li>
              <li>• Use contrasting colors to make your ads stand out</li>
              <li>• Keep your message simple and focused</li>
              <li>• Include your brand logo for recognition</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdUploadPage;
