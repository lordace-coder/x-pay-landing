import { useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, Mail, Phone } from "lucide-react";

export default function VerificationHub() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const phoneNumber = location.state?.phoneNumber;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-background p-4">
      <div className="w-full max-w-lg bg-card/50 backdrop-blur-sm rounded-2xl shadow-xl border border-border p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <ShieldCheck className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold mb-2 text-foreground">
          Verify Your Account
        </h1>
        <p className="text-muted-foreground mb-6">
          You must verify your <span className="font-semibold">email</span> and{" "}
          <span className="font-semibold">phone</span> before you can withdraw.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => navigate("/verify-email", { state: { email } })}
            className="flex items-center justify-center gap-2 p-4 border border-border rounded-lg hover:bg-accent transition"
          >
            <Mail className="w-5 h-5 text-primary" />
            Verify Email
          </button>

          <button
            onClick={() =>
              navigate("/verify-phone", { state: { phoneNumber } })
            }
            className="flex items-center justify-center gap-2 p-4 border border-border rounded-lg hover:bg-accent transition"
          >
            <Phone className="w-5 h-5 text-secondary" />
            Verify Phone
          </button>
        </div>
      </div>
    </div>
  );
}
