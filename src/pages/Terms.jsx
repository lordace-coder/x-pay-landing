import React from "react";

const TermsOfService = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
      <h1 className="text-4xl font-bold text-blue-700 mb-6">Terms of Service</h1>
      <p className="mb-4">
        Welcome to <strong>X-Pay</strong>. These Terms of Service govern your use of our platform.
        By using our services, you agree to these terms.
      </p>

      <ul className="list-disc pl-6 space-y-3">
        <li>Users must be 18 years or older to invest or upload content.</li>
        <li>X-Pay Tokens are required to activate investment plans and represent your capital.</li>
        <li>You earn by watching approved daily videos. Earnings vary based on engagement and plan.</li>
        <li>
          Uploading content or advertising products requires prior approval and may incur a service fee.
        </li>
        <li>
          Any misuse, including attempts at fraud or system abuse, may result in account suspension.
        </li>
        <li>
          We reserve the right to update these terms. Continued use implies acceptance of changes.
        </li>
      </ul>

      <p className="mt-6">
        For any questions, please contact our support team at <a className="text-blue-600 underline" href="mailto:support@xpay.com">support@xpay.com</a>.
      </p>
    </div>
  );
};

export default TermsOfService;
