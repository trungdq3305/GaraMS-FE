/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getInventoryById } from "@/dbUtils/ManagerAPIs/inventoryService"; // Adjust the path to your API file
import Link from "next/link";
import Image from "next/image";
import { Card, Typography, Button, Row, Col, Skeleton, Tag } from "antd";
import { motion } from "framer-motion";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface Inventory {
  inventoryId: number;
  name: string;
  description: string;
  unit: string;
  price: number; // Matches the getInventoryById response
  status: boolean;
  createdAt: string;
  updatedAt: string;
  inventorySuppliers: {
    inventorySupplierId: number;
    inventoryId: number;
    supplierId: number;
    supplier: {
      supplierId: number;
      name: string;
      phone: string | null;
      email: string | null;
      address: string | null;
      status: boolean;
      createdAt: string;
      updatedAt: string | null;
      inventorySuppliers: (null | any)[];
    };
  }[];
  serviceInventories: {
    serviceInventoryId: number;
    inventoryId: number;
    serviceId: number;
    service: {
      serviceId: number;
      serviceName: string;
      description: string;
      servicePrice: number;
      inventoryPrice: number;
      promotion: number | null;
      totalPrice: number;
      estimatedTime: number | null;
      status: boolean;
      createdAt: string;
      updatedAt: string;
      warrantyPeriod: number | null;
      categoryId: number | null;
      appointmentServices: any[];
      category: null | any;
      serviceEmployees: any[];
      serviceInventories: (null | any)[];
      servicePromotions: any[];
      warrantyHistories: any[];
    };
  }[];
}

interface ApiResponse {
  isSuccess: boolean;
  code: number;
  data: Inventory;
  message: string;
}

export default function InventoryDetailPage() {
  const params = useParams();
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInventoryDetail = async () => {
      try {
        const inventoryId = params.inventoryId;
        if (!inventoryId) {
          setError("Inventory ID not found");
          setLoading(false);
          return;
        }

        const response: ApiResponse = await getInventoryById(
          parseInt(inventoryId as string)
        );

        if (response.isSuccess && response.data) {
          setInventory(response.data);
        } else {
          setError(response.message || "Failed to fetch inventory details");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching inventory details:", error);
        setError("An error occurred while fetching inventory details");
        setLoading(false);
      }
    };

    fetchInventoryDetail();
  }, [params.inventoryId]);

  const defaultImage =
    "https://www.kbb.com/wp-content/uploads/2021/08/car-maintenance-guide.jpeg";

  return (
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/inventories">
          <Button
            icon={<ArrowLeftOutlined />}
            type="link"
            style={{ padding: 0, paddingBottom: 20, fontSize: 16 }}
          >
            Back to Inventory List
          </Button>
        </Link>
      </motion.div>

      {loading ? (
        <Skeleton active />
      ) : error || !inventory ? (
        <div className="flex flex-col items-center mt-10">
          <Text type="danger" className="text-lg">
            {error || "Inventory not found"}
          </Text>
          <Link href="/inventories">
            <Button type="primary" className="mt-4">
              Back to Inventory List
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
                alt={inventory.name}
                width={800}
                height={400}
                className="object-cover"
                style={{ height: "16rem" }}
              />
            }
          >
            <Title level={2}>{inventory.name}</Title>
            <Text type="secondary">{inventory.description}</Text>

            <Row gutter={[16, 16]} className="mt-6">
              <Col xs={24} md={12}>
                <Card bordered={false} className="bg-blue-50">
                  <Title level={4}>Inventory Details</Title>
                  <p>
                    Price:{" "}
                    <Text strong>{inventory.price.toLocaleString()} VNĐ</Text>
                  </p>
                  <p>
                    Amount: <Text strong>{inventory.unit}</Text>
                  </p>
                </Card>
              </Col>

              <Col xs={24} md={12}>
                <Card bordered={false} className="bg-gray-50">
                  <Title level={4}>Additional Information</Title>
                  <p>
                    Status:{" "}
                    {inventory.status ? (
                      <Tag color="green">Available</Tag>
                    ) : (
                      <Tag color="red">Unavailable</Tag>
                    )}
                  </p>
                </Card>
              </Col>
            </Row>

            {/* Suppliers */}
            <Card
              title={<Title level={4}>Suppliers</Title>}
              bordered={false}
              className="mt-6 bg-gray-50"
            >
              {inventory.inventorySuppliers.length > 0 ? (
                inventory.inventorySuppliers.map((supplier) => (
                  <div key={supplier.supplierId} className="mb-4">
                    <p>
                      <Text strong>Name: </Text>
                      {supplier.supplier.name}
                    </p>
                    <p>
                      <Text strong>Phone: </Text>
                      {supplier.supplier.phone || "N/A"}
                    </p>
                    <p>
                      <Text strong>Email: </Text>
                      {supplier.supplier.email || "N/A"}
                    </p>
                    <p>
                      <Text strong>Address: </Text>
                      {supplier.supplier.address || "N/A"}
                    </p>
                  </div>
                ))
              ) : (
                <Text>No suppliers available for this inventory.</Text>
              )}
            </Card>

            {/* Related Services */}
            <Card
              title={<Title level={4}>Related Services</Title>}
              bordered={false}
              className="mt-6 bg-gray-50"
            >
              {inventory.serviceInventories.length > 0 ? (
                inventory.serviceInventories.map((service) => (
                  <div key={service.serviceId} className="mb-4">
                    <p>
                      <Text strong>Service Name: </Text>
                      {service.service.serviceName}
                    </p>
                    <p>
                      <Text strong>Description: </Text>
                      {service.service.description || "N/A"}
                    </p>
                    <p>
                      <Text strong>Total Price: </Text>
                      {service.service.totalPrice} VNĐ
                    </p>
                    <p>
                      <Text strong>Estimated Time: </Text>
                      {service.service.estimatedTime
                        ? `${service.service.estimatedTime} minutes`
                        : "N/A"}
                    </p>
                    <p>
                      <Text strong>Warranty Period: </Text>
                      {service.service.warrantyPeriod
                        ? `${service.service.warrantyPeriod} days`
                        : "N/A"}
                    </p>
                  </div>
                ))
              ) : (
                <Text>No related services available for this inventory.</Text>
              )}
            </Card>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
