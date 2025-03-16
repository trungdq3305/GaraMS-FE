// "use client";
// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { useParams } from "next/navigation";
// import { getServiceById } from "@/dbUtils/ManagerAPIs/serviceservice";
// import Link from "next/link";

// interface ServiceData {
//   serviceId: number;
//   serviceName: string;
//   description: string;
//   servicePrice: number;
//   inventoryPrice: number;
//   promotion: number;
//   totalPrice: number;
//   estimatedTime: number;
//   status: boolean;
//   createdAt: string;
//   updatedAt: string;
//   warrantyPeriod: number;
//   categoryId: number;
// }

// interface ApiResponse {
//   isSuccess: boolean;
//   code: number;
//   data: ServiceData;
//   message: string;
// }

// export default function ServiceDetailPage() {
//   const params = useParams();
//   const [service, setService] = useState<ServiceData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchServiceDetail = async () => {
//       try {
//         const serviceId = params.serviceId;
//         if (!serviceId) {
//           setError("Service ID not found");
//           setLoading(false);
//           return;
//         }

//         const response: ApiResponse = await getServiceById(
//           parseInt(serviceId as string)
//         );

//         if (response.isSuccess && response.data) {
//           setService(response.data);
//         } else {
//           setError(response.message || "Failed to fetch service details");
//         }
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching service details:", error);
//         setError("An error occurred while fetching service details");
//         setLoading(false);
//       }
//     };

//     fetchServiceDetail();
//   }, [params.serviceId]);

//   const defaultImage =
//     "https://www.kbb.com/wp-content/uploads/2021/08/car-maintenance-guide.jpeg";

//   if (loading) {
//     return (
//       <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-screen">
//         <p className="text-xl">Loading service details...</p>
//       </div>
//     );
//   }

//   if (error || !service) {
//     return (
//       <div className="container mx-auto px-4 py-8 flex flex-col justify-center items-center min-h-screen">
//         <p className="text-xl text-red-500 mb-4">
//           {error || "Service not found"}
//         </p>
//         <Link href="/services">
//           <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md">
//             Back to Services
//           </button>
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="mb-6">
//         <Link href="/services">
//           <button className="flex items-center text-blue-600 hover:text-blue-800">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-5 w-5 mr-1"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M10 19l-7-7m0 0l7-7m-7 7h18"
//               />
//             </svg>
//             Back to Services
//           </button>
//         </Link>
//       </div>

//       <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//         <div className="relative h-64 w-full">
//           <Image
//             src={defaultImage}
//             alt={service.serviceName}
//             fill
//             className="object-cover"
//           />
//         </div>

//         <div className="p-6">
//           <h1 className="text-3xl font-bold mb-4">{service.serviceName}</h1>

//           <div className="bg-gray-100 p-4 rounded-lg mb-6">
//             <p className="text-gray-700 text-lg">{service.description}</p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
//             <div className="bg-blue-50 p-4 rounded-lg">
//               <h3 className="text-lg font-semibold mb-2">Service Details</h3>
//               <ul className="space-y-2">
//                 {service.servicePrice !== null && (
//                   <li className="flex justify-between">
//                     <span>Service Price:</span>
//                     <span className="font-medium">${service.servicePrice}</span>
//                   </li>
//                 )}
//                 {service.inventoryPrice !== null && (
//                   <li className="flex justify-between">
//                     <span>Parts/Inventory:</span>
//                     <span className="font-medium">
//                       ${service.inventoryPrice}
//                     </span>
//                   </li>
//                 )}
//                 {service.promotion !== null && service.promotion > 0 && (
//                   <li className="flex justify-between">
//                     <span>Discount:</span>
//                     <span className="font-medium text-green-600">
//                       -${service.promotion}
//                     </span>
//                   </li>
//                 )}
//                 <li className="flex justify-between border-t pt-2 mt-2">
//                   <span className="font-bold">Total Price:</span>
//                   <span className="font-bold text-xl">
//                     ${service.totalPrice.toLocaleString()}
//                   </span>
//                 </li>
//               </ul>
//             </div>

//             <div className="bg-gray-50 p-4 rounded-lg">
//               <h3 className="text-lg font-semibold mb-2">
//                 Additional Information
//               </h3>
//               <ul className="space-y-2">
//                 {service.estimatedTime && (
//                   <li className="flex justify-between">
//                     <span>Estimated Time:</span>
//                     <span className="font-medium">
//                       {service.estimatedTime} minutes
//                     </span>
//                   </li>
//                 )}
//                 {service.warrantyPeriod && (
//                   <li className="flex justify-between">
//                     <span>Warranty Period:</span>
//                     <span className="font-medium">
//                       {service.warrantyPeriod} days
//                     </span>
//                   </li>
//                 )}
//                 <li className="flex justify-between">
//                   <span>Status:</span>
//                   <span
//                     className={`font-medium ${
//                       service.status ? "text-green-600" : "text-red-600"
//                     }`}
//                   >
//                     {service.status ? "Available" : "Unavailable"}
//                   </span>
//                 </li>
//                 <li className="flex justify-between">
//                   <span>Created:</span>
//                   <span className="font-medium">
//                     {new Date(service.createdAt).toLocaleDateString()}
//                   </span>
//                 </li>
//                 {service.categoryId && (
//                   <li className="flex justify-between">
//                     <span>Category ID:</span>
//                     <span className="font-medium">{service.categoryId}</span>
//                   </li>
//                 )}
//               </ul>
//             </div>
//           </div>

