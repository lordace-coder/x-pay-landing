import { MessageCircle } from "lucide-react";

const AdminChatPopup = () => {
  return (
    <>
      {/* Chat Toggle Button */}
      <div
        onClick={() => {
          window.open(
            "https://wa.me/+4407352663651?text=Hello%2C%20I%20need%20assistance%20with%20XPay.",
            "_blank"
          );
        }}
        className="fixed top-20 right-6 z-[9999] -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-blue-500/25"
      >
        <MessageCircle size={24} />
      </div>
    </>
  );
};

export default AdminChatPopup;
