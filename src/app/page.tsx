"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const images = [
  "https://img.freepik.com/premium-photo/car-garage-with-counter-background_265515-9144.jpg",
  "https://png.pngtree.com/thumb_back/fh260/background/20240403/pngtree-cars-in-parking-garage-interior-image_15650262.jpg",
  "https://product.hstatic.net/1000387428/product/7d712abe6f524560997151ae9ce8792e_84022ce2d8624941b5fec7139a400ac6_master.jpg",
];

export default function HomePage() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto px-4 py-16 bg-gradient-to-b from-gray-50 to-gray-200">
      {/* Hero Section */}
      <section className="relative flex justify-center items-center h-[600px] overflow-hidden rounded-xl shadow-2xl">
        <div className="absolute inset-0 w-full h-full">
          {images.map((img, i) => (
            <motion.img
              key={i}
              src={img}
              alt="Garage"
              className="absolute inset-0 w-full h-full object-cover rounded-xl transition-opacity duration-1000"
              style={{ opacity: i === index ? 1 : 0 }}
            />
          ))}
          <div className="absolute inset-0 bg-black bg-opacity-40" />
        </div>

        <div className="relative text-center text-white z-10 bg-black bg-opacity-60 p-8 rounded-lg shadow-lg">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl font-extrabold mb-6 text-gray-100 drop-shadow-lg"
          >
            Professional & Easy Garage Management
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-4xl mx-auto text-xl text-gray-300"
          >
            Optimize workflow, enhance efficiency, and improve customer service.
          </motion.p>
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <a href="/appointments" className="bg-gradient-to-r from-gray-800 to-gray-600 text-white px-10 py-4 text-xl rounded-md shadow-md hover:shadow-xl transition transform hover:scale-105">
              Book an Appointment
            </a>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-20 grid md:grid-cols-2 lg:grid-cols-3 gap-12 text-center">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="p-10 bg-white rounded-xl shadow-lg hover:shadow-2xl transition flex flex-col items-center border border-gray-200 transform hover:scale-105"
          >
            <Image src={feature.img} alt={feature.title} width={120} height={120} className="mb-6 rounded-lg shadow-md" />
            <h3 className="text-3xl font-semibold text-gray-800 drop-shadow-lg">{feature.title}</h3>
            <p className="text-gray-600 mt-4 text-lg bg-gray-50 p-2 rounded-md shadow-md">{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* CTA */}
      <section className="mt-24 text-center">
        <div className="bg-white px-8 py-12 rounded-lg shadow-lg inline-block border border-gray-300">
          <h2 className="text-5xl font-bold text-gray-800 drop-shadow-lg">Start Today</h2>
          <p className="text-gray-700 mt-4 text-xl bg-gray-100 inline-block px-4 py-2 rounded-lg">
            Sign up to experience the best garage management system.
          </p>
          <motion.div
            className="mt-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/register">
              <span className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-12 py-5 text-2xl rounded-xl shadow-lg hover:shadow-xl transition transform hover:scale-105">
                Register Now
              </span>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
const features = [
  { title: "Customer Management", desc: "Track customer details and history.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQ9DGxAzLxRM2VduRsWkNgA0ZKlORxb11uSQ&s" },
  { title: "Smart Appointments", desc: "Create and manage bookings.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqDnD7bIAfF_bOzX-KUm2atPHGpl2Nu4N9Wg&s" },
  { title: "Billing & Payments", desc: "Generate invoices with ease.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGAQS_k6WNyxz8OnQWEJChV_Qet26mfjqR4w&s" },
  { title: "Inventory Tracking", desc: "Monitor parts efficiently.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm8HxS_biWibUwp74NDNv64P5PWKEAmBw0Dg&s" },
  { title: "Work Order Management", desc: "Assign and track orders.", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6PYpVkk9y_7GXL1qJRY9kmGw7Pas4E2xYtA&s" },
  { title: "Detailed Analytics", desc: "Gain business insights.", img: "https://desk.zoho.com/DocsDisplay?zgId=4241905&mode=inline&blockId=gy7ef82da94891b8a449faa660ecb5afb05a4" }
];
