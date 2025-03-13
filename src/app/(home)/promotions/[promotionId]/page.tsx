"use client";

import { useParams, useRouter } from "next/navigation";
import { usePromotionDetail } from "@/dbUtils/promotionAPIs/promotionDetail";
import { motion } from "framer-motion";

export default function PromotionDetailPage() {
  const { promotionId } = useParams(); // Get ID from URL
  const router = useRouter();
  const {
    data: promotion,
    isLoading,
    error,
  } = usePromotionDetail(Number(promotionId));

  if (isLoading)
    return <div className="text-center text-gray-500">Loading...</div>;
  if (error)
    return (
      <div className="text-red-600 text-center">Failed to load promotion.</div>
    );

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="max-w-2xl w-full p-6 bg-white shadow-md rounded-lg border border-gray-300"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          {promotion?.promotionName}
        </h1>
        <p className="text-gray-700">
          <b>Start:</b>{" "}
          {new Date(promotion?.startDate ?? "").toLocaleDateString()} |
          <b> End:</b> {new Date(promotion?.endDate ?? "").toLocaleDateString()}
        </p>
        <p className="text-lg font-bold text-green-600">
          🔥 {promotion?.discountPercent}% OFF
        </p>

        <h2 className="text-xl font-semibold mt-4">📋 Services Included:</h2>
        <ul className="list-disc list-inside text-gray-700 mt-2">
          {promotion?.servicePromotions.map((sp) => (
            <li key={sp.servicePromotionId}>
              {/* {sp.service?.serviceName} -
              <span className="text-blue-500"> ${sp.service?.totalPrice}</span> */}
            </li>
          ))}
        </ul>

        <button
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={() => router.back()}
        >
          ← Back to Promotions
        </button>
      </motion.div>
    </motion.div>
  );
}
