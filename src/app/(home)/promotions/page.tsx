"use client";

import { motion } from "framer-motion";
import { usePromotion } from "@/dbUtils/promotionAPIs/promotionList";
import { useRouter } from "next/navigation";
import { Card, Button, Typography, Row, Col, Spin } from "antd";
import dayjs from "dayjs";

const { Title, Text } = Typography;

export default function PromotionListPage() {
  const { data: promotions, isLoading, error } = usePromotion();
  const router = useRouter();

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spin size="large" />
      </div>
    );

  if (error)
    return (
      <div className="text-red-600 text-center mt-10">
        Failed to load promotions.
      </div>
    );

  return (
    <motion.div
      className="min-h-screen bg-gray-100 py-8 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Title level={2} className="text-center">
        🎉 Current Promotions
      </Title>

      <Row gutter={[16, 16]} justify="center" className="mt-6">
        {promotions?.map((promotion) => (
          <Col xs={24} sm={12} md={8} key={promotion.promotionId}>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Card
                title={promotion.promotionName}
                bordered={false}
                className="shadow-md rounded-lg"
              >
                <Text type="secondary">
                  📅 {"  "}
                  {dayjs(promotion.startDate).format("DD/MM/YYYY")} -{" "}
                  {dayjs(promotion.endDate).format("DD/MM/YYYY")}
                </Text>
                <p className="text-lg font-bold text-green-600 mt-2">
                  🔥 {promotion.discountPercent}% OFF
                </p>

                <Button
                  type="primary"
                  block
                  className="mt-4"
                  onClick={() =>
                    router.push(`/promotions/${promotion.promotionId}`)
                  }
                >
                  View Details
                </Button>
              </Card>
            </motion.div>
          </Col>
        ))}
      </Row>
    </motion.div>
  );
}
