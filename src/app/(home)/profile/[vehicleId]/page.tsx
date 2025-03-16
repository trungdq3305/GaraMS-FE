// "use client";

// import React from "react";
// import { useParams } from "next/navigation";
// import { useAppointment } from "@/dbUtils/appointmentAPIs/getAppointment";
// import Link from "next/link";
// import axios from "axios";

// const AppointmentVehicle = () => {
//   const { vehicleId } = useParams();
//   const { data: appointments, isLoading, error } = useAppointment();

//   if (isLoading) {
//     return <div className="p-6 text-center">Loading appointments...</div>;
//   }

//   if (error) {
//     return (
//       <div className="p-6 text-red-500 text-center">
//         Error loading appointments
//       </div>
//     );
//   }

//   const vehicleData = appointments?.find(
//     (vehicle) => vehicle.vehicleId === Number(vehicleId)
//   );

//   const filteredAppointments = vehicleData?.appointments ?? [];

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

//   return (
//     <div className="p-6">
//       <h2 className="text-3xl font-bold mb-6 text-center">
//         Vehicle Appointments
//       </h2>
//       {filteredAppointments.length === 0 ? (
//         <div className="text-center text-lg">
//           No appointments found for this vehicle.
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {filteredAppointments.map((appointment) => (
//             <div
//               key={appointment.appointmentId}
//               className="bg-white shadow-lg rounded-lg p-6 border"
//             >
//               <p>
//                 <strong>Date:</strong>{" "}
//                 {new Date(appointment.date).toLocaleString()}
//               </p>
//               <p>
//                 <strong>Status:</strong>{" "}
//                 <span
//                   className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${
//                     appointment.status === "Pending"
//                       ? "bg-yellow-500"
//                       : appointment.status === "Reject"
//                       ? "bg-red-500"
//                       : "bg-green-500"
//                   }`}
//                 >
//                   {appointment.status}
//                 </span>
//               </p>
//               <p>
//                 <strong>Note:</strong> {appointment.note || "N/A"}
//               </p>
//               {appointment.rejectReason && (
//                 <p>
//                   <strong>Reject Reason:</strong> {appointment.rejectReason}
//                 </p>
//               )}
//               <p>
//                 <strong>Services:</strong>
//               </p>
//               <ul className="list-disc pl-6">
//                 {appointment.appointmentServices.map((service) => (
//                   <li key={service.appointmentServiceId}>
//                     {service.service.serviceName} - $
//                     {service.service.totalPrice}
//                   </li>
//                 ))}
//               </ul>

//               {/* Nút thanh toán nếu trạng thái là "Accept" */}
//               {appointment.status === "Accept" && (
//                 <button
//                   onClick={() => handlePayment(appointment.appointmentId)}
//                   className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
//                 >
//                   Thanh toán
//                 </button>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//       <div className="mt-6 text-center">
//         <Link
//           href="/profile"
//           className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
//         >
//           Back to Vehicles
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default AppointmentVehicle;
"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useAppointment } from "@/dbUtils/appointmentAPIs/getAppointment";
import Link from "next/link";
import axios from "axios";
import { Card, Button, Tag, Spin } from "antd";
import { motion } from "framer-motion";
import dayjs from "dayjs";

const statusColors: Record<string, string> = {
  Pending: "warning",
  Reject: "error",
  Paid: "processing",
  Unpaid: "volcano",
  Accept: "success",
  Complete: "purple",
};

const AppointmentVehicle = () => {
  const { vehicleId } = useParams();
  const { data: appointments, isLoading, error } = useAppointment();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <Tag color="red">Error loading appointments</Tag>
      </div>
    );
  }

  const vehicleData = appointments?.find(
    (vehicle) => vehicle.vehicleId === Number(vehicleId)
  );

  const filteredAppointments = vehicleData?.appointments ?? [];

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

  return (
    <div className="p-6">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-3xl font-bold text-center mb-6"
      >
        Vehicle Appointments
      </motion.h2>

      {filteredAppointments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-lg"
        >
          No appointments found for this vehicle.
        </motion.div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <motion.div
              key={appointment.appointmentId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card bordered={false} className="shadow-md">
                <p>
                  <strong>Date:</strong>{" "}
                  {dayjs(appointment.date).format("DD/MM/YYYY, hh:mm:ss A")}
                </p>
                <p>
                  <strong>Status: </strong>
                  <Tag color={statusColors[appointment.status]}>
                    {appointment.status}
                  </Tag>
                </p>
                <p>
                  <strong>Note:</strong> {appointment.note || "N/A"}
                </p>
                {appointment.rejectReason && (
                  <p>
                    <strong>Reject Reason:</strong> {appointment.rejectReason}
                  </p>
                )}
                <p>
                  <strong>Services:</strong>
                </p>
                <ul className="list-disc pl-6">
                  {appointment.appointmentServices.map((service) => (
                    <li key={service.appointmentServiceId}>
                      {service.service.serviceName} - $
                      {service.service.totalPrice}
                    </li>
                  ))}
                </ul>

                {/* Nút thanh toán nếu trạng thái là "Accept" */}
                {appointment.status === "Accept" && (
                  <Button
                    type="primary"
                    className="mt-4"
                    onClick={() => handlePayment(appointment.appointmentId)}
                  >
                    Thanh toán
                  </Button>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-6 text-center">
        <Link href="/profile">
          <Button type="default">Back to Vehicles</Button>
        </Link>
      </div>
    </div>
  );
};

export default AppointmentVehicle;
