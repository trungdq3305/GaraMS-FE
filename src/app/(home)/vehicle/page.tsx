"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useVehicle } from "@/dbUtils/vehicleAPIs/vehicleLogin";
import { useCreateVehicle } from "@/dbUtils/vehicleAPIs/vehicleCreate";
import { Card, Button, Modal, Form, Input, Spin, Alert } from "antd";
import { motion } from "framer-motion";

const Vehicles = () => {
  const router = useRouter();
  const { data: vehicleData, isLoading, error } = useVehicle();
  const { mutate, isPending: isCreating } = useCreateVehicle();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleSubmit = (values: {
    plateNumber: string;
    brand: string;
    model: string;
  }) => {
    mutate(values, {
      onSuccess: () => closeModal(),
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex flex-col justify-center items-center min-h-[50vh]">
        <Alert
          message={error.message || "Error loading vehicles"}
          type="error"
          showIcon
        />
        <Button
          type="primary"
          className="mt-4"
          onClick={() => router.push("/")}
        >
          Back to homepage
        </Button>
      </div>
    );
  }

  const vehicles = Array.isArray(vehicleData)
    ? vehicleData
    : vehicleData
    ? [vehicleData]
    : [];

  return (
    <div className="p-6">
      

      {vehicles.length === 0 ? (
        <div className="p-6 flex flex-col justify-center items-center min-h-[50vh]">
          <p className="text-xl mb-4">You do not have vehicle information</p>
          <Button type="primary" onClick={openModal}>
            Add your new vehicle
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <motion.div
              key={vehicle.vehicleId}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                title={vehicle.plateNumber}
                bordered={false}
                className="shadow-lg"
                style={{ lineHeight: "30px" }}
              >
                <p>
                  <strong>Brand:</strong> {vehicle.brand}
                </p>
                <p>
                  <strong>Model:</strong> {vehicle.model}
                </p>
                <Button
                  type="primary"
                  style={{ marginTop: 10 }}
                  onClick={() => router.push(`/profile/${vehicle.vehicleId}`)}
                >
                  View Details
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <Button type="primary" onClick={openModal}>
          Add new vehicle
        </Button>
      </div>

      {/* Modal */}
      <Modal
        title="Add New Vehicle"
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="plateNumber"
            label="Plate Number"
            rules={[{ required: true, message: "Please enter plate number" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="brand"
            label="Brand"
            rules={[{ required: true, message: "Please enter brand" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="model"
            label="Model"
            rules={[{ required: true, message: "Please enter model" }]}
          >
            <Input />
          </Form.Item>
          <div className="flex justify-end">
            <Button onClick={closeModal} className="mr-2">
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={isCreating}>
              Add Vehicle
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Vehicles;
