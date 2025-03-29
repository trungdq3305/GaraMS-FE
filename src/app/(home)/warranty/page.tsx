// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import React, { useState, useEffect } from "react";
// import axiosInstance from "@/dbUtils/axios";
// import {
//   Card,
//   Typography,
//   Spin,
//   Result,
//   Button,
//   Empty,
//   Tag,
//   Space,
//   Tabs,
//   Modal,
//   Descriptions,
//   message,
// } from "antd";
// import Link from "next/link";
// import { motion } from "framer-motion";
// import {
//   CalendarOutlined,
//   FileTextOutlined,
//   EyeOutlined,
// } from "@ant-design/icons";

// const { Title, Text } = Typography;
// const { TabPane } = Tabs;

// // Interface cho Warranty History
// interface WarrantyHistory {
//   warrantyHistoryId: number;
//   startDay: string;
//   endDay: string;
//   note: string;
//   status: boolean;
//   serviceId: number;
//   appointmentId: number;
// }

// interface Service {
//   serviceId: number;
//   serviceName: string;
// }

// interface AppointmentData {
//   appointmentId: number;
//   date: string;
//   note: string;
//   status: string;
//   createdAt: string;
//   updatedAt: string;
//   vehicle: {
//     vehicleId: number;
//     plateNumber: string;
//     brand: string;
//     model: string;
//   };
// }

// // Interface cho Warranty Inventory
// interface Inventory {
//   inventoryId: number;
//   inventoryInvoiceId: number;
//   price: number;
//   inventory?: any;
//   inventoryInvoice: {
//     inventoryInvoiceId: number;
//     price: number;
//     diliverType: string;
//     paymentMethod: string;
//     totalAmount: number;
//     status: string;
//     date: string;
//     userId: number;
//     inventoryInvoiceDetails: any[];
//     user?: any;
//   };
//   inventoryWarranties: any[];
// }

// interface WarrantyInventory {
//   inventoryWarrantyId: number;
//   startDay: string;
//   endDay: string;
//   status: boolean;
//   inventoryInvoiceDetailId: number;
//   appointmentId: number | null;
//   appointment?: any;
//   inventoryInvoiceDetail: Inventory;
// }

// const WarrantyPage = () => {
//   const [warrantyHistories, setWarrantyHistories] = useState<WarrantyHistory[]>(
//     []
//   );
//   const [warrantyInventories, setWarrantyInventories] = useState<
//     WarrantyInventory[]
//   >([]);
//   const [servicesMap, setServicesMap] = useState<Record<number, Service>>({});
//   const [isLoadingHistory, setIsLoadingHistory] = useState(true);
//   const [isLoadingInventory, setIsLoadingInventory] = useState(true);
//   const [errorHistory, setErrorHistory] = useState<Error | null>(null);
//   const [errorInventory, setErrorInventory] = useState<Error | null>(null);
//   const [appointmentModalVisible, setAppointmentModalVisible] = useState(false);
//   const [selectedAppointment, setSelectedAppointment] =
//     useState<AppointmentData | null>(null);
//   const [activeTab, setActiveTab] = useState("warrantyHistory");

//   // Fetch Warranty History
//   useEffect(() => {
//     const fetchWarrantyHistories = async () => {
//       try {
//         setIsLoadingHistory(true);
//         const response = await axiosInstance.get(
//           "warrantyhistory/warranty-of-login"
//         );
//         if (response.data.isSuccess) {
//           const data: WarrantyHistory[] = response.data.data;
//           setWarrantyHistories(data);

//           const uniqueServiceIds = [...new Set(data.map((w) => w.serviceId))];
//           const servicePromises = uniqueServiceIds.map((id) =>
//             axiosInstance.get(`service/service/${id}`)
//           );

//           const serviceResponses = await Promise.all(servicePromises);
//           const services: Record<number, Service> = {};
//           serviceResponses.forEach((res) => {
//             if (res.data.isSuccess) {
//               const serviceData: Service = res.data.data;
//               services[serviceData.serviceId] = serviceData;
//             }
//           });
//           setServicesMap(services);
//         } else {
//           setErrorHistory(
//             new Error(
//               response.data.message || "Failed to fetch warranty histories"
//             )
//           );
//         }
//       } catch (err) {
//         setErrorHistory(
//           err instanceof Error ? err : new Error("An unknown error occurred")
//         );
//       } finally {
//         setIsLoadingHistory(false);
//       }
//     };

