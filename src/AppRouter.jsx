import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import XPayDashboard from "./pages/Dashboard";
import XPayNotifications from "./pages/NotificationsPage";
import TermsOfService from "./pages/Terms";
import PrivacyPolicy from "./pages/Policies";
import PrivateRoute from "./components/PrivateRoute";
import WithdrawalPage from "./pages/Withdrawal";
import AuthProvider from "./context/AuthContext";
import NotFound from "./pages/NotFound";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <XPayDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <PrivateRoute>
                <XPayNotifications />
              </PrivateRoute>
            }
          />

          <Route
            path="/withdraw"
            element={
              <PrivateRoute>
                <WithdrawalPage />
              </PrivateRoute>
            }
          />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/policies" element={<PrivacyPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
