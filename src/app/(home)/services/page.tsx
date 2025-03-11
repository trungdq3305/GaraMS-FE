"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { getServices } from "@/dbUtils/ManagerAPIs/serviceservice";
import { useState, useEffect } from "react";
import Link from "next/link";

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

export default function ServicesPage() {
  // const { data: service = [] } = useService();
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await getServices();
        if (response.isSuccess && response.data) {
          setServices(response.data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching services:", error);
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Default image for all services
  const defaultImage =
    "https://www.kbb.com/wp-content/uploads/2021/08/car-maintenance-guide.jpeg";

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-10">Our Services</h1>

      {loading ? (
        <p className="text-center">Loading services...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.serviceId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={defaultImage}
                  alt={service.serviceName}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">
                  {service.serviceName}
                </h3>
                <p className="text-gray-600 mb-3">{service.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">
                    ${service.totalPrice.toLocaleString()}
                  </span>
                  {service.estimatedTime && (
                    <span className="text-sm text-gray-500">
                      Est. time: {service.estimatedTime} min
                    </span>
                  )}
                </div>
                {service.warrantyPeriod && (
                  <p className="text-sm text-green-600 mt-1">
                    {service.warrantyPeriod} days warranty
                  </p>
                )}
                <div className="mt-4">
                  <Link href={`/services/${service.serviceId}`}>
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors duration-300">
                      View Details
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