//     if (activeTab === "warrantyHistory") {
//       fetchWarrantyHistories();
//     }
//   }, [activeTab]);

//   // Fetch Warranty Inventory
//   useEffect(() => {
//     const fetchWarrantyInventories = async () => {
//       try {
//         setIsLoadingInventory(true);
//         const response = await axiosInstance.get(
//           "inventoryinvoices/get-inven-warranties"
//         );
//         setWarrantyInventories(response.data);
//       } catch (err) {
//         setErrorInventory(
//           err instanceof Error ? err : new Error("An unknown error occurred")
//         );
//       } finally {
//         setIsLoadingInventory(false);
//       }
//     };

//     if (activeTab === "warrantyInventory") {
//       fetchWarrantyInventories();
//     }
//   }, [activeTab]);

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const viewAppointment = async (appointmentId: number) => {
//     try {
//       const res = await axiosInstance.get(`appointments/${appointmentId}`);
//       if (res.data.isSuccess) {
//         setSelectedAppointment(res.data.data);
//         setAppointmentModalVisible(true);
//       } else {
//         message.error(res.data.message || "Failed to fetch appointment.");
//       }
//     } catch {
//       message.error("An error occurred while fetching appointment.");
//     }
//   };

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <Title level={2} className="text-center mb-6">
//           Warranty
//         </Title>
//       </motion.div>

//       <Tabs
//         activeKey={activeTab}
//         onChange={setActiveTab}
//         type="card"
//         className="mb-6"
//       >
//         <TabPane tab="Warranty History" key="warrantyHistory">
//           {isLoadingHistory ? (
//             <div className="p-6 flex justify-center items-center min-h-screen">
//               <Spin size="large" tip="Loading warranty histories..." />
//             </div>
//           ) : errorHistory ? (
//             <Result
//               status="error"
//               title="Failed to load warranty histories"
//               subTitle={errorHistory.message}
//               extra={
//                 <Button type="primary">
//                   <Link href="/">Back to homepage</Link>
//                 </Button>
//               }
//             />
//           ) : warrantyHistories.length === 0 ? (
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.5 }}
//             >
//               <Empty description={<span>No warranty history found</span>} />
//             </motion.div>
//           ) : (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.3, duration: 0.5 }}
//               className="space-y-4"
//             >
//               {warrantyHistories.map((warranty) => (
//                 <Card
//                   key={warranty.warrantyHistoryId}
//                   hoverable
//                   title={`Warranty History #${warranty.warrantyHistoryId}`}
//                   extra={
//                     <Tag color={warranty.status ? "green" : "red"}>
//                       {warranty.status ? "Active" : "Inactive"}
//                     </Tag>
//                   }
//                 >
//                   <Space direction="vertical" className="w-full">
//                     <div className="flex items-center">
//                       <CalendarOutlined className="mr-2" />
//                       <Text strong>Start Date:</Text>
//                       <Text className="ml-2">
//                         {formatDate(warranty.startDay)}
//                       </Text>
//                     </div>
//                     <div className="flex items-center">
//                       <CalendarOutlined className="mr-2" />
//                       <Text strong>End Date:</Text>
//                       <Text className="ml-2">
//                         {formatDate(warranty.endDay)}
//                       </Text>
//                     </div>
//                     <div className="flex items-start">
//                       <FileTextOutlined className="mr-2 mt-1" />
//                       <Text strong>Note:</Text>
//                       <Text className="ml-2">{warranty.note}</Text>
//                     </div>
//                     {servicesMap[warranty.serviceId] && (
//                       <div className="flex items-center">
//                         <Text strong>Service:</Text>
//                         <Link
//                           className="ml-2 text-blue-500 hover:underline"
//                           href={`/services/${warranty.serviceId}`}
//                         >
//                           {servicesMap[warranty.serviceId].serviceName}
//                         </Link>
//                       </div>
//                     )}
//                     <Button
//                       type="primary"
//                       icon={<EyeOutlined />}
//                       onClick={() => viewAppointment(warranty.appointmentId)}
//                     >
//                       View Appointment
//                     </Button>
//                   </Space>
//                 </Card>
//               ))}
//             </motion.div>
//           )}
//         </TabPane>

