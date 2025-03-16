// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { getAppointmentsByCustomer } from "@/dbUtils/appointmentAPIs/appointment";
// import Link from "next/link";
// import axios from "axios";

// // Define the types based on your API response
// interface Service {
//   serviceId: number;
//   serviceName: string;
//   description: string;
//   servicePrice: number;
//   inventoryPrice: number;
//   promotion: number;
//   totalPrice: number;
//   estimatedTime: number;
//   status: boolean;
//   warrantyPeriod: number;
//   categoryId: number;
// }

// interface AppointmentService {
//   appointmentServiceId: number;
//   serviceId: number;
//   appointmentId: number;
//   employeeId: number | null;
//   service: Service;
// }

// interface Vehicle {
//   vehicleId: number;
//   plateNumber: string;
//   brand: string;
//   model: string;
//   customerId: number;
// }

// interface Appointment {
//   appointmentId: number;
//   date: string;
//   note: string;
//   status: string;
//   createdAt: string;
//   updatedAt: string;
//   waitingTime: string | null;
//   rejectReason: string | null;
//   vehicleId: number;
//   appointmentStatusId: number | null;
//   appointmentServices: AppointmentService[];
//   vehicle: Vehicle;
// }

// interface AppointmentResponse {
//   isSuccess: boolean;
//   code: number;
//   data: Appointment[] | Appointment;
//   message: string;
// }

// const Appointments = () => {
//   const router = useRouter();
//   const [appointments, setAppointments] = useState<Appointment[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<Error | null>(null);
//   const [activeTab, setActiveTab] = useState("All");

//   useEffect(() => {
//     const fetchAppointments = async () => {
//       try {
//         setIsLoading(true);
//         const response =
//           (await getAppointmentsByCustomer()) as AppointmentResponse;
//         if (response.isSuccess && response.data) {
//           setAppointments(
//             Array.isArray(response.data) ? response.data : [response.data]
//           );
//         } else {
//           setError(
//             new Error(response.message || "Failed to fetch appointments")
//           );
//         }
//       } catch (err) {
//         setError(
//           err instanceof Error ? err : new Error("An unknown error occurred")
//         );
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchAppointments();
//   }, []);
//   const handlePayment = async (appointmentId: number) => {
//     try {
//       const iidResponse = await axios.get(
//         `https://localhost:7102/api/invoices/iid-by-aid?aid=${appointmentId}`
//       );
//       const iid = iidResponse.data;

//       if (iid) {
//         const paymentResponse = await axios.post(
//           `https://localhost:7102/api/invoices/pay-single-invoice/${iid}`
//         );
//         window.location.href = paymentResponse.data.url;
//       } else {
//         alert("Không tìm thấy hóa đơn cho cuộc hẹn này.");
//       }
//     } catch (error) {
//       console.error("Lỗi khi xử lý thanh toán:", error);
//       alert("Có lỗi xảy ra khi thanh toán.");
//     }
//   };
//   const statusTabs = ["All", "Pending", "Accept", "Reject", "Paid", "Complete"];

