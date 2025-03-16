"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useAppointment } from "@/dbUtils/appointmentAPIs/getAppointment";
import Link from "next/link";
import { Card, Button, Tag, List, Typography, Spin, Alert } from "antd";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

const statusColors = {
  Pending: "gold",
  Reject: "red",
  Paid: "green",
  Unpaid: "orange",
  Accept: "blue",
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
      <div className="p-6 flex justify-center">
        <Alert message="Error loading appointments" type="error" showIcon />
      </div>
    );
  }

  const vehicleData = appointments?.find(
    (vehicle) => vehicle.vehicleId === Number(vehicleId)
  );

  const filteredAppointments = vehicleData?.appointments ?? [];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Title level={2} className="text-center">
        Vehicle Appointments
      </Title>

      {filteredAppointments.length === 0 ? (
        <Alert
          message="No appointments found for this vehicle."
          type="info"
          showIcon
        />
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <List
            grid={{ gutter: 16, column: 1 }}
            dataSource={filteredAppointments}
            renderItem={(appointment) => (
              <List.Item>
                <Card
                  title={`Appointment #${appointment.appointmentId}`}
                  bordered={false}
                >
                  <p>
                    <Text strong>Date:</Text>{" "}
                    {new Date(appointment.date).toLocaleString()}
                  </p>
                  <p>
                    <Text strong>Status:</Text>{" "}
                    {/* <Tag
                      color={
                        appointment.status === "Pending"
                          ? "gold"
                          : appointment.status === "Reject"
                          ? "red"
                          : "green"
                      }
                    >
                      {appointment.status}
                    </Tag> */}
                    <Tag
                      color={
                        statusColors[
                          appointment.status as keyof typeof statusColors
                        ] || "default"
                      }
                    >
                      {appointment.status}
                    </Tag>
                  </p>
                  <p>
                    <Text strong>Note:</Text> {appointment.note || "N/A"}
                  </p>
                  {appointment.rejectReason && (
                    <p>
                      <Text strong>Reject Reason:</Text>{" "}
                      {appointment.rejectReason}
                    </p>
                  )}
                  <Text strong>Services:</Text>
                  <List
                    size="small"
                    bordered
                    dataSource={appointment.appointmentServices}
                    renderItem={(service) => (
                      <List.Item>
                        {service.service.serviceName} - $
                        {service.service.totalPrice}
                      </List.Item>
                    )}
                  />
                </Card>
              </List.Item>
            )}
          />
        </motion.div>
      )}

      <div className="mt-6 text-center">
        <Link href="/profile">
          <Button type="primary">Back to Vehicles</Button>
        </Link>
      </div>
    </div>
  );
};

export default AppointmentVehicle;
