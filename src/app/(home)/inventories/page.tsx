"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { getInventories } from "@/dbUtils/ManagerAPIs/inventoryService";
import { addInventoryToCart } from "@/dbUtils/ManagerAPIs/cartService";
import Link from "next/link";
import { Card, Row, Col, Button, Spin, Typography, Badge, message } from "antd";

const { Text, Title } = Typography;

interface Inventory {
  inventoryId: number;
  name: string;
  description: string;
  unit: string;
  inventoryPrice: number;
  status: boolean;
  inventorySuppliers: {
    supplierId: number;
    name: string;
    phone: string | null;
    email: string | null;
  }[];
  serviceInventories: {
    serviceId: number;
    serviceName: string;
    servicePrice: number | null;
    inventoryPrice: number | null;
    description: string | null;
    inventoryIds: number[];
    warrantyPeriod: number | null;
  }[];
}

export default function InventoriesPage() {
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInventories = async () => {
    try {
      const response = await getInventories();
      if (response.isSuccess && response.data) {
        console.log(response.data)
        setInventories(response.data);
      } else {
        setError(response.message || "Failed to fetch inventories");
      }
    } catch (error) {
      console.error("Error fetching inventories:", error);
      setError("An error occurred while fetching inventories");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchInventories();

    const intervalId = setInterval(() => {
      fetchInventories();
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const handleAddToCart = async (inventoryId: number) => {
    try {
      const response = await addInventoryToCart(inventoryId);

      message.success("Item added to cart successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error adding to cart:", error);
      message.error("Inventory Out of Stock");
    }
  };

  const defaultImage =
    "https://www.kbb.com/wp-content/uploads/2021/08/car-maintenance-guide.jpeg";

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-gray-50 py-12">
      <div className="container mx-auto px-4">
        <Title level={2} className="text-center mb-12 text-blue-900 font-bold">
          Explore Our Inventory
        </Title>

        {loading ? (
          <div className="flex justify-center items-center">
            <Spin size="large" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center mt-10">
            <Text type="danger" className="text-lg">
              {error}
            </Text>
          </div>
        ) : (
          <Row gutter={[24, 24]} justify="center">
            {inventories.map((inventory, index) => (
              <Col key={inventory.inventoryId} xs={24} sm={12} md={8} lg={6}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    hoverable
                    cover={
                      <div className="relative h-48 overflow-hidden rounded-t-lg">

                        <Badge
                          count={Number(inventory.unit) > 0 ? "Available" : "Out of Stock"}
                          className="absolute top-3 right-3"
                          style={{
                            backgroundColor: Number(inventory.unit)
                              ? "#52c41a"
                              : "#f5222d",
                            borderRadius: "12px",
                            fontSize: "12px",
                          }}
                        />
                      </div>
                    }
                    className="rounded-lg shadow-lg border-none bg-white transition-all duration-300 hover:shadow-xl flex flex-col h-[450px]"
                  >
                    <div className="flex flex-col flex-grow">
                      <h3 className="text-xl font-semibold text-gray-800 truncate">
                        {inventory.name}
                      </h3>
                      <p className="text-gray-600 text-sm mt-2 line-clamp-2 flex-grow">
                        {inventory.description}
                      </p>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-lg font-bold text-blue-700">
                          {inventory.inventoryPrice} $
                        </span>
                      </div>
                      <div className="mt-5 space-y-2">
                        <Link href={`/inventories/${inventory.inventoryId}`}>
                          <Button
                            type="default"
                            block
                            className="rounded-lg py-2"
                          >
                            View Details
                          </Button>
                        </Link>
                        <Button
                          type="primary"
                          block
                          disabled={!inventory.status}
                          onClick={() => handleAddToCart(inventory.inventoryId)}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg py-2"
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}