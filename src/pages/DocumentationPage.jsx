import React from "react";
import { DollarSign, Play, Banknote, Share2, Video, Mail } from "lucide-react";

const features = [
  {
    icon: <DollarSign className="w-6 h-6" />,
    title: "Token Acquisition",
    subtitle: "Secure Investment Platform",
    description:
      "Purchase xPay Tokens through our regulated investment framework with institutional-grade security protocols.",
    details: [
      "Capital segregation and custody protection",
      "Structured withdrawal process available",
      "Regulatory compliance framework",
    ],
  },
  {
    icon: <Play className="w-6 h-6" />,
    title: "Engagement Protocol",
    subtitle: "Daily Interaction Requirements",
    description:
      "Complete daily engagement activities to activate your investment returns at 3.3% of total capital.",
    details: [
      "One daily content interactions required",
      "Automated reward calculation system",
      "Performance tracking dashboard",
    ],
  },
  {
    icon: <Banknote className="w-6 h-6" />,
    title: "Profit Distribution",
    subtitle: "Flexible Withdrawal System",
    description:
      "Access your daily earnings through our profit wallet with immediate withdrawal capabilities.",
    details: ["30-day capital lock period", "50% capital return guarantee"],
  },
  {
    icon: <Mail className="w-6 h-6" />,
    title: "Capital Management",
    subtitle: "Withdrawal Request System",
    description:
      "Submit capital withdrawal requests through our streamlined administrative process.",
    details: [
      "Professional review process",
      "Direct communication channels",
      "Expedited processing available",
    ],
  },
  {
    icon: <Share2 className="w-6 h-6" />,
    title: "Referral Program",
    subtitle: "Partnership Opportunities",
    description:
      "Earn 5% commission on direct referrals through our structured partnership program.",
    details: [
      "Direct referral compensation only",
      "Unlimited referral capacity",
      "Transparent commission tracking",
    ],
  },
  {
    icon: <Video className="w-6 h-6" />,
    title: "Advertising Solutions",
    subtitle: "Brand Partnership Platform",
    description:
      "Leverage our platform for targeted advertising with comprehensive campaign management.",
    details: [
      "Multi-format advertising options",
      "Dedicated account management",
      "Performance analytics included",
    ],
  },
];

export default function CorporateXPayPage() {
  return (
    <div className="min-h-screen trans_1">
      {/* Header Section */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">xP</span>
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">xPay</h1>
              <p className="text-sm text-gray-500">Investment Platform</p>
            </div>
          </div>

          <div className="max-w-2xl">
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              How Our Platform Works
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              A comprehensive overview of our investment platform's core
              functionalities, designed for institutional and individual
              investors seeking structured returns.
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group relative bg-white border border-gray-100 rounded-xl p-8 hover:border-blue-200 hover:shadow-sm transition-all duration-300"
            >
              {/* Icon and Header */}
              <div className="flex items-start space-x-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                  {feature.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-sm font-medium text-blue-600 uppercase tracking-wide">
                    {feature.subtitle}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                {feature.description}
              </p>

              {/* Details List */}
              <div className="space-y-3">
                {feature.details.map((detail, detailIdx) => (
                  <div key={detailIdx} className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-1.5 h-1.5 bg-blue-400 rounded-full mt-2"></div>
                    <p className="text-sm text-gray-600">{detail}</p>
                  </div>
                ))}
              </div>

              {/* Subtle hover indicator */}
              <div className="absolute top-6 right-6 w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer CTA */}
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Join our platform and start building your investment portfolio
              with our structured approach to digital asset management.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                onClick={() => {
                  window.location.href = "/dashboard";
                }}
              >
                Start Investing
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
