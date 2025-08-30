import { MessageCircle } from "lucide-react";

const AdminChatPopup = () => {
  return (
    <>
      {/* Chat Toggle Button */}
      <div
        onClick={() => {
          window.open(
            "https://chat.whatsapp.com/CvaWKR0y7eoLKSrZQuO5bc?mode=ems_copy_c",
            "_blank"
          );
        }}
        className="fixed top-1/2 right-6 z-[9999] -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 hover:shadow-blue-500/25"
      >
        <MessageCircle size={24} />
      </div>
    </>
  );
};

export default AdminChatPopup;
