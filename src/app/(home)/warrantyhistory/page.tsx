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
  Modal,
  Descriptions,
  message,
} from "antd";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarOutlined, FileTextOutlined, EyeOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

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

const WarrantyHistoryPage = () => {
  const [warranties, setWarranties] = useState<WarrantyHistory[]>([]);
  const [servicesMap, setServicesMap] = useState<Record<number, Service>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [appointmentModalVisible, setAppointmentModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentData | null>(null);

  useEffect(() => {
    const fetchWarranties = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("warrantyhistory/warranty-of-login");
        if (response.data.isSuccess) {
          const data: WarrantyHistory[] = response.data.data;
          setWarranties(data);

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
          setError(new Error(response.data.message || "Failed to fetch warranty histories"));
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An unknown error occurred"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchWarranties();
  }, []);

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
    } catch (err) {
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
          Warranty History
        </Title>
      </motion.div>

      {isLoading ? (
        <div className="p-6 flex justify-center items-center min-h-screen">
          <Spin size="large" tip="Loading warranty histories..." />
        </div>
      ) : error ? (
        <Result
          status="error"
          title="Failed to load warranty histories"
          subTitle={error.message}
          extra={
            <Button type="primary">
              <Link href="/">Back to homepage</Link>
            </Button>
          }
        />
      ) : warranties.length === 0 ? (
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
          {warranties.map((warranty) => (
            <Card
              key={warranty.warrantyHistoryId}
              hoverable
              title={`Warranty #${warranty.warrantyHistoryId}`}
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
                  <Text className="ml-2">{formatDate(warranty.startDay)}</Text>
                </div>

                <div className="flex items-center">
                  <CalendarOutlined className="mr-2" />
                  <Text strong>End Date:</Text>
                  <Text className="ml-2">{formatDate(warranty.endDay)}</Text>
                </div>

                <div className="flex items-start">
                  <FileTextOutlined className="mr-2 mt-1" />
                  <Text strong>Appointment Id:</Text>
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
            <Descriptions.Item label="Note">{selectedAppointment.note}</Descriptions.Item>
            <Descriptions.Item label="Status">{selectedAppointment.status}</Descriptions.Item>
            <Descriptions.Item label="Created At">
              {formatDate(selectedAppointment.createdAt)}
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              {formatDate(selectedAppointment.updatedAt)}
            </Descriptions.Item>
            <Descriptions.Item label="Vehicle Info">
              Plate: {selectedAppointment.vehicle.plateNumber} | Brand: {selectedAppointment.vehicle.brand} | Model: {selectedAppointment.vehicle.model}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <Spin tip="Loading appointment details..." />
        )}
      </Modal>
    </div>
  );
};

export default WarrantyHistoryPage;
