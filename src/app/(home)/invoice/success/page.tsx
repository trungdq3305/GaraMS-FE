"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import axiosInstance from "@/dbUtils/axios";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const payerId = searchParams.get("PayerID"); // Lấy payerId từ URL
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleConfirmPayment = async () => {
    if (!token || !payerId) {
      setMessage("Token hoặc PayerID không hợp lệ.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await axiosInstance.post(
        `invoices/payment-success?token=${token}&payerId=${payerId}`
      );

      if (response.status === 200) {
        setMessage("Thanh toán thành công!");
      } else {
        setMessage("Có lỗi xảy ra.");
      }
    } catch (error) {
      setMessage("Lỗi khi xác nhận thanh toán.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-green-600">Payment success!</h1>
        <p className="mt-2 text-gray-600">Thank you for using our service.</p>
        {message && <p className="mt-2 text-red-500">{message}</p>}
        <button
          onClick={handleConfirmPayment}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Processing..." : "Confirm Payment"}
        </button>
        <Link href="/">
          <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Back to website
          </button>
        </Link>
      </div>
    </div>
  );
}
