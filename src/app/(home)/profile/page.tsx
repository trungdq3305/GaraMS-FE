"use client";

import React, { useState } from "react";
import { Card, Tabs, Typography } from "antd";
import { motion } from "framer-motion";
import Vehicles from "../vehicle/page";
import useAuthStore from "@/app/login/hooks/useAuthStore";

const { Title, Text } = Typography;

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { user } = useAuthStore();

  const tabItems = [
    {
      key: "profile",
      label: "Profile",
      children: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-lg rounded-lg p-6">
            <Title
              level={3}
              className="mb-4 text-center"
              style={{ fontSize: 30 }}
            >
              Profile Information
            </Title>
            <div className="space-y-3" style={{ fontSize: 20 }}>
              <Text strong style={{ fontSize: 20 }}>
                Name:{" "}
              </Text>{" "}
              {user?.fullName}
              <br />
              <Text strong style={{ fontSize: 20 }}>
                Email:{" "}
              </Text>{" "}
              {user?.email}
              <br />
              <Text strong style={{ fontSize: 20 }}>
                Phone:{" "}
              </Text>{" "}
              {user?.phone}
              <br />
              <Text strong style={{ fontSize: 20 }}>
                Address:{" "}
              </Text>{" "}
              {user?.address}
            </div>
          </Card>
        </motion.div>
      ),
    },
    {
      key: "vehicles",
      label: "Vehicles",
      children: (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Vehicles />
        </motion.div>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        centered
      />
    </motion.div>
  );
};

export default Profile;
