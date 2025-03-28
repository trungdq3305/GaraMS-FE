// "use client";

// import React, { useState, useEffect } from "react";
// import { getAppointmentsByCustomer } from "@/dbUtils/appointmentAPIs/appointment";
// import Link from "next/link";
// import axiosInstance from "@/dbUtils/axios";
// import { motion } from "framer-motion";
// import {
//   Card,
//   Button,
//   Tabs,
//   Tag,
//   Typography,
//   Spin,
//   Empty,
//   Divider,
//   List,
//   Space,
//   Result,
//   Alert,
// } from "antd";
// import {
//   CarOutlined,
//   CalendarOutlined,
//   DollarOutlined,
//   FileTextOutlined,
//   CreditCardOutlined,
// } from "@ant-design/icons";

// const { Title, Text, Paragraph } = Typography;
// const { TabPane } = Tabs;

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
//       const iidResponse = await axiosInstance.get(
//         `invoices/iid-by-aid?aid=${appointmentId}`
//       );
//       const iid = iidResponse.data;

//       if (iid) {
//         const paymentResponse = await axiosInstance.post(
//           `invoices/pay-single-invoice/${iid}`
//         );
//         window.location.href = paymentResponse.data.url;
//       } else {
//         alert("No invoice found for this appointment.");
//       }
//     } catch (error) {
//       console.error("Error process payment:", error);
//       alert("Error when execute payment.");
//     }
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "Pending":
//         return "warning";
//       case "Accept":
//         return "success";
//       case "Reject":
//         return "error";
//       case "Paid":
//         return "processing";
//       case "Complete":
//         return "purple";
//       case "Unpaid":
//         return "volcano";
//       default:
//         return "default";
//     }
//   };

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

//   const container = {
//     hidden: { opacity: 0 },
//     show: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   };

//   const item = {
//     hidden: { opacity: 0, y: 20 },
//     show: { opacity: 1, y: 0 },
//   };

//   if (isLoading) {
//     return (
//       <div className="p-6 flex justify-center items-center min-h-screen">
//         <Spin size="large" tip="Loading appointments..." />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <Result
//         status="error"
//         title="Failed to load appointments"
//         subTitle={error.message}
//         extra={
//           <Button type="primary">
//             <Link href="/">Back to homepage</Link>
//           </Button>
//         }
//       />
//     );
//   }

//   const filteredAppointments =
//     activeTab === "All"
//       ? appointments
//       : appointments.filter((appointment) => appointment.status === activeTab);

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <motion.div
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.3, duration: 0.5 }}
//       >
//         <Tabs
//           type="card"
//           activeKey={activeTab}
//           onChange={setActiveTab}
//           className="mb-6"
//         >
//           {["All", "Pending", "Accept", "Reject", "Paid", "Complete"].map(
//             (status) => (
//               <TabPane tab={status} key={status} />
//             )
//           )}
//         </Tabs>
//       </motion.div>

//       {filteredAppointments.length === 0 ? (
//         <motion.div
//           initial={{ opacity: 0, scale: 0.9 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.5 }}
//         >
//           <Empty
//             description={
//               <span>
//                 No {activeTab !== "All" ? activeTab.toLowerCase() : ""}{" "}
//                 appointments found
//               </span>
//             }
//           >
//             <Button type="primary">
//               <Link href="/book-appointment">Book a new appointment</Link>
//             </Button>
//           </Empty>
//         </motion.div>
//       ) : (
//         <motion.div
//           variants={container}
//           initial="hidden"
//           animate="show"
//           className="space-y-4"
//         >
//           {filteredAppointments.map((appointment) => (
//             <motion.div key={appointment.appointmentId} variants={item}>
//               <Card
//                 hoverable
//                 className="overflow-hidden"
//                 title={
//                   <div className="flex justify-between items-center">
//                     <Space>
//                       <span>Appointment #{appointment.appointmentId}</span>
//                     </Space>
//                     <Tag color={getStatusColor(appointment.status)}>
//                       {appointment.status}
//                     </Tag>
//                   </div>
//                 }
//                 // extra={
//                 //   <Text type="secondary">{formatDate(appointment.date)}</Text>
//                 // }
//               >
//                 <Space direction="vertical" className="w-full">
//                   <div className="flex items-center">
//                     <CalendarOutlined className="mr-2" />
//                     <Text strong>Date:</Text>
//                     <Text className="ml-2">{formatDate(appointment.date)}</Text>
//                   </div>

