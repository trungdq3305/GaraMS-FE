"use client";

import { motion } from "framer-motion";
import { usePromotion } from "@/dbUtils/promotionAPIs/promotionList";
import { useRouter } from "next/navigation";

export default function PromotionListPage() {
  const { data: promotions, isLoading, error } = usePromotion();
  const router = useRouter();

  if (isLoading)
    return (
      <div className="text-center text-gray-500">Loading promotions...</div>
    );
  if (error)
    return (
      <div className="text-red-600 text-center">Failed to load promotions.</div>
    );

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl font-bold mb-6">🎉 Current Promotions</h1>

      <div className="max-w-4xl w-full grid gap-6">
        {promotions?.map((promotion) => (
          <motion.div
            key={promotion.promotionId}
            className="bg-white p-5 rounded-lg shadow-md border border-gray-200"
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-xl font-semibold text-blue-600">
              {promotion.promotionName}
            </h2>
            <p className="text-gray-700 mt-1">
              📅 {new Date(promotion.startDate).toLocaleDateString()} -{" "}
              {new Date(promotion.endDate).toLocaleDateString()}
            </p>
            <p className="text-lg font-bold text-green-600">
              🔥 {promotion.discountPercent}% OFF
            </p>

            <button
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              onClick={() =>
                router.push(`/promotions/${promotion.promotionId}`)
              }
            >
              View Details
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
