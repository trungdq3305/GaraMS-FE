"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import axiosInstance from "@/dbUtils/axios";
import { ArrowLeft, CheckCircle } from "lucide-react";

export default function SuccessPage() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function updateInvoiceStatus() {
      try {
        await axiosInstance.put('inventoryinvoices/edit-to-false');
      } catch (error) {
        console.error("Error updating invoice status:", error);
        setMessage("An error occurred while updating the invoice status.");
      }
    }

    updateInvoiceStatus();
  }, []);
  useEffect(() => {
    // Reload the page after 1 second once navigating back to the homepage
    if (window.location.pathname === "/") {
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }, []);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-blue-50 py-10 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl border border-gray-200 flex flex-col items-center">
        {message && (
          <p className="text-red-500 mb-4 text-center">{message}</p>
        )}
        <CheckCircle className="h-16 w-16 text-green-500 mb-2" />
          <h1 className="text-3xl font-bold text-center text-gray-800">
            Payment success
          </h1>
          <p className="mt-2 text-center text-gray-600 mb-6">
            Thank you for using our service
          </p>
        <Link href="/">
          <button className="flex items-center px-6 py-3 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition-colors focus:ring-2 focus:ring-green-300 focus:outline-none">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to homepage
          </button>
        </Link>
      </div>
    </div>
  );
}