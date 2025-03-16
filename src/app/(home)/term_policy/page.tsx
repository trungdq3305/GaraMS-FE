"use client";

import React from "react";
import { Card, Typography, List } from "antd";
import { motion } from "framer-motion";

const { Title, Paragraph } = Typography;

const terms = [
  "Users must not use the system for any illegal activities.",
  "All provided information must be accurate and up to date.",
  "We reserve the right to modify content without prior notice.",
];

const TermsAndPolicy = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex justify-center bg-gray-100 p-4"
    >
      <Card className="max-w-3xl w-full shadow-lg rounded-xl p-6" bordered>
        <Title level={2} className="text-center mb-4">
          Terms & Policy
        </Title>

        <section className="mb-6">
          <Title level={4}>1. Introduction</Title>
          <Paragraph>
            Welcome to our car garage management system. By using our services,
            you agree to comply with the terms and conditions outlined below.
          </Paragraph>
        </section>

        <section className="mb-6">
          <Title level={4}>2. Terms of Use</Title>
          <List
            dataSource={terms}
            renderItem={(item) => (
              <List.Item style={{ padding: 0, borderBlockEnd: "none" }}>
                {item}
              </List.Item>
            )}
          />
        </section>

        <section className="mb-6">
          <Title level={4}>3. Privacy Policy</Title>
          <Paragraph>
            We are committed to protecting your personal information. All data
            will be kept secure and will not be shared with third parties
            without consent.
          </Paragraph>
        </section>

        <section>
          <Title level={4}>4. Contact</Title>
          <Paragraph>
            If you have any questions, please contact us via email:{" "}
            <span className="text-blue-600 font-medium">
              support@garams.com
            </span>
          </Paragraph>
        </section>
      </Card>
    </motion.div>
  );
};

export default TermsAndPolicy;