//   const filteredAppointments =
//     activeTab === "All"
//       ? appointments
//       : appointments.filter((appointment) => appointment.status === activeTab);

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   if (isLoading) {
//     return (
//       <div className="p-6 flex justify-center items-center min-h-[50vh]">
//         <div className="text-xl">Loading appointments...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-6 flex flex-col justify-center items-center min-h-[50vh]">
//         <div className="text-xl text-red-500 mb-4">
//           {error.message || "Error loading appointments"}
//         </div>
//         <Link
//           href="/"
//           className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
//         >
//           Back to homepage
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <h2 className="text-3xl font-bold mb-6 text-center">My Appointments</h2>

//       {/* Status Tabs */}
//       <div className="flex overflow-x-auto mb-6 bg-gray-100 rounded-lg p-1">
//         {statusTabs.map((tab) => (
//           <button
//             key={tab}
//             className={`px-4 py-2 whitespace-nowrap rounded-md ${
//               activeTab === tab
//                 ? "bg-blue-600 text-white"
//                 : "bg-transparent hover:bg-gray-200"
//             }`}
//             onClick={() => setActiveTab(tab)}
//           >
//             {tab}
//           </button>
//         ))}
//       </div>

//       {filteredAppointments.length === 0 ? (
//         <div className="p-6 flex flex-col justify-center items-center min-h-[30vh]">
//           <div className="text-xl mb-4">
//             No {activeTab !== "All" ? activeTab.toLowerCase() : ""} appointments
//             found
//           </div>
//           <Link
//             href="/book-appointment"
//             className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
//           >
//             Book a new appointment
//           </Link>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {filteredAppointments.map((appointment) => (
//             <div
//               key={appointment.appointmentId}
//               className="bg-white shadow-lg rounded-lg p-6 border"
//             >
//               <div className="flex justify-between items-start mb-4">
//                 <div>
//                   <h3 className="font-bold text-lg">
//                     Appointment #{appointment.appointmentId}
//                   </h3>
//                   <p className="text-gray-600">
//                     {formatDate(appointment.date)}
//                   </p>
//                 </div>
//                 <span
//                   className={`px-3 py-1 rounded-full text-white ${
//                     appointment.status === "Pending"
//                       ? "bg-yellow-500"
//                       : appointment.status === "Accept"
//                       ? "bg-green-500"
//                       : appointment.status === "Reject"
//                       ? "bg-red-500"
//                       : appointment.status === "Paid"
//                       ? "bg-blue-500"
//                       : appointment.status === "Complete"
//                       ? "bg-purple-500"
//                       : "bg-gray-500"
//                   }`}
//                 >
//                   {appointment.status}
//                 </span>
//               </div>

//               <div className="mb-4">
//                 <p>
//                   <strong>Vehicle:</strong> {appointment.vehicle.brand}{" "}
//                   {appointment.vehicle.model} ({appointment.vehicle.plateNumber}
//                   )
//                 </p>
//                 <p>
//                   <strong>Note:</strong> {appointment.note || "No notes"}
//                 </p>
//                 {appointment.rejectReason && (
//                   <p>
//                     <strong>Reject Reason:</strong> {appointment.rejectReason}
//                   </p>
//                 )}
//               </div>

//               <div className="mb-4">
//                 <h4 className="font-semibold">Services:</h4>
//                 <ul className="list-disc list-inside ml-2">
//                   {appointment.appointmentServices.map((service) => (
//                     <li key={service.appointmentServiceId} className="ml-2">
//                       {service.service.serviceName} - $
//                       {service.service.totalPrice}
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               <div className="flex justify-between">
//                 <div>
//                   <strong>Total:</strong> $
//                   {appointment.appointmentServices.reduce(
//                     (sum, service) => sum + service.service.totalPrice,
//                     0
//                   )}
//                 </div>
//                 {appointment.status === "Accept" && (
//                   <button
//                     onClick={() => handlePayment(appointment.appointmentId)}
//                     className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
//                   >
//                     Thanh toán
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Appointments;
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAppointmentsByCustomer } from "@/dbUtils/appointmentAPIs/appointment";
import Link from "next/link";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Card,
  Button,
  Tabs,
  Tag,
  Typography,
  Spin,
  Empty,
  Divider,
  List,
  Space,
  Result,
  Alert,
} from "antd";
import {
  CarOutlined,
  CalendarOutlined,
  DollarOutlined,
  FileTextOutlined,
  CreditCardOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// Define the types based on your API response
interface Service {
  serviceId: number;
  serviceName: string;
  description: string;
  servicePrice: number;
  inventoryPrice: number;
  promotion: number;
  totalPrice: number;
  estimatedTime: number;
  status: boolean;
  warrantyPeriod: number;
  categoryId: number;
}

interface AppointmentService {
  appointmentServiceId: number;
  serviceId: number;
  appointmentId: number;
  employeeId: number | null;
  service: Service;
}

interface Vehicle {
  vehicleId: number;
  plateNumber: string;
  brand: string;
  model: string;
  customerId: number;
}

interface Appointment {
  appointmentId: number;
  date: string;
  note: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  waitingTime: string | null;
  rejectReason: string | null;
  vehicleId: number;
  appointmentStatusId: number | null;
  appointmentServices: AppointmentService[];
  vehicle: Vehicle;
}

interface AppointmentResponse {
  isSuccess: boolean;
  code: number;
  data: Appointment[] | Appointment;
  message: string;
}

const Appointments = () => {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setIsLoading(true);
        const response =
          (await getAppointmentsByCustomer()) as AppointmentResponse;
        if (response.isSuccess && response.data) {
          setAppointments(
            Array.isArray(response.data) ? response.data : [response.data]
          );
        } else {
          setError(
            new Error(response.message || "Failed to fetch appointments")
          );
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handlePayment = async (appointmentId: number) => {
    try {
      const iidResponse = await axios.get(
        `https://localhost:7102/api/invoices/iid-by-aid?aid=${appointmentId}`
      );
      const iid = iidResponse.data;

      if (iid) {
        const paymentResponse = await axios.post(
          `https://localhost:7102/api/invoices/pay-single-invoice/${iid}`
        );
        window.location.href = paymentResponse.data.url;
      } else {
        alert("Không tìm thấy hóa đơn cho cuộc hẹn này.");
      }
    } catch (error) {
      console.error("Lỗi khi xử lý thanh toán:", error);
      alert("Có lỗi xảy ra khi thanh toán.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "warning";
      case "Accept":
        return "success";
      case "Reject":
        return "error";
      case "Paid":
        return "processing";
      case "Complete":
        return "purple";
      case "Unpaid":
        return "volcano";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <Spin size="large" tip="Loading appointments..." />
      </div>
    );
  }

  if (error) {
    return (
      <Result
        status="error"
        title="Failed to load appointments"
        subTitle={error.message}
        extra={
          <Button type="primary">
            <Link href="/">Back to homepage</Link>
          </Button>
        }
      />
    );
  }

  const filteredAppointments =
    activeTab === "All"
      ? appointments
      : appointments.filter((appointment) => appointment.status === activeTab);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title level={2} className="text-center mb-6">
          My Appointments
        </Title>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <Tabs
          type="card"
          activeKey={activeTab}
          onChange={setActiveTab}
          className="mb-6"
        >
          {["All", "Pending", "Accept", "Reject", "Paid", "Complete"].map(
            (status) => (
              <TabPane tab={status} key={status} />
            )
          )}
        </Tabs>
      </motion.div>

      {filteredAppointments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Empty
            description={
              <span>
                No {activeTab !== "All" ? activeTab.toLowerCase() : ""}{" "}
                appointments found
              </span>
            }
          >
            <Button type="primary">
              <Link href="/book-appointment">Book a new appointment</Link>
            </Button>
          </Empty>
        </motion.div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {filteredAppointments.map((appointment) => (
            <motion.div key={appointment.appointmentId} variants={item}>
              <Card
                hoverable
                className="overflow-hidden"
                title={
                  <div className="flex justify-between items-center">
                    <Space>
                      <span>Appointment #{appointment.appointmentId}</span>
                    </Space>
                    <Tag color={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Tag>
                  </div>
                }
                // extra={
                //   <Text type="secondary">{formatDate(appointment.date)}</Text>
                // }
              >
                <Space direction="vertical" className="w-full">
                  <div className="flex items-center">
                    <CalendarOutlined className="mr-2" />
                    <Text strong>Date:</Text>
                    <Text className="ml-2">{formatDate(appointment.date)}</Text>
                  </div>

                  <div className="flex items-center">
                    <CarOutlined className="mr-2" />
                    <Text strong>Vehicle:</Text>
                    <Text className="ml-2">
                      {appointment.vehicle.brand} {appointment.vehicle.model} (
                      {appointment.vehicle.plateNumber})
                    </Text>
                  </div>

                  <div className="flex items-start">
                    <FileTextOutlined className="mr-2 mt-1" />
                    <Text strong>Note:</Text>
                    <Paragraph className="ml-2 mb-0">
                      {appointment.note || "No notes"}
                    </Paragraph>
                  </div>

                  {appointment.rejectReason && (
                    <Alert
                      message="Reject Reason"
                      description={appointment.rejectReason}
                      type="error"
                      showIcon
                    />
                  )}

                  <Divider orientation="left">Services</Divider>
                  <List
                    size="small"
                    dataSource={appointment.appointmentServices}
                    renderItem={(service) => (
                      <List.Item
                        key={service.appointmentServiceId}
                        className="px-4"
                      >
                        <Text>{service.service.serviceName}</Text>
                        <Text strong>${service.service.totalPrice}</Text>
                      </List.Item>
                    )}
                  />

                  <Divider />
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <DollarOutlined className="mr-2" />
                      <Text strong>Total:</Text>
                      <Text strong className="ml-2 text-lg">
                        $
                        {appointment.appointmentServices.reduce(
                          (sum, service) => sum + service.service.totalPrice,
                          0
                        )}
                      </Text>
                    </div>
                    {appointment.status === "Accept" && (
                      <Button
                        type="primary"
                        icon={<CreditCardOutlined />}
                        onClick={() => handlePayment(appointment.appointmentId)}
                      >
                        Thanh toán
                      </Button>
                    )}
                  </div>
                </Space>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Appointments;