//         <TabPane tab="Warranty Inventory" key="warrantyInventory">
//           {isLoadingInventory ? (
//             <div className="p-6 flex justify-center items-center min-h-screen">
//               <Spin size="large" tip="Loading warranty inventories..." />
//             </div>
//           ) : errorInventory ? (
//             <Result
//               status="error"
//               title="Failed to load warranty inventories"
//               subTitle={errorInventory.message}
//               extra={
//                 <Button type="primary">
//                   <Link href="/">Back to homepage</Link>
//                 </Button>
//               }
//             />
//           ) : warrantyInventories.length === 0 ? (
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.5 }}
//             >
//               <Empty description={<span>No warranty inventory found</span>} />
//             </motion.div>
//           ) : (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               transition={{ delay: 0.3, duration: 0.5 }}
//               className="space-y-4"
//             >
//               {warrantyInventories.map((warranty) => (
//                 <Card
//                   key={warranty.inventoryWarrantyId}
//                   hoverable
//                   title={`Warranty Inventory #${warranty.inventoryWarrantyId}`}
//                   extra={
//                     <Tag color={warranty.status ? "green" : "red"}>
//                       {warranty.status ? "Active" : "Inactive"}
//                     </Tag>
//                   }
//                 >
//                   <Space direction="vertical" className="w-full">
//                     <div className="flex items-center">
//                       <CalendarOutlined className="mr-2" />
//                       <Text strong>Start Date:</Text>
//                       <Text className="ml-2">
//                         {formatDate(warranty.startDay)}
//                       </Text>
//                     </div>
//                     <div className="flex items-center">
//                       <CalendarOutlined className="mr-2" />
//                       <Text strong>End Date:</Text>
//                       <Text className="ml-2">
//                         {formatDate(warranty.endDay)}
//                       </Text>
//                     </div>
//                     <div className="flex items-center">
//                       <FileTextOutlined className="mr-2" />
//                       <Text strong>Invoice Detail ID:</Text>
//                       <Text className="ml-2">
//                         {warranty.inventoryInvoiceDetailId}
//                       </Text>
//                     </div>
//                     <div className="flex items-center">
//                       <Text strong>Price:</Text>
//                       <Text className="ml-2">
//                         ${warranty.inventoryInvoiceDetail.price}
//                       </Text>
//                     </div>
//                     <div className="flex items-center">
//                       <Text strong>Invoice Date:</Text>
//                       <Text className="ml-2">
//                         {formatDate(
//                           warranty.inventoryInvoiceDetail.inventoryInvoice.date
//                         )}
//                       </Text>
//                     </div>
//                     <div className="flex items-center">
//                       <Text strong>Total Amount:</Text>
//                       <Text className="ml-2">
//                         $
//                         {
//                           warranty.inventoryInvoiceDetail.inventoryInvoice
//                             .totalAmount
//                         }
//                       </Text>
//                     </div>
//                     <div className="flex items-center">
//                       <Text strong>Delivery Type:</Text>
//                       <Text className="ml-2">
//                         {
//                           warranty.inventoryInvoiceDetail.inventoryInvoice
//                             .diliverType
//                         }
//                       </Text>
//                     </div>
//                     <div className="flex items-center">
//                       <Text strong>Payment Method:</Text>
//                       <Text className="ml-2">
//                         {
//                           warranty.inventoryInvoiceDetail.inventoryInvoice
//                             .paymentMethod
//                         }
//                       </Text>
//                     </div>
//                   </Space>
//                 </Card>
//               ))}
//             </motion.div>
//           )}
//         </TabPane>
//       </Tabs>

