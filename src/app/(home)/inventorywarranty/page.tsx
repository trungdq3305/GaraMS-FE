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
} from "antd";
import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarOutlined, FileTextOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

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
  inventoryInvoiceDetailId: number;
  appointmentId: number | null;
  appointment?: any;
  inventoryInvoiceDetail: Inventory;
}

const WarrantyInventoryPage = () => {
  const [warranties, setWarranties] = useState<WarrantyInventory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchWarranties = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(
          "inventoryinvoices/get-inven-warranties"
        );
        setWarranties(response.data); // Response là mảng dữ liệu trực tiếp
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("An unknown error occurred")
        );
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

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title level={2} className="text-center mb-6">
          Warranty Inventory
        </Title>
      </motion.div>

      {isLoading ? (
        <div className="p-6 flex justify-center items-center min-h-screen">
          <Spin size="large" tip="Loading warranty inventories..." />
        </div>
      ) : error ? (
        <Result
          status="error"
          title="Failed to load warranty inventories"
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
          <Empty description={<span>No warranty inventory found</span>} />
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
              key={warranty.inventoryWarrantyId}
              hoverable
              title={`Warranty #${warranty.inventoryWarrantyId}`}
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
                      warranty.inventoryInvoiceDetail.inventoryInvoice.date
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
              </Space>
            </Card>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default WarrantyInventoryPage;