//                   <div className="flex items-center">
//                     <CarOutlined className="mr-2" />
//                     <Text strong>Vehicle:</Text>
//                     <Text className="ml-2">
//                       {appointment.vehicle.brand} {appointment.vehicle.model} (
//                       {appointment.vehicle.plateNumber})
//                     </Text>
//                   </div>

//                   <div className="flex items-start">
//                     <FileTextOutlined className="mr-2 mt-1" />
//                     <Text strong>Note:</Text>
//                     <Paragraph className="ml-2 mb-0">
//                       {appointment.note || "No notes"}
//                     </Paragraph>
//                   </div>

//                   {appointment.rejectReason &&
//                     appointment.status === "Reject" && (
//                       <Alert
//                         message="Reject Reason"
//                         description={appointment.rejectReason}
//                         type="error"
//                         showIcon
//                       />
//                     )}

//                   <Divider orientation="left">Services</Divider>
//                   <List
//                     size="small"
//                     dataSource={appointment.appointmentServices}
//                     renderItem={(service) => (
//                       <List.Item
//                         key={service.appointmentServiceId}
//                         className="px-4"
//                       >
//                         <Text>{service.service.serviceName}</Text>
//                         <Text strong>${service.service.totalPrice}</Text>
//                       </List.Item>
//                     )}
//                   />

//                   <Divider />
//                   <div className="flex justify-between items-center">
//                     <div className="flex items-center">
//                       <DollarOutlined className="mr-2" />
//                       <Text strong>Total:</Text>
//                       <Text strong className="ml-2 text-lg">
//                         $
//                         {appointment.appointmentServices.reduce(
//                           (sum, service) => sum + service.service.totalPrice,
//                           0
//                         )}
//                       </Text>
//                     </div>
//                     {appointment.status === "Accept" && (
//                       <Button
//                         type="primary"
//                         icon={<CreditCardOutlined />}
//                         onClick={() => handlePayment(appointment.appointmentId)}
//                       >
//                         Payment
//                       </Button>
//                     )}
//                   </div>
//                 </Space>
//               </Card>
//             </motion.div>
//           ))}
//         </motion.div>
//       )}
//     </div>
//   );
// };

// export default Appointments;
"use client";

import React, { useState, useEffect } from "react";
import { getAppointmentsByCustomer } from "@/dbUtils/appointmentAPIs/appointment";
import Link from "next/link";
import axiosInstance from "@/dbUtils/axios";
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

