// const services = [
//   {
//     title: "Vehicle Maintenance",
//     desc: "Comprehensive vehicle check-ups and repairs.",
//     img: "https://www.kbb.com/wp-content/uploads/2021/08/car-maintenance-guide.jpeg",
//   },
//   {
//     title: "Oil & Fluid Services",
//     desc: "Quality oil changes and fluid replacements.",
//     img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZASwBuwyMLXcGMQwExi_IEtPaYxeEHXctDw&s",
//   },
//   {
//     title: "Brake & Suspension Repair",
//     desc: "Ensuring safety with professional repairs.",
//     img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRv876to6k0n8dRQ8FpTJtfutN1DMFCxp3nKw&s",
//   },
//   {
//     title: "Tire Services",
//     desc: "Balancing, alignment, and replacements.",
//     img: "https://www.mrnobodystire.com/wp-content/uploads/2024/06/tire-stand.jpg",
//   },
//   {
//     title: "Battery Services",
//     desc: "Battery testing and replacements.",
//     img: "https://www.hyattsautocare.com/wp-content/uploads/2020/03/189-1024x683.jpg",
//   },
//   {
//     title: "Diagnostics & Inspections",
//     desc: "Advanced vehicle diagnostics and checks.",
//     img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRv876to6k0n8dRQ8FpTJtfutN1DMFCxp3nKw&s",
//   },
// ];
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { getServices } from "@/dbUtils/ManagerAPIs/serviceservice";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, Row, Col, Button, Spin } from "antd";

interface ServiceData {
  serviceId: number;
  serviceName: string;
  description: string;
  totalPrice: number;
  status: boolean;
  createdAt: string;
  updatedAt: string;
  warrantyPeriod: number;
  estimatedTime: number;
}

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchServices = async () => {
  //     try {
  //       const response = await getServices();
  //       if (response.isSuccess && response.data) {
  //         setServices(response.data);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching services:", error);
  //     }
  //     setLoading(false);
  //   };

  //   fetchServices();
  // }, []);

  const fetchServices = async () => {
    try {
      const response = await getServices();
      if (response.isSuccess && response.data) {
        setServices(response.data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();

    const intervalId = setInterval(() => {
      fetchServices();
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const defaultImage =
    "https://www.kbb.com/wp-content/uploads/2021/08/car-maintenance-guide.jpeg";

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-10 text-blue-700">
        Our Services
      </h1>

      {loading ? (
        <div className="flex justify-center items-center">
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[16, 16]} justify="center">
          {services.map((service, index) => (
            <Col key={service.serviceId} xs={24} sm={12} md={8} lg={6}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  hoverable
                  cover={
                    <Image
                      src={defaultImage}
                      alt={service.serviceName}
                      width={300}
                      height={200}
                      className="object-cover w-full h-48"
                    />
                  }
                  className="rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
                >
                  <h3 className="text-lg font-semibold">
                    {service.serviceName}
                  </h3>
                  <p className="text-gray-600">{service.description}</p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-lg font-bold text-green-600">
                      ${service.totalPrice.toLocaleString()}
                    </span>
                    {service.estimatedTime && (
                      <span className="text-sm text-gray-500">
                        ⏳ {service.estimatedTime} min
                      </span>
                    )}
                  </div>
                  {service.warrantyPeriod && (
                    <p className="text-sm text-blue-600 mt-1">
                      🛡 {service.warrantyPeriod} days warranty
                    </p>
                  )}
                  <div className="mt-4">
                    <Link href={`/services/${service.serviceId}`}>
                      <Button type="primary" block>
                        View Details
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
