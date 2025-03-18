/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import axiosInstance from "@/dbUtils/axios";
import axios from "axios";
import {
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowLeft,
  Receipt,
} from "lucide-react";

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
      setMessage("Token or PayerID not valid.");
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
        console.log(response);
        if (response.status === 200) {
          setMessage("Payment success!");
          setSuccess(true);
          setInvoice(response.data);
        } else {
          setMessage("Error orrcur while payment.");
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setMessage(`Error orrcur while payment: ${error.message}`);
        } else {
          setMessage("Error");
        }
      } finally {
        setLoading(false);
      }
    }

    if (token && payerId) {
      processPayment();
    }
  }, [token, payerId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-blue-50 py-10 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl border border-gray-200">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10">
            <Clock className="h-16 w-16 text-blue-500 animate-pulse mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">
              Payment processing
            </h2>
            <p className="mt-2 text-gray-600">Please wait for a sec...</p>
          </div>
        ) : (
          <>
            {success ? (
              <div className="flex flex-col items-center">
                <CheckCircle className="h-16 w-16 text-green-500 mb-2" />
                <h1 className="text-3xl font-bold text-center text-gray-800">
                  Payment success
                </h1>
                <p className="mt-2 text-center text-gray-600 mb-6">
                  Thank you for using our service
                </p>

                {invoice && (
                  <div className="w-full mt-6 bg-gray-50 rounded-xl p-6 border border-gray-100">
                    <div className="flex justify-between items-start border-b border-gray-200 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <Receipt className="text-gray-700" size={20} />
                          <h2 className="text-xl font-semibold text-gray-800">
                            Invoice #{invoice.invoiceId}
                          </h2>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Customer: #{invoice.customerId}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          {invoice.status}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {formatDate(invoice.date)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h2 className="text-lg font-semibold text-gray-800 mb-3">
                        Invoice details
                      </h2>
                      <div className="space-y-3">
                        {invoice.appointment?.appointmentServices?.map(
                          (service: any) => (
                            <div
                              key={service.appointmentServiceId}
                              className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                            >
                              <div className="flex justify-between">
                                <h3 className="font-medium text-gray-800">
                                  {service.service.serviceName}
                                </h3>
                                <p className="font-semibold text-green-600">
                                  ${service.service.totalPrice}
                                </p>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {service.service.description}
                              </p>
                              <div className="flex items-center mt-2 text-sm text-gray-500">
                                <Clock size={16} className="mr-1" />
                                <span>
                                  {service.service.estimatedTime} phút
                                </span>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-medium text-gray-700">
                          Total price:
                        </span>
                        <span className="text-2xl font-bold text-green-600">
                          ${invoice.totalAmount}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-500 mt-2">
                        <span>Payment method:</span>
                        <span className="font-medium">
                          {invoice.paymentMethod}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <AlertCircle className="h-16 w-16 text-red-500 mb-2" />
                <h1 className="text-3xl font-bold text-center text-gray-800">
                  Payment fail
                </h1>
                <p className="mt-2 text-center text-gray-600 mb-6">{message}</p>
              </div>
            )}

            <div className="mt-8 flex justify-center">
              <Link href="/">
                <button className="flex items-center px-6 py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition-colors focus:ring-2 focus:ring-green-300 focus:outline-none">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back to homepage
                </button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
