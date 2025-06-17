import React from "react";
import {
  BadgeDollarSign,
  PlayCircle,
  Banknote,
  Share2,
  Video,
  MailCheck,
} from "lucide-react";
import logo from "../assets/img/xpay-logo.png"; // Replace with actual logo path

const features = [
  {
    icon: <BadgeDollarSign className="w-10 h-10 text-green-600" />,
    title: "Buy xPay Tokens",
    description: (
      <>
        Purchase <strong>xPay Tokens</strong> to start your investment journey.
        <ul className="list-disc ml-5 mt-2 text-sm text-gray-600">
          <li>Your capital is securely stored and separated from profits.</li>
          <li>
            Capital cannot be withdrawn immediately, but a request form is
            available.
          </li>
        </ul>
      </>
    ),
  },
  {
    icon: <PlayCircle className="w-10 h-10 text-green-600" />,
    title: "Watch Videos Daily",
    description: (
      <>
        Watch <strong>2 videos daily</strong> and earn{" "}
        <strong>4% of your total capital</strong> daily.
        <ul className="list-disc ml-5 mt-2 text-sm text-gray-600">
          <li>You must complete both videos to receive rewards.</li>
        </ul>
      </>
    ),
  },
  {
    icon: <Banknote className="w-10 h-10 text-green-600" />,
    title: "Earn & Withdraw Profits",
    description: (
      <>
        Your daily rewards go into a <strong>profit wallet</strong> that you can
        withdraw anytime.
        <ul className="list-disc ml-5 mt-2 text-sm text-gray-600">
          <li>Capital stays locked and works for 15 days.</li>
          <li>
            Total profit at the end is <strong>double your capital</strong>.
          </li>
        </ul>
      </>
    ),
  },
  {
    icon: <MailCheck className="w-10 h-10 text-green-600" />,
    title: "Capital Withdrawal (Optional)",
    description: (
      <>
        Need your capital back? Fill out the withdrawal form.
        <ul className="list-disc ml-5 mt-2 text-sm text-gray-600">
          <li>
            The team will review your request and contact you with next steps.
          </li>
        </ul>
      </>
    ),
  },
  {
    icon: <Share2 className="w-10 h-10 text-green-600" />,
    title: "Refer Friends",
    description: (
      <>
        Refer your friends and earn <strong>5% of their investments</strong>.
        <ul className="list-disc ml-5 mt-2 text-sm text-gray-600">
          <li>
            You only earn from <strong>direct referrals</strong>.
          </li>
          <li>No limit to how many friends you can invite.</li>
        </ul>
      </>
    ),
  },
  {
    icon: <Video className="w-10 h-10 text-green-600" />,
    title: "Advertise With Us",
    description: (
      <>
        Promote your business with banner or video ads on our platform.
        <ul className="list-disc ml-5 mt-2 text-sm text-gray-600">
          <li>Upload your ad and contact our team.</li>
          <li>We’ll email you with pricing and next steps.</li>
        </ul>
      </>
    ),
  },
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-4 mb-8">
          <img src={logo} alt="xPayee Logo" className="h-12 w-12" />
          <h1 className="text-4xl font-bold text-gray-800">How xPay Works</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition"
            >
              <div className="mb-4">{feature.icon}</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {feature.title}
              </h2>
              <div className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