//       {/* Modal for Appointment Details */}
//       <Modal
//         title={`Appointment #${selectedAppointment?.appointmentId}`}
//         visible={appointmentModalVisible}
//         onCancel={() => setAppointmentModalVisible(false)}
//         footer={[
//           <Button key="close" onClick={() => setAppointmentModalVisible(false)}>
//             Close
//           </Button>,
//         ]}
//       >
//         {selectedAppointment ? (
//           <Descriptions bordered column={1}>
//             <Descriptions.Item label="Appointment Date">
//               {formatDate(selectedAppointment.date)}
//             </Descriptions.Item>
//             <Descriptions.Item label="Note">
//               {selectedAppointment.note}
//             </Descriptions.Item>
//             <Descriptions.Item label="Status">
//               {selectedAppointment.status}
//             </Descriptions.Item>
//             <Descriptions.Item label="Created At">
//               {formatDate(selectedAppointment.createdAt)}
//             </Descriptions.Item>
//             <Descriptions.Item label="Updated At">
//               {formatDate(selectedAppointment.updatedAt)}
//             </Descriptions.Item>
//             <Descriptions.Item label="Vehicle Info">
//               Plate: {selectedAppointment.vehicle.plateNumber} | Brand:{" "}
//               {selectedAppointment.vehicle.brand} | Model:{" "}
//               {selectedAppointment.vehicle.model}
//             </Descriptions.Item>
//           </Descriptions>
//         ) : (
//           <Spin tip="Loading appointment details..." />
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default WarrantyPage;
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import axiosInstance from "@/dbUtils/axios";
import {
  Card,
  Typography,
  Spin,
  Result,
  Button,
  Empty,
  Tag,
  Space,
  Tabs,
  Modal,
  Descriptions,
  message,
} from "antd";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CalendarOutlined,
  FileTextOutlined,
  EyeOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { TabPane } = Tabs;

// Interface cho Warranty History
interface WarrantyHistory {
  warrantyHistoryId: number;
  startDay: string;
  endDay: string;
  note: string;
  status: boolean;
  serviceId: number;
  appointmentId: number;
}

interface Service {
  serviceId: number;
  serviceName: string;
}

interface AppointmentData {
  appointmentId: number;
  date: string;
  note: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  vehicle: {
    vehicleId: number;
    plateNumber: string;
    brand: string;
    model: string;
  };
}

// Interface cho Warranty Inventory
interface Inventory {
  inventoryId: number;
  inventoryInvoiceId: number;
  price: number;
  inventory?: any;
  inventoryInvoice: {
    inventoryInvoiceId: number;
    price: number;
    diliverType: string;
    paymentMethod: string;
    totalAmount: number;
    status: string;
    date: string;
    userId: number;
    inventoryInvoiceDetails: any[];
    user?: any;
  };
  inventoryWarranties: any[];
}

interface WarrantyInventory {
  inventoryWarrantyId: number;
  startDay: string;
  endDay: string;
  status: boolean;
  inventoryInvoiceDetailId: number | null;
  appointmentId: number | null;
  appointment?: AppointmentData | null;
  inventoryInvoiceDetail: Inventory | null;
}

