import { useState, useEffect } from "react";
import { Mail, ArrowLeft, Clock, CheckCircle } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { BASEURL } from "../utils/utils";
import { useNavigate, useLocation } from "react-router-dom";

const EmailVerification = () => {
  const { verifyEmail, fetchVerificationStatus } = useAuth();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isChangingEmail, setIsChangingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "your@email.com"; // passed from signup

  // restore OTP resend timer
  useEffect(() => {
    const lastSent = localStorage.getItem("emailOtpSentTime");
    if (lastSent) {
      const timeDiff = Date.now() - Number.parseInt(lastSent);
      const remainingTime = 60000 - timeDiff;
      if (remainingTime > 0) {
        setCanResend(false);
        setCountdown(Math.ceil(remainingTime / 1000));
      }
    }
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
  }, [countdown, canResend]);

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Send OTP
  const handleSendOtp = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${BASEURL}/auth/send-email-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        localStorage.setItem("emailOtpSentTime", Date.now().toString());
        setCanResend(false);
        setCountdown(60);
        toast.success("OTP sent successfully!");
      } else {
        const err = await res.json();
        toast.error(err.detail || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("Error sending OTP: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Verify Email
  const handleVerifyEmail = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Please enter complete 6-digit code");
      return;
    }
    try {
      setIsLoading(true);
      const success = await verifyEmail(email, otpCode);
      if (success) {
        toast.success("Email verified successfully!");
        await fetchVerificationStatus();
        navigate("/dashboard");
      } else {
        toast.error("Invalid or expired verification code");
      }
    } catch (err) {
      toast.error("Verification failed: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Change Email & resend OTP
  const handleChangeEmail = async () => {
    if (!newEmail || !/\S+@\S+\.\S+/.test(newEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      setIsLoading(true);
      const res = await fetch(`${BASEURL}/auth/change-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ old_email: email, new_email: newEmail }),
      });
      if (res.ok) {
        toast.success("Email updated! OTP resent.");
        setOtp(["", "", "", "", "", ""]);
        setIsChangingEmail(false);
        localStorage.setItem("emailOtpSentTime", Date.now().toString());
        setCanResend(false);
        setCountdown(60);
      } else {
        const err = await res.json();
        toast.error(err.detail || "Failed to change email");
      }
    } catch (error) {
      toast.error("Error changing email: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card/50 backdrop-blur-sm rounded-2xl shadow-xl border border-border p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Verify Your Email
            </h1>
            <p className="text-muted-foreground">
              We've sent a 6-digit code to
            </p>
            <p className="text-primary font-semibold">{email}</p>
          </div>

          {!isChangingEmail ? (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-3">
                  Enter verification code
                </label>
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center text-lg font-semibold bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                      maxLength={1}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleVerifyEmail}
                disabled={isLoading || otp.join("").length !== 6}
                className="w-full bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 mb-4"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  <CheckCircle className="w-5 h-5" />
                )}
                {isLoading ? "Verifying..." : "Verify Email"}
              </button>

              <div className="text-center mb-4">
                {canResend ? (
                  <button
                    onClick={handleSendOtp}
                    disabled={isLoading}
                    className="text-secondary hover:text-secondary/80 font-medium transition-colors"
                  >
                    Resend Code
                  </button>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Resend in {countdown}s</span>
                  </div>
                )}
              </div>

              <div className="text-center">
                <button
                  onClick={() => setIsChangingEmail(true)}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Change Email Address
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6">
                <label className="block text-sm font-medium text-foreground mb-2">
                  New Email Address
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter new email address"
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setIsChangingEmail(false)}
                  className="flex-1 bg-muted hover:bg-muted/80 text-muted-foreground font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  onClick={handleChangeEmail}
                  disabled={isLoading}
                  className="flex-1 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-primary-foreground font-semibold py-3 px-4 rounded-lg transition-all duration-200"
                >
                  {isLoading ? "Updating..." : "Update Email"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
