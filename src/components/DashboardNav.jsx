import React, { useState } from "react";
import {
  Home,
  BarChart3,
  Users,
  Settings,
  FileText,
  Calendar,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  DollarSign,
  BookA,
  Bell,
  UploadCloud,
  Cog,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navigation = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");
  const navigate = useNavigate();
  const { user,logout } = useAuth();
  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, href: "/dashboard" },
    {
      id: "tokens",
      label: "X-Pay Tokens",
      icon: DollarSign,
      href: "/purchase-tokens",
    },
    { id: "docs", label: "How It Works", icon: BookA, href: "/docs" },
    {
      id: "notifications",
      label: "Transactions",
      icon: Bell,
      href: "/notifications",
    },
    {
      id: "wihdrawal",
      label: "Withdrawals",
      icon: Calendar,
      href: "/withdraw",
    },
    { id: "ads", label: "Upload Adverts", icon: UploadCloud, href: "/ads" },
    { id: "password", label: "Settings", icon: Cog, href: "/password-reset" },
  ];

  const NavItem = ({ item, collapsed = false }) => {
    const Icon = item.icon;
    const isActive = activeItem === item.id;

    return (
      <button
        onClick={() => {
          setActiveItem(item.id);
          navigate(item.href);
          setSidebarOpen(false);
        }}
        className={`
          w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200
          ${
            isActive
              ? "bg-emerald-50 text-emerald-700"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          }
          ${collapsed ? "justify-center" : "justify-start"}
        `}
        title={collapsed ? item.label : ""}
      >
        <Icon
          className={`h-5 w-5 ${collapsed ? "" : "mr-3"} flex-shrink-0 ${
            isActive ? "text-emerald-600" : ""
          }`}
        />
        {!collapsed && <span className="truncate">{item.label}</span>}
      </button>
    );
  };

  return (
    <>
      {/* Mobile menu button - fixed position */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
      >
        <Menu className="h-5 w-5 text-gray-600" />
      </button>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-100 transform transition-all duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        ${sidebarCollapsed ? "w-16" : "w-64"}
        lg:translate-x-0
      `}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-50">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">
                Dashboard
              </span>
            </div>
          )}

          {/* Desktop collapse button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md hover:bg-gray-50 transition-colors"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-gray-400" />
            )}
          </button>

          {/* Mobile close button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden flex items-center justify-center w-7 h-7 rounded-md hover:bg-gray-50 transition-colors"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-3 py-8 space-y-1">
          {navigationItems.map((item) => (
            <NavItem key={item.id} item={item} collapsed={sidebarCollapsed} />
          ))}
        </nav>

        {/* User section */}
        <div className="border-t border-gray-50 p-2">
          <div
            className={`flex items-center ${
              sidebarCollapsed ? "justify-center" : "space-x-3"
            }`}
          >
            <div className="w-8 h-5 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-gray-500" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.full_name}
                </p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            )}
          </div>

          {!sidebarCollapsed && (
            <button className="mt-3 w-full flex items-center px-3 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
              <LogOut onClick={logout} className="h-4 w-4 mr-3" />
              Sign out
            </button>
          )}
        </div>
      </div>

      {/* Spacer for main content - only adds margin when sidebar is visible */}
      <div
        className={`hidden lg:block transition-all duration-300 ${
          sidebarCollapsed ? "w-16" : "w-64"
        }`}
      />
    </>
  );
};

export default Navigation;