const WarrantyPage = () => {
  const [warrantyHistories, setWarrantyHistories] = useState<WarrantyHistory[]>(
    []
  );
  const [warrantyInventories, setWarrantyInventories] = useState<
    WarrantyInventory[]
  >([]);
  const [servicesMap, setServicesMap] = useState<Record<number, Service>>({});
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isLoadingInventory, setIsLoadingInventory] = useState(true);
  const [errorHistory, setErrorHistory] = useState<Error | null>(null);
  const [errorInventory, setErrorInventory] = useState<Error | null>(null);
  const [appointmentModalVisible, setAppointmentModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentData | null>(null);
  const [activeTab, setActiveTab] = useState("warrantyHistory");

  // Fetch Warranty History
  useEffect(() => {
    const fetchWarrantyHistories = async () => {
      try {
        setIsLoadingHistory(true);
        const response = await axiosInstance.get(
          "warrantyhistory/warranty-of-login"
        );
        if (response.data.isSuccess) {
          const data: WarrantyHistory[] = response.data.data;
          setWarrantyHistories(data);

          const uniqueServiceIds = [...new Set(data.map((w) => w.serviceId))];
          const servicePromises = uniqueServiceIds.map((id) =>
            axiosInstance.get(`service/service/${id}`)
          );

          const serviceResponses = await Promise.all(servicePromises);
          const services: Record<number, Service> = {};
          serviceResponses.forEach((res) => {
            if (res.data.isSuccess) {
              const serviceData: Service = res.data.data;
              services[serviceData.serviceId] = serviceData;
            }
          });
          setServicesMap(services);
        } else {
          setErrorHistory(
            new Error(
              response.data.message || "Failed to fetch warranty histories"
            )
          );
        }
      } catch (err) {
        setErrorHistory(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
      } finally {
        setIsLoadingHistory(false);
      }
    };

    if (activeTab === "warrantyHistory") {
      fetchWarrantyHistories();
    }
  }, [activeTab]);

  // Fetch Warranty Inventory
  useEffect(() => {
    const fetchWarrantyInventories = async () => {
      try {
        setIsLoadingInventory(true);
        const response = await axiosInstance.get(
          "inventoryinvoices/get-inven-warranties"
        );
        setWarrantyInventories(response.data);
      } catch (err) {
        setErrorInventory(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
      } finally {
        setIsLoadingInventory(false);
      }
    };

    if (activeTab === "warrantyInventory") {
      fetchWarrantyInventories();
    }
  }, [activeTab]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const viewAppointment = async (appointmentId: number) => {
    try {
      const res = await axiosInstance.get(`appointments/${appointmentId}`);
      if (res.data.isSuccess) {
        setSelectedAppointment(res.data.data);
        setAppointmentModalVisible(true);
      } else {
        message.error(res.data.message || "Failed to fetch appointment.");
      }
    } catch {
      message.error("An error occurred while fetching appointment.");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title level={2} className="text-center mb-6">
          Warranty
        </Title>
      </motion.div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type="card"
        className="mb-6"
      >
        <TabPane tab="Warranty History" key="warrantyHistory">
          {isLoadingHistory ? (
            <div className="p-6 flex justify-center items-center min-h-screen">
              <Spin size="large" tip="Loading warranty histories..." />
            </div>
          ) : errorHistory ? (
            <Result
              status="error"
              title="Failed to load warranty histories"
              subTitle={errorHistory.message}
              extra={
                <Button type="primary">
                  <Link href="/">Back to homepage</Link>
                </Button>
              }
            />
          ) : warrantyHistories.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Empty description={<span>No warranty history found</span>} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="space-y-4"
            >
              {warrantyHistories.map((warranty) => (
                <Card
                  key={warranty.warrantyHistoryId}
                  hoverable
                  title={`Warranty History #${warranty.warrantyHistoryId}`}
                  extra={
                    <Tag color={warranty.status ? "green" : "red"}>
                      {warranty.status ? "Active" : "Inactive"}
                    </Tag>
                  }
                >
                  <Space direction="vertical" className="w-full">
                    <div className="flex items-center">
                      <CalendarOutlined className="mr-2" />
                      <Text strong>Start Date:</Text>
                      <Text className="ml-2">
                        {formatDate(warranty.startDay)}
                      </Text>
                    </div>
                    <div className="flex items-center">
                      <CalendarOutlined className="mr-2" />
                      <Text strong>End Date:</Text>
                      <Text className="ml-2">
                        {formatDate(warranty.endDay)}
                      </Text>
                    </div>
                    <div className="flex items-start">
                      <FileTextOutlined className="mr-2 mt-1" />
                      <Text strong>Note:</Text>
                      <Text className="ml-2">{warranty.note}</Text>
                    </div>
                    {servicesMap[warranty.serviceId] && (
                      <div className="flex items-center">
                        <Text strong>Service:</Text>
                        <Link
                          className="ml-2 text-blue-500 hover:underline"
                          href={`/services/${warranty.serviceId}`}
                        >
                          {servicesMap[warranty.serviceId].serviceName}
                        </Link>
                      </div>
                    )}
                    <Button
                      type="primary"
                      icon={<EyeOutlined />}
                      onClick={() => viewAppointment(warranty.appointmentId)}
                    >
                      View Appointment
                    </Button>
                  </Space>
                </Card>
              ))}
            </motion.div>
          )}
        </TabPane>

        <TabPane tab="Warranty Inventory" key="warrantyInventory">
          {isLoadingInventory ? (
            <div className="p-6 flex justify-center items-center min-h-screen">
              <Spin size="large" tip="Loading warranty inventories..." />
            </div>
          ) : errorInventory ? (
            <Result
              status="error"
              title="Failed to load warranty inventories"
              subTitle={errorInventory.message}
              extra={
                <Button type="primary">
                  <Link href="/">Back to homepage</Link>
                </Button>
              }
            />
          ) : warrantyInventories.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Empty description={<span>No warranty inventory found</span>} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="space-y-4"
            >
              {warrantyInventories.map((warranty) => (
                <Card
                  key={warranty.inventoryWarrantyId}
                  hoverable
                  title={`Warranty Inventory #${warranty.inventoryWarrantyId}`}
                  extra={
                    <Tag color={warranty.status ? "green" : "red"}>
                      {warranty.status ? "Active" : "Inactive"}
                    </Tag>
                  }
                >
                  <Space direction="vertical" className="w-full">
                    <div className="flex items-center">
                      <Text strong>Source:</Text>
                      <Text className="ml-2">
                        {warranty.appointmentId
                          ? "From Appointment"
                          : "From Cart"}
                      </Text>
                    </div>
                    <div className="flex items-center">
                      <CalendarOutlined className="mr-2" />
                      <Text strong>Start Date:</Text>
                      <Text className="ml-2">
                        {formatDate(warranty.startDay)}
                      </Text>
                    </div>
                    <div className="flex items-center">
                      <CalendarOutlined className="mr-2" />
                      <Text strong>End Date:</Text>
                      <Text className="ml-2">
                        {formatDate(warranty.endDay)}
                      </Text>
                    </div>
                    {warranty.inventoryInvoiceDetail ? (
                      <>
                        <div className="flex items-center">
                          <FileTextOutlined className="mr-2" />
                          <Text strong>Invoice Detail ID:</Text>
                          <Text className="ml-2">
                            {warranty.inventoryInvoiceDetailId}
                          </Text>
                        </div>
                        <div className="flex items-center">
                          <Text strong>Price:</Text>
                          <Text className="ml-2">
                            ${warranty.inventoryInvoiceDetail.price}
                          </Text>
                        </div>
                        <div className="flex items-center">
                          <Text strong>Invoice Date:</Text>
                          <Text className="ml-2">
                            {formatDate(
                              warranty.inventoryInvoiceDetail.inventoryInvoice
                                .date
                            )}
                          </Text>
                        </div>
                        <div className="flex items-center">
                          <Text strong>Total Amount:</Text>
                          <Text className="ml-2">
                            $
                            {
                              warranty.inventoryInvoiceDetail.inventoryInvoice
                                .totalAmount
                            }
                          </Text>
                        </div>
                        <div className="flex items-center">
                          <Text strong>Delivery Type:</Text>
                          <Text className="ml-2">
                            {
                              warranty.inventoryInvoiceDetail.inventoryInvoice
                                .diliverType
                            }
                          </Text>
                        </div>
                        <div className="flex items-center">
                          <Text strong>Payment Method:</Text>
                          <Text className="ml-2">
                            {
                              warranty.inventoryInvoiceDetail.inventoryInvoice
                                .paymentMethod
                            }
                          </Text>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center">
                        <Text italic>No invoice details available</Text>
                      </div>
                    )}
                    {warranty.appointmentId && (
                      <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={() => viewAppointment(warranty.appointmentId!)}
                      >
                        View Appointment
                      </Button>
                    )}
                  </Space>
                </Card>
              ))}
            </motion.div>
          )}
        </TabPane>
      </Tabs>

      {/* Modal for Appointment Details */}
      <Modal
        title={`Appointment #${selectedAppointment?.appointmentId}`}
        visible={appointmentModalVisible}
        onCancel={() => setAppointmentModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setAppointmentModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {selectedAppointment ? (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Appointment Date">
              {formatDate(selectedAppointment.date)}
            </Descriptions.Item>
            <Descriptions.Item label="Note">
              {selectedAppointment.note}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {selectedAppointment.status}
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {formatDate(selectedAppointment.createdAt)}
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              {formatDate(selectedAppointment.updatedAt)}
            </Descriptions.Item>
            <Descriptions.Item label="Vehicle Info">
              Plate: {selectedAppointment.vehicle.plateNumber} | Brand:{" "}
              {selectedAppointment.vehicle.brand} | Model:{" "}
              {selectedAppointment.vehicle.model}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <Spin tip="Loading appointment details..." />
        )}
      </Modal>
    </div>
  );
};

export default WarrantyPage;
