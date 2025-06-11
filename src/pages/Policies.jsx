import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
      <h1 className="text-4xl font-bold text-blue-700 mb-6">Privacy Policy</h1>
      <p className="mb-4">
        At <strong>X-Pay</strong>, we value your privacy. This policy explains
        how we collect, use, and protect your information.
      </p>

      <ul className="list-disc pl-6 space-y-3">
        <li>
          We collect personal info like name, email, wallet ID, and phone number
          to provide services.
        </li>
        <li>
          Your data is encrypted and securely stored. We do not sell or share it
          without your consent.
        </li>
        <li>
          We use cookies and analytics tools to improve user experience and
          monitor platform activity.
        </li>
        <li>
          You can request to access, correct, or delete your data by contacting
          our support team.
        </li>
        <li>
          Emails may be sent for important account updates, earnings, or
          marketing—with opt-out options.
        </li>
        <li>
          Our platform complies with applicable data protection regulations to
          ensure your rights.
        </li>
      </ul>

      <p className="mt-6">
        For more information, reach out to us at{" "}
        <a className="text-blue-600 underline" href="mailto:privacy@xpay.com">
          privacy@xpay.com
        </a>
        .
      </p>
    </div>
  );
};

export default PrivacyPolicy;
