"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useAppointment } from "@/dbUtils/appointmentAPIs/getAppointment";
import Link from "next/link";
import axiosInstance from "@/dbUtils/axios";
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
                    Payment
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
