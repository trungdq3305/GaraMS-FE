/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { createReport } from "@/dbUtils/ManagerAPIs/reportservice";
import { Card, Input, Button, Typography, Modal } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";

const { Title, Text } = Typography;
const { TextArea } = Input;

const ReportPage = () => {
  const [formData, setFormData] = useState({
    problem: "",
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setLoading(true);

    try {
      const reportData = { ...formData, customerId: 1 };
      const response = await createReport(reportData);
      if (response.isSuccess) {
        setSuccessModalVisible(true);
        setFormData({ problem: "", title: "", description: "" });
      }
    } catch (error) {
      console.error("Error creating report:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center bg-gray-100 pt-10"
    >
      <Card className="max-w-xl w-full shadow-lg rounded-lg p-6">
        <Title level={3} className="text-center mb-4">
          Report Information
        </Title>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Text strong>Problem</Text>
            <Input
              name="problem"
              value={formData.problem}
              onChange={handleChange}
              required
              placeholder="Enter problem"
            />
          </div>
          <div>
            <Text strong>Title</Text>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter title"
            />
          </div>
          <div>
            <Text strong>Description</Text>
            <TextArea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Enter description"
              rows={4}
            />
          </div>
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Send Report
            </Button>
          </motion.div>
        </form>
      </Card>

      {/* Success Modal */}
      <Modal
        open={successModalVisible}
        onCancel={() => setSuccessModalVisible(false)}
        footer={null}
        centered
      >
        <div className="text-center p-4">
          <CheckCircleOutlined style={{ fontSize: "48px", color: "#52c41a" }} />
          <Title level={4} className="mt-3">
            Report Created Successfully!
          </Title>
          <Button type="primary" onClick={() => setSuccessModalVisible(false)}>
            OK
          </Button>
        </div>
      </Modal>
    </motion.div>
  );
};

export default ReportPage;
