"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import axiosInstance from "@/dbUtils/axios";
import axios from "axios";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const payerId = searchParams.get("payerId");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (token && payerId) {
      handleConfirmPayment();
    }
  }, [token, payerId]);

  async function handleConfirmPayment() {
    if (!token || !payerId) {
      setMessage("Token hoặc PayerID không hợp lệ.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Log để debug
      console.log('Sending request with:', { token, payerId });

      const response = await axiosInstance.post('invoices/payment-success', {
        token: token,
        payerId: payerId
      });

      console.log('Response received:', response);

      if (response.status === 200) {
        setMessage("Thanh toán thành công!");
      } else {
        setMessage("Có lỗi xảy ra khi xác nhận thanh toán.");
      }
    } catch (error) {
      console.error('Error details:', error);
      if (axios.isAxiosError(error)) {
        setMessage(`Lỗi khi xác nhận thanh toán: ${error.message}`);
      } else {
        setMessage("Đã xảy ra lỗi không xác định");
      }
    } finally {
      setLoading(false);
    }
}

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold text-green-600">Payment success!</h1>
        <p className="mt-2 text-gray-600">Thank you for using our service.</p>
        {message && (
          <p className={`mt-2 ${message.includes("thành công") ? "text-green-500" : "text-red-500"}`}>
            {message}
          </p>
        )}
        <button
          onClick={handleConfirmPayment}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : "Xác nhận thanh toán"}
        </button>
        <Link href="/" className="block">
          <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 w-full">
            Quay lại trang chủ
          </button>
        </Link>
      </div>
    </div>
  );
}