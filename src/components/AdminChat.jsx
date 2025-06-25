import React, { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  X,
  Send,
  Copy,
  Check,
  Minimize2,
  Maximize2,
  User,
  Shield,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { BASEURL } from "../utils/utils";

const AdminChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { authFetch } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [messages, isOpen, isMinimized]);

  const openChat = () => {
    setIsOpen(true);
    setIsMinimized(false);
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: message,
        isAdmin: false,
        timestamp: new Date(),
        copied: false,
      };
      setMessages([...messages, newMessage]);
      setMessage("");

      // Simulate admin response
      setTimeout(() => {
        const adminResponse = {
          id: messages.length + 2,
          text: "Thanks for your message! I'll get back to you shortly.",
          isAdmin: true,
          timestamp: new Date(),
          copied: false,
        };
        setMessages((prev) => [...prev, adminResponse]);
      }, 1000);
    }
  };

  const copyMessage = async (messageText, messageId) => {
    try {
      await navigator.clipboard.writeText(messageText);
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy message:", err);
    }
  };

  const renderMessageContent = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 underline break-all transition-colors"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const fetchMessages = async () => {
    const res = await(await authFetch(BASEURL+"/chats/")).json()
  };
  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <div
          onClick={openChat}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-blue-500/25"
        >
          <MessageCircle size={24} />
        </div>
      )}{" "}
      {/* Chat Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" />

          {/* Chat Container */}
          <div
            className={`relative w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 transition-all duration-300 ${
              isMinimized ? "h-20" : "h-[500px]"
            }`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 flex items-center justify-between h-20 min-h-20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Shield size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-white leading-tight">
                    Admin Support
                  </h3>
                  <p className="text-xs text-white/80 leading-tight">
                    Online now
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleMinimize}
                  className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  {isMinimized ? (
                    <Maximize2 size={18} />
                  ) : (
                    <Minimize2 size={18} />
                  )}
                </button>
                <button
                  onClick={closeChat}
                  className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages & Input only when not minimized */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.isAdmin ? "justify-start" : "justify-end"
                      } group`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-sm px-4 py-3 rounded-2xl relative cursor-pointer transition-all duration-200 ${
                          msg.isAdmin
                            ? "bg-white text-gray-800 rounded-tl-md shadow-sm"
                            : "bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-tr-md shadow-sm"
                        }`}
                        onDoubleClick={() => copyMessage(msg.text, msg.id)}
                      >
                        <div className="flex items-start space-x-2">
                          {msg.isAdmin && (
                            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Shield size={12} className="text-gray-600" />
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="text-sm leading-relaxed">
                              {renderMessageContent(msg.text)}
                            </div>
                            <div
                              className={`text-xs mt-2 ${
                                msg.isAdmin ? "text-gray-500" : "text-white/70"
                              }`}
                            >
                              {formatTime(msg.timestamp)}
                            </div>
                          </div>
                        </div>

                        {/* Copy button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyMessage(msg.text, msg.id);
                          }}
                          className={`absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity ${
                            msg.isAdmin
                              ? "hover:bg-gray-100"
                              : "hover:bg-white/20"
                          }`}
                        >
                          {copiedId === msg.id ? (
                            <Check
                              size={12}
                              className={`${
                                msg.isAdmin ? "text-green-600" : "text-white"
                              }`}
                            />
                          ) : (
                            <Copy
                              size={12}
                              className={`${
                                msg.isAdmin ? "text-gray-500" : "text-white/70"
                              }`}
                            />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="px-4 py-3 bg-white border-t border-gray-200">
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <input
                        ref={inputRef}
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleSendMessage(e);
                          }
                        }}
                        placeholder="Type your message..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                      />
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!message.trim()}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-full transition-all duration-200 transform hover:scale-105"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    Double-tap any message to copy it
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};
export default AdminChatPopup;
