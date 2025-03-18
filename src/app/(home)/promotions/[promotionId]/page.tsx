// "use client";

// import { useParams, useRouter } from "next/navigation";
// import { usePromotionDetail } from "@/dbUtils/promotionAPIs/promotionDetail";
// import { motion } from "framer-motion";
// import { useQuery } from "@tanstack/react-query";
// import { getServices } from "@/dbUtils/ManagerAPIs/serviceservice";

// export default function PromotionDetailPage() {
//   const { promotionId } = useParams(); // Get ID from URL
//   const router = useRouter();
//   const {
//     data: promotion,
//     isLoading,
//     error,
//   } = usePromotionDetail(Number(promotionId));

//   const {
//     data: services,
//     isLoading: isServicesLoading,
//     error: servicesError,
//   } = useQuery({
//     queryKey: ["services"],
//     queryFn: getServices,
//   });

//   if (isLoading || isServicesLoading)
//     return <div className="text-center text-gray-500">Loading...</div>;
//   if (error || servicesError)
//     return (
//       <div className="text-red-600 text-center">Failed to load promotion.</div>
//     );

//   return (
//     <motion.div
//       className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-8"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//     >
//       <motion.div
//         className="max-w-2xl w-full p-6 bg-white shadow-md rounded-lg border border-gray-300"
//         initial={{ scale: 0.9 }}
//         animate={{ scale: 1 }}
//         transition={{ duration: 0.3 }}
//       >
//         <h1 className="text-3xl font-bold text-blue-600 mb-4">
//           {promotion?.promotionName}
//         </h1>
//         <p className="text-gray-700">
//           <b>Start:</b>{" "}
//           {new Date(promotion?.startDate ?? "").toLocaleDateString()} |
//           <b> End:</b> {new Date(promotion?.endDate ?? "").toLocaleDateString()}
//         </p>
//         <p className="text-lg font-bold text-green-600">
//           🔥 {promotion?.discountPercent}% OFF
//         </p>

//         <h2 className="text-xl font-semibold mt-4">📋 Services Included:</h2>
//         <ul className="list-disc list-inside text-gray-700 mt-2">
//           {promotion?.servicePromotions.map((sp) => {
//             const service = services?.data?.find(
//               (s: { serviceId: number }) => s.serviceId === sp.serviceId
//             );
//             return (
//               <li key={sp.servicePromotionId}>
//                 {service
//                   ? `${service.serviceName} - $${service.servicePrice}`
//                   : "Service not found"}
//               </li>
//             );
//           })}
//         </ul>

//         <button
//           className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//           onClick={() => router.back()}
//         >
//           ← Back to Promotions
//         </button>
//       </motion.div>
//     </motion.div>
//   );
// }
"use client";

import { useParams, useRouter } from "next/navigation";
import { usePromotionDetail } from "@/dbUtils/promotionAPIs/promotionDetail";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getServices } from "@/dbUtils/ManagerAPIs/serviceservice";
import { Card, Button, Typography, List, Spin, Alert, Tag } from "antd";
import dayjs from "dayjs";

const { Title, Text } = Typography;

export default function PromotionDetailPage() {
  const { promotionId } = useParams();
  const router = useRouter();

  const {
    data: promotion,
    isLoading,
    error,
  } = usePromotionDetail(Number(promotionId));

  const {
    data: services,
    isLoading: isServicesLoading,
    error: servicesError,
  } = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  });

  if (isLoading || isServicesLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );

  if (error || servicesError)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Alert
          message="Failed to load promotion details."
          type="error"
          showIcon
        />
      </div>
    );

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-8 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.02 }}
      >
        <Card
          title={
            <Title level={3} className="text-blue-600 text-center">
              {promotion?.promotionName}
            </Title>
          }
          bordered={false}
          className="shadow-xl max-w-3xl w-full p-6"
          style={{ width: 400 }}
        >
          <div className="text-center mb-4">
            <Text style={{ display: "flex", justifyContent: "space-between" }}>
              <Text>
                <b>Start:</b>{" "}
                <Tag color="blue">
                  {dayjs(promotion?.startDate).format("DD/MM/YYYY")}
                </Tag>
              </Text>
              <Text>
                <b> End:</b>{" "}
                <Tag color="red">
                  {dayjs(promotion?.endDate).format("DD/MM/YYYY")}
                </Tag>
              </Text>
            </Text>
          </div>

          <p className="text-lg font-bold text-green-600 text-center">
            🔥 {promotion?.discountPercent}% OFF
          </p>

          <Title level={4} className="mt-4">
            📋 Services Included:
          </Title>
          <List
            bordered
            dataSource={promotion?.servicePromotions}
            renderItem={(sp) => {
              const service = services?.data?.find(
                (s: { serviceId: number }) => s.serviceId === sp.serviceId
              );
              return (
                <List.Item>
                  <Text>
                    {service
                      ? `${service.serviceName} - $${service.servicePrice}`
                      : "Service not found"}
                  </Text>
                </List.Item>
              );
            }}
          />

          <div className="flex justify-center mt-6">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button type="primary" size="large" onClick={() => router.back()}>
                ← Back to Promotions
              </Button>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