//           <div className="flex justify-center mt-6">
//             <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-md text-lg font-medium transition-colors duration-300">
//               Book This Service
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getServiceById } from "@/dbUtils/ManagerAPIs/serviceservice";
import Link from "next/link";
import Image from "next/image";
import { Card, Typography, Button, Row, Col, Skeleton, Tag } from "antd";
import { motion } from "framer-motion";
import { ArrowLeftOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;

interface ServiceData {
  serviceId: number;
  serviceName: string;
  description: string;
  servicePrice: number;
  inventoryPrice: number;
  promotion: number;
  totalPrice: number;
  estimatedTime: number;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  warrantyPeriod: number;
  categoryId: number;
}

interface ApiResponse {
  isSuccess: boolean;
  code: number;
  data: ServiceData;
  message: string;
}

export default function ServiceDetailPage() {
  const params = useParams();
  const [service, setService] = useState<ServiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServiceDetail = async () => {
      try {
        const serviceId = params.serviceId;
        if (!serviceId) {
          setError("Service ID not found");
          setLoading(false);
          return;
        }

        const response: ApiResponse = await getServiceById(
          parseInt(serviceId as string)
        );

        if (response.isSuccess && response.data) {
          setService(response.data);
        } else {
          setError(response.message || "Failed to fetch service details");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching service details:", error);
        setError("An error occurred while fetching service details");
        setLoading(false);
      }
    };

    fetchServiceDetail();
  }, [params.serviceId]);

  const defaultImage =
    "https://www.kbb.com/wp-content/uploads/2021/08/car-maintenance-guide.jpeg";

  return (
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/services">
          <Button
            icon={<ArrowLeftOutlined />}
            type="link"
            style={{ padding: 0, paddingBottom: 20, fontSize: 16 }}
          >
            Back to Services
          </Button>
        </Link>
      </motion.div>

      {loading ? (
        <Skeleton active />
      ) : error || !service ? (
        <div className="flex flex-col items-center mt-10">
          <Text type="danger" className="text-lg">
            {error || "Service not found"}
          </Text>
          <Link href="/services">
            <Button type="primary" className="mt-4">
              Back to Services
            </Button>
          </Link>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            className="rounded-lg shadow-md"
            cover={
              <Image
                src={defaultImage}
                alt={service.serviceName}
                width={800}
                height={400}
                className="object-cover"
                style={{ height: "16rem" }}
              />
            }
          >
            <Title level={2}>{service.serviceName}</Title>
            <Text type="secondary">{service.description}</Text>

            <Row gutter={[16, 16]} className="mt-6">
              <Col xs={24} md={12}>
                <Card bordered={false} className="bg-blue-50">
                  <Title level={4}>Service Details</Title>
                  <p>
                    Service Price: <Text strong>${service.servicePrice}</Text>
                  </p>
                  <p>
                    Parts/Inventory:{" "}
                    <Text strong>${service.inventoryPrice}</Text>
                  </p>
                  {service.promotion > 0 && (
                    <p>
                      Discount:{" "}
                      <Text strong type="success">
                        -${service.promotion}
                      </Text>
                    </p>
                  )}
                  <p>
                    <strong>Total Price:</strong>{" "}
                    <Text strong type="danger" className="text-xl">
                      ${service.totalPrice}
                    </Text>
                  </p>
                </Card>
              </Col>

              <Col xs={24} md={12}>
                <Card bordered={false} className="bg-gray-50">
                  <Title level={4}>Additional Information</Title>
                  <p>
                    Estimated Time:{" "}
                    <Text strong>{service.estimatedTime} minutes</Text>
                  </p>
                  <p>
                    Warranty Period:{" "}
                    <Text strong>{service.warrantyPeriod} days</Text>
                  </p>
                  <p>
                    Status:{" "}
                    {service.status ? (
                      <Tag color="green">Available</Tag>
                    ) : (
                      <Tag color="red">Unavailable</Tag>
                    )}
                  </p>
                  <p>
                    Created On:{" "}
                    <Text>{dayjs(service.createdAt).format("DD/MM/YYYY")}</Text>
                  </p>
                  <p>
                    Category ID: <Text>{service.categoryId}</Text>
                  </p>
                </Card>
              </Col>
            </Row>

            <div className="flex justify-center mt-6">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button type="primary" size="large">
                  Book This Service
                </Button>
              </motion.div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