const { Text, Paragraph } = Typography;
const { TabPane } = Tabs;

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
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [invoices, setInvoices] = useState<{ [key: number]: number }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [activeTab, setActiveTab] = useState("All");

  // useEffect(() => {
  //   const fetchAppointmentsAndInvoices = async () => {
  //     try {
  //       setIsLoading(true);
  //       const response =
  //         (await getAppointmentsByCustomer()) as AppointmentResponse;

  //       if (response.isSuccess && response.data) {
  //         const appointmentsData = Array.isArray(response.data)
  //           ? response.data
  //           : [response.data];
  //         setAppointments(appointmentsData);

  //         // Fetch invoices for Paid and Complete appointments
  //         const paidCompleteAppointments = appointmentsData.filter((appt) =>
  //           ["Paid", "Complete"].includes(appt.status)
  //         );

  //         const invoicePromises = paidCompleteAppointments.map(async (appt) => {
  //           try {
  //             const invoiceResponse = await axiosInstance.get(
  //               `invoices/by-appointment/${appt.appointmentId}`
  //             );
  //             return { [appt.appointmentId]: invoiceResponse.data.totalAmount };
  //           } catch (err) {
  //             console.error(
  //               `Failed to fetch invoice for appointment ${appt.appointmentId}:`,
  //               err
  //             );
  //             return { [appt.appointmentId]: null };
  //           }
  //         });

  //         const invoiceResults = await Promise.all(invoicePromises);
  //         const invoiceMap = Object.assign({}, ...invoiceResults);
  //         setInvoices(invoiceMap);
  //       } else {
  //         setError(
  //           new Error(response.message || "Failed to fetch appointments")
  //         );
  //       }
  //     } catch (err) {
  //       setError(
  //         err instanceof Error ? err : new Error("An unknown error occurred")
  //       );
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchAppointmentsAndInvoices();
  // }, []);

  // const handlePayment = async (appointmentId: number) => {
  //   try {
  //     const invoiceResponse = await axiosInstance.get(
  //       `https://garamsapi.lemoncliff-682dfe26.southeastasia.azurecontainerapps.io/api/invoices/by-appointment/${appointmentId}`
  //     );
  //     const iid = invoiceResponse.data.invoiceId;

  //     if (iid) {
  //       const paymentResponse = await axiosInstance.post(
  //         `invoices/pay-single-invoice/${iid}`
  //       );
  //       window.location.href = paymentResponse.data.url;
  //     } else {
  //       alert("No invoice found for this appointment.");
  //     }
  //   } catch (error) {
  //     console.error("Error process payment:", error);
  //     alert("Error when execute payment.");
  //   }
  // };

  const fetchAppointmentsAndInvoices = async () => {
    try {
      setIsLoading(true);
      const response =
        (await getAppointmentsByCustomer()) as AppointmentResponse;

      if (response.isSuccess && response.data) {
        const appointmentsData = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setAppointments(appointmentsData);

        // Fetch invoices cho các appointment có trạng thái Paid hoặc Complete
        const paidCompleteAppointments = appointmentsData.filter((appt) =>
          ["Paid", "Complete"].includes(appt.status)
        );

        const invoicePromises = paidCompleteAppointments.map(async (appt) => {
          try {
            const invoiceResponse = await axiosInstance.get(
              `invoices/by-appointment/${appt.appointmentId}`
            );
            return { [appt.appointmentId]: invoiceResponse.data.totalAmount };
          } catch (err) {
            console.error(
              `Failed to fetch invoice for appointment ${appt.appointmentId}:`,
              err
            );
            return { [appt.appointmentId]: null };
          }
        });

        const invoiceResults = await Promise.all(invoicePromises);
        const invoiceMap = Object.assign({}, ...invoiceResults);
        setInvoices(invoiceMap);
      } else {
        setError(new Error(response.message || "Failed to fetch appointments"));
      }
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("An unknown error occurred")
      );
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect để fetch lần đầu và thiết lập polling
  useEffect(() => {
    // Fetch lần đầu khi component mount
    fetchAppointmentsAndInvoices();

    // Thiết lập polling mỗi 10 giây để refetch dữ liệu
    const intervalId = setInterval(() => {
      fetchAppointmentsAndInvoices();
    }, 10000); // 10 giây = 10000ms

    // Cleanup interval khi component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handlePayment = async (appointmentId: number) => {
    try {
      const iidResponse = await axiosInstance.get(
        `invoices/iid-by-aid?aid=${appointmentId}`
      );
      const iid = iidResponse.data;

      if (iid) {
        const paymentResponse = await axiosInstance.post(
          `invoices/pay-single-invoice/${iid}`
        );
        window.location.href = paymentResponse.data.url;
      } else {
        alert("No invoice found for this appointment.");
      }
    } catch (error) {
      console.error("Error process payment:", error);
      alert("Error when execute payment.");
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

  const getTotalAmount = (appointment: Appointment) => {
    if (
      ["Paid", "Complete"].includes(appointment.status) &&
      invoices[appointment.appointmentId] !== undefined
    ) {
      return (
        invoices[appointment.appointmentId] ??
        appointment.appointmentServices.reduce(
          (sum, service) => sum + service.service.totalPrice,
          0
        )
      );
    }
    return appointment.appointmentServices.reduce(
      (sum, service) => sum + service.service.totalPrice,
      0
    );
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
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

                  {appointment.rejectReason &&
                    appointment.status === "Reject" && (
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
                        {/* <Text strong>${service.service.totalPrice}</Text> */}
                      </List.Item>
                    )}
                  />

                  <Divider />
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <DollarOutlined className="mr-2" />
                      <Text strong>Total:</Text>
                      <Text strong className="ml-2 text-lg">
                        ${getTotalAmount(appointment)}
                      </Text>
                    </div>
                    {appointment.status === "Accept" && (
                      <Button
                        type="primary"
                        icon={<CreditCardOutlined />}
                        onClick={() => handlePayment(appointment.appointmentId)}
                      >
                        Payment
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
