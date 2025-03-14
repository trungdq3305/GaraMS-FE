"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import axiosInstance from "@/dbUtils/axios";
import axios from "axios";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [payerId, setPayerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [invoice, setInvoice] = useState<any>(null);

  useEffect(() => {
    const queryToken = searchParams.get("token");
    const queryPayerId = searchParams.get("PayerID");
    if (queryToken && queryPayerId) {
      setToken(queryToken);
      setPayerId(queryPayerId);
    } else {
      setMessage("Token hoặc PayerID không hợp lệ.");
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    async function processPayment() {
      if (!token || !payerId) return;

      try {
        const response = await axiosInstance.post(
          `invoices/payment-success?token=${token}&payerId=${payerId}`
        );

        if (response.status === 200) {
          setMessage("Thanh toán thành công!");
          setSuccess(true);
          setInvoice(response.data);
        } else {
          setMessage("Có lỗi xảy ra khi xác nhận thanh toán.");
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setMessage(`Lỗi khi xác nhận thanh toán: ${error.message}`);
        } else {
          setMessage("Đã xảy ra lỗi không xác định");
        }
      } finally {
        setLoading(false);
      }
    }

    if (token && payerId) {
      processPayment();
    }
  }, [token, payerId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-10">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl border border-gray-300">
        <h1 className="text-3xl font-bold text-center text-green-600">Payment Successful</h1>
        <p className="mt-2 text-center text-gray-600">Thank you for your payment.</p>
        {loading ? (
          <p className="mt-4 text-blue-500 text-center">Processing payment...</p>
        ) : (
          <>
            {success && invoice && (
              <div className="mt-6 text-gray-700">
                <div className="border-b pb-4">
                  <h2 className="text-xl font-semibold">Invoice #{invoice.invoiceId}</h2>
                  <p className="text-sm text-gray-500">Date: {new Date(invoice.date).toLocaleString()}</p>
                  <p className="text-sm text-gray-500">Customer ID: {invoice.customerId}</p>
                </div>
                <div className="mt-4">
                  <h2 className="text-lg font-semibold">Services</h2>
                  <div className="mt-2 space-y-4">
                    {invoice.appointment?.appointmentServices?.map((service: any) => (
                      <div key={service.appointmentServiceId} className="p-4 bg-gray-50 border rounded-lg">
                        <p className="font-medium">{service.service.serviceName}</p>
                        <p className="text-sm text-gray-600">{service.service.description}</p>
                        <p className="text-sm"><strong>Price:</strong> ${service.service.totalPrice}</p>
                        <p className="text-sm"><strong>Estimated Time:</strong> {service.service.estimatedTime} min</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-6 border-t pt-4">
                  <p className="text-lg font-semibold">Total: <span className="text-green-600">${invoice.totalAmount}</span></p>
                  <p className="text-sm text-gray-500">Payment Method: {invoice.paymentMethod}</p>
                  <p className="text-sm text-gray-500">Status: {invoice.status}</p>
                </div>
              </div>
            )}
            <div className="mt-6 flex justify-center">
              <Link href="/">
                <button className="px-6 py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600">
                  Back to Homepage
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
