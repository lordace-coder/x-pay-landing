import React, { useState, useRef } from "react";
import {
  Upload,
  X,
  Play,
  Eye,
  AlertCircle,
  CheckCircle,
  Image,
  Video,
} from "lucide-react";

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
  const [errors, setErrors] = useState({});

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  // File validation
  const validateFile = (file) => {
    const errors = {};

    if (formData.ad_type === "banner") {
      // Banner validation
      if (!file.type.startsWith("image/")) {
        errors.file = "Banner ads must be image files (JPG, PNG, GIF, WebP)";
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB
        errors.file = "Banner images must be under 5MB";
      }
    } else if (formData.ad_type === "video") {
      // Video validation
      if (!file.type.startsWith("video/")) {
        errors.file = "Video ads must be video files (MP4, WebM, MOV)";
      }
      if (file.size > 50 * 1024 * 1024) {
        // 50MB
        errors.file = "Video files must be under 50MB";
      }
    }

    return errors;
  };

  // Handle file selection
  const handleFileSelect = (file) => {
    const fileErrors = validateFile(file);

    if (Object.keys(fileErrors).length > 0) {
      setErrors(fileErrors);
      return;
    }

    setErrors({});
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

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.advertiser_name.trim()) {
      newErrors.advertiser_name = "Advertiser name is required";
    }

    if (!formData.media_file) {
      newErrors.media_file = "Please upload a media file";
    }

    if (!formData.target_url.trim()) {
      newErrors.target_url = "Target URL is required";
    } else {
      try {
        new URL(formData.target_url);
      } catch {
        newErrors.target_url = "Please enter a valid URL";
      }
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
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

  // Handle form submission
  const handleSubmit = async () => {
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setUploading(true);
    setUploadStatus(null);

    try {
      // Convert file to base64
      const mediaData = await fileToBase64(formData.media_file);

      // Prepare API payload
      const payload = {
        advertiser_name: formData.advertiser_name,
        ad_type: formData.ad_type,
        media_url: mediaData, // Base64 data
        target_url: formData.target_url,
        description: formData.description,
      };

      // Simulate API call
      console.log("Uploading ad:", payload);

      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setUploadStatus("success");

      // Reset form
      setFormData({
        advertiser_name: "",
        ad_type: "banner",
        media_file: null,
        target_url: "",
        description: "",
      });
      setPreview(null);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadStatus("error");
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFormData((prev) => ({ ...prev, media_file: null }));
    setPreview(null);
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Upload Advertisement
          </h1>
          <p className="text-gray-600">
            Create and upload your banner or video advertisements
          </p>
        </div>

        {/* Upload Status */}
        {uploadStatus && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
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
                <span>Failed to upload advertisement. Please try again.</span>
              </>
            )}
          </div>
        )}

        <div className="space-y-8">
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
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.advertiser_name
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter advertiser or company name"
                  />
                  {errors.advertiser_name && (
                    <p className="mt-1 text-sm text-red-600">
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
                        setFormData((prev) => ({ ...prev, ad_type: "banner" }));
                        setPreview(null);
                        setFormData((prev) => ({ ...prev, media_file: null }));
                      }}
                      className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${
                        formData.ad_type === "banner"
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Image size={24} />
                      <span className="font-medium">Banner</span>
                      <span className="text-xs text-gray-500">
                        Square popup ad
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, ad_type: "video" }));
                        setPreview(null);
                        setFormData((prev) => ({ ...prev, media_file: null }));
                      }}
                      className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${
                        formData.ad_type === "video"
                          ? "border-blue-500 bg-blue-50 text-blue-700"
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
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.target_url ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="https://example.com"
                  />
                  {errors.target_url && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.target_url}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
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
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.description ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="Describe your advertisement..."
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600">
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

                {!preview ? (
                  /* Upload Area */
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive
                        ? "border-blue-500 bg-blue-50"
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
                          <Image size={24} className="text-gray-400" />
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
                            className="text-blue-600 hover:text-blue-700 underline"
                          >
                            browse
                          </button>
                        </p>

                        <p className="text-sm text-gray-500 mt-2">
                          {formData.ad_type === "banner"
                            ? "JPG, PNG, GIF, WebP up to 5MB (Square format recommended)"
                            : "MP4, WebM, MOV up to 50MB"}
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
                  <p className="mt-2 text-sm text-red-600">
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
              disabled={uploading}
              className={`px-8 py-3 rounded-lg font-semibold text-white transition-all ${
                uploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
              }`}
            >
              {uploading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Uploading...
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

        {/* Guidelines */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">
            Advertisement Guidelines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Banner Ads</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Square format (1:1 ratio) works best for popups</li>
                <li>• Minimum resolution: 400x400px</li>
                <li>• Keep text clear and readable</li>
                <li>• Include clear call-to-action</li>
                <li>• Avoid too much text</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Video Ads</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Keep videos under 30 seconds</li>
                <li>• Include captions for accessibility</li>
                <li>• Ensure good video quality</li>
                <li>• Clear audio (if applicable)</li>
                <li>• Strong opening to grab attention</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdUploadPage;
