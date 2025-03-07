import React from "react";

const TermsAndPolicy = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-2xl my-10">
      <h1 className="text-3xl font-bold text-center mb-6">Terms & Policy</h1>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
        <p className="text-gray-700">
          Welcome to our car garage management system. By using our services,
          you agree to comply with the terms and conditions outlined below.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Terms of Use</h2>
        <ul className="list-disc pl-5 text-gray-700">
          <li>Users must not use the system for any illegal activities.</li>
          <li>All provided information must be accurate and up to date.</li>
          <li>We reserve the right to modify content without prior notice.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. Privacy Policy</h2>
        <p className="text-gray-700">
          We are committed to protecting your personal information. All data
          will be kept secure and will not be shared with third parties without
          consent.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Contact</h2>
        <p className="text-gray-700">
          If you have any questions, please contact us via email:{" "}
          <span className="text-blue-600 font-medium">support@garams.com</span>
        </p>
      </section>
    </div>
  );
};

export default TermsAndPolicy;
