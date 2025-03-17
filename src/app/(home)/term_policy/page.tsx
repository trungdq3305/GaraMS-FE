"use client";

import React from "react";
import { Card, Typography, List, Divider, Space, Button } from "antd";
import { motion } from "framer-motion";
import { ShieldCheck, FileCheck, LockKeyhole, Mail, Printer, Book, Download } from "lucide-react";

const { Title, Paragraph, Text } = Typography;

const TermsAndPolicy = () => {
  const currentYear = new Date().getFullYear();

  const termsOfUse = [
    "Users must not use the system for any illegal activities or unauthorized purposes.",
    "All information provided through the system must be accurate, complete, and up-to-date.",
    "Users are responsible for maintaining the confidentiality of their account credentials.",
    "We reserve the right to modify, suspend, or terminate services without prior notice.",
    "Users agree not to reverse engineer, decompile, or attempt to extract the source code of our software.",
  ];

  const privacyPoints = [
    "We collect personal information solely for the purpose of providing and improving our services.",
    "Your data is encrypted and stored securely using industry-standard protocols.",
    "We do not sell or rent personal information to third parties for marketing purposes.",
    "You may request access to, correction of, or deletion of your personal data at any time.",
    "We use cookies and similar technologies to enhance user experience and analyze usage patterns.",
  ];

  const sectionAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10 px-4"
    >
      <Card
        className="max-w-4xl mx-auto shadow-xl rounded-xl overflow-hidden"
        bordered={false}
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-blue-600 text-white p-6 -mx-6 -mt-6 mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <Title level={2} style={{ color: "white", margin: 0 }}>
                Terms & Privacy Policy
              </Title>
              <Text style={{ color: "rgba(255, 255, 255, 0.85)" }}>
                Last updated: March 2025
              </Text>
            </div>
            <Space>
              <Button type="primary" icon={<Printer size={18} />} style={{ color: "white", borderColor: "white" }}>
                Print
              </Button>
              <Button type="primary" icon={<Download size={18} />} ghost>
                Download PDF
              </Button>
            </Space>
          </div>
        </motion.div>

        <motion.section
          initial="hidden"
          animate="visible"
          variants={sectionAnimation}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Book className="text-blue-600" size={24} />
            <Title level={3} style={{ margin: 0 }}>1. Introduction</Title>
          </div>
          <Paragraph className="text-gray-700">
            Welcome to the Car Garage Management System ("CGMS") operated by GARA Automotive Solutions.
            These Terms and Conditions govern your access to and use of our garage management services,
            including our website, mobile applications, and any related services (collectively, the "Services").
          </Paragraph>
          <Paragraph className="text-gray-700">
            By accessing or using our Services, you agree to be bound by these Terms and Conditions and our Privacy Policy.
            If you disagree with any part of these terms, you may not access the Services. We recommend reviewing
            these documents carefully before proceeding with the use of our platform.
          </Paragraph>
        </motion.section>

        <Divider style={{ margin: "24px 0" }} />

        <motion.section
          initial="hidden"
          animate="visible"
          variants={sectionAnimation}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <FileCheck className="text-blue-600" size={24} />
            <Title level={3} style={{ margin: 0 }}>2. Terms of Use</Title>
          </div>
          <List
            itemLayout="horizontal"
            dataSource={termsOfUse}
            renderItem={(item, index) => (
              <List.Item style={{ padding: "8px 0", borderBlockEnd: "none" }}>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  className="flex items-start gap-3"
                >
                  <div className="flex-shrink-0 bg-blue-100 text-blue-600 rounded-full h-6 w-6 flex items-center justify-center mt-0.5">
                    {index + 1}
                  </div>
                  <Paragraph className="text-gray-700 mb-0" style={{ lineHeight: 1.6 }}>
                    {item}
                  </Paragraph>
                </motion.div>
              </List.Item>
            )}
          />
          <Paragraph className="text-gray-700 mt-4">
            Violation of these terms may result in temporary or permanent suspension of access to our Services.
            We reserve the right to refuse service to anyone for any reason at any time.
          </Paragraph>
        </motion.section>

        <Divider style={{ margin: "24px 0" }} />

        <motion.section
          initial="hidden"
          animate="visible"
          variants={sectionAnimation}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <LockKeyhole className="text-blue-600" size={24} />
            <Title level={3} style={{ margin: 0 }}>3. Privacy Policy</Title>
          </div>
          <Paragraph className="text-gray-700">
            At GARA Automotive Solutions, we are committed to protecting your privacy and the security of your personal information.
            Our Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Services.
          </Paragraph>
          <List
            itemLayout="horizontal"
            dataSource={privacyPoints}
            renderItem={(item, index) => (
              <List.Item style={{ padding: "8px 0", borderBlockEnd: "none" }}>
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index + 0.3 }}
                  className="flex items-start gap-3"
                >
                  <ShieldCheck className="flex-shrink-0 text-blue-600" size={20} />
                  <Paragraph className="text-gray-700 mb-0" style={{ lineHeight: 1.6 }}>
                    {item}
                  </Paragraph>
                </motion.div>
              </List.Item>
            )}
          />
        </motion.section>

        <Divider style={{ margin: "24px 0" }} />

        <motion.section
          initial="hidden"
          animate="visible"
          variants={sectionAnimation}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Mail className="text-blue-600" size={24} />
            <Title level={3} style={{ margin: 0 }}>4. Contact Information</Title>
          </div>
          <Paragraph className="text-gray-700">
            If you have any questions, concerns, or requests regarding these Terms and Conditions
            or our Privacy Policy, please contact our support team:
          </Paragraph>

          <Card className="bg-gray-50 border border-gray-200 mt-4">
            <Space direction="vertical" size="small">
              <div>
                <Text strong>Email: </Text>
                <Text className="text-blue-600 font-medium">support@garams.com</Text>
              </div>
              <div>
                <Text strong>Phone: </Text>
                <Text>+1 (800) 555-GARA (4272)</Text>
              </div>
              <div>
                <Text strong>Business Hours: </Text>
                <Text>Monday - Friday, 9:00 AM - 6:00 PM EST</Text>
              </div>
            </Space>
          </Card>
        </motion.section>

        <Divider style={{ margin: "24px 0" }} />

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center text-gray-500 mt-8"
        >
          <Text>
            &copy; {currentYear} GARA Automotive Solutions. All rights reserved.
          </Text>
        </motion.footer>
      </Card>
    </motion.div>
  );
};

export default TermsAndPolicy;