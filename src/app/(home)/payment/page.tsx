"use client";

import React, { useState } from "react";

const PaymentPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [isPaid, setIsPaid] = useState(false);

  const handlePayment = () => {
    setIsPaid(true);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-2xl my-10">
      <h1 className="text-3xl font-bold text-center mb-6">Payment</h1>
      <div className="mb-4">
        <label className="block text-gray-700 font-semibold mb-2">
          Select Payment Method
        </label>
        <select
          className="w-full p-2 border rounded-lg"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="credit_card">Credit Card</option>
          <option value="paypal">PayPal</option>
        </select>
      </div>
      <button
        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
        onClick={handlePayment}
      >
        Proceed to Pay
      </button>
      {isPaid && <PaymentFeedback success={true} />}
    </div>
  );
};

interface PaymentFeedbackProps {
  success: boolean;
}

const PaymentFeedback: React.FC<PaymentFeedbackProps> = ({ success }) => {
  return (
    <div className="mt-6 p-4 bg-green-100 text-green-700 rounded-lg">
      {success
        ? "Payment Successful! Thank you for your booking."
        : "Payment Failed. Please try again."}
    </div>
  );
};

export default PaymentPage;
