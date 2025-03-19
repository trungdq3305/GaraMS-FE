"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Star, Users, Clock, Package, Tag, Phone, Wrench } from "lucide-react";
import axiosInstance from "@/dbUtils/axios";

// TypeScript interfaces for our data
interface Inventory {
  inventoryId: number;
  name: string;
  description: string;
  unit: string;
  price: number;
  status: boolean;
  inventorySuppliers: any[];
  serviceInventories: any[];
}

interface Promotion {
  promotionId: number;
  promotionName: string;
  startDate: string;
  endDate: string;
  discountPercent: number;
  servicePromotions: Array<{
    service?: {
      serviceName: string;
    }
  }>;
}

interface Service {
  serviceId: number;
  serviceName: string;
  description: string;
  servicePrice: number;
  inventoryPrice: number;
  promotion: number;
  totalPrice: number;
  estimatedTime: number;
  status: boolean;
}

// Hero section images
const images = [
  "https://img.freepik.com/premium-photo/car-garage-with-counter-background_265515-9144.jpg",
  "https://png.pngtree.com/thumb_back/fh260/background/20240403/pngtree-cars-in-parking-garage-interior-image_15650262.jpg",
  "https://proauto.vn/wp-content/uploads/2023/12/chi-phi-mo-gara-o-to-kinh-nghiem-mo-gara-o-to-moi-nhat-2024.png",
];

// Features list
const features = [
  {
    title: "Customer Management",
    desc: "Track customer details and service history with ease.",
    icon: Users,
  },
  {
    title: "Smart Appointments",
    desc: "Create and manage bookings efficiently.",
    icon: Clock,
  },
  {
    title: "Billing & Payments",
    desc: "Generate invoices and track payments seamlessly.",
    icon: Tag,
  },
  {
    title: "Inventory Tracking",
    desc: "Monitor parts and supplies with real-time updates.",
    icon: Package,
  },
];

// Testimonials list
const testimonials = [
  {
    name: "John Smith",
    role: "Business Owner",
    content:
      "Best garage management system I've ever used. Simplified our entire workflow.",
    rating: 5,
  },
  {
    name: "Sarah Johnson",
    role: "Service Manager",
    content:
      "The customer tracking features are incredible. Highly recommended!",
    rating: 5,
  },
  {
    name: "Mike Williams",
    role: "Auto Shop Owner",
    content: "Increased our efficiency by 50%. Worth every penny.",
    rating: 5,
  },
];

export default function HomePage() {
  // State variables
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const [testimonialsVisible, setTestimonialsVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);
  const [inventoryData, setInventoryData] = useState<Inventory[]>([]);
  const [promotionsData, setPromotionsData] = useState<Promotion[]>([]);
  const [servicesData, setServicesData] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Rotate hero images
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Handle scroll animations
  useEffect(() => {
    const handleScroll = () => {
      const features = document.getElementById("features");
      const testimonials = document.getElementById("testimonials");
      const cta = document.getElementById("cta");

      if (features) {
        const rect = features.getBoundingClientRect();
        setFeaturesVisible(rect.top < window.innerHeight * 0.8);
      }

      if (testimonials) {
        const rect = testimonials.getBoundingClientRect();
        setTestimonialsVisible(rect.top < window.innerHeight * 0.8);
      }

      if (cta) {
        const rect = cta.getBoundingClientRect();
        setCtaVisible(rect.top < window.innerHeight * 0.8);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch API data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch inventory data
        const inventoryResponse = await axiosInstance.get('inventory/inventories');
        if (inventoryResponse.data && inventoryResponse.data.data) {
          setInventoryData(inventoryResponse.data.data);
        }

        // Fetch promotions data
        const promotionsResponse = await axiosInstance.get('promotion/promotions');
        if (promotionsResponse.data && promotionsResponse.data.data) {
          setPromotionsData(promotionsResponse.data.data);
        }

        // Fetch services data
        const servicesResponse = await axiosInstance.get('service/services');
        if (servicesResponse.data && servicesResponse.data.data) {
          setServicesData(servicesResponse.data.data);
        }

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <section
        id="hero"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background Image Carousel */}
        <div className="absolute inset-0 w-full h-full">
          {images.map((img, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: i === currentImageIndex ? 1 : 0 }}
              transition={{ duration: 1.5 }}
            >
              <div className="absolute inset-0 bg-black/40 z-10" />
              <img
                src={img}
                alt={`Garage ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </div>

        {/* Diagonal Overlay */}
        <div className="absolute inset-0 z-10">
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-r from-blue-600/20 to-purple-800/20 transform -skew-y-2" />
        </div>

        {/* Animated Particles (optional) */}
        <div className="absolute inset-0 z-5 opacity-30">
          {/* You would need to implement particles with a library like particles.js */}
        </div>

        {/* Content Container */}
        <div className="container mx-auto px-4 relative z-20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left"
            >
              <span className="inline-block px-4 py-1 rounded-full bg-blue-600/30 text-blue-100 text-sm font-medium mb-6">
                Smart. Efficient. Reliable.
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
                Smarter Garage <span className="text-blue-400">Management</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-xl">
                Streamline your operations and boost customer satisfaction with our comprehensive garage management solution designed for the modern automotive service industry.
              </p>

              <div className="flex flex-wrap gap-4">
                <motion.a
                  href="/appointment"
                  className="inline-flex items-center bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 shadow-lg"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Book an Appointment
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </motion.a>

                <motion.a
                  href="/services"
                  className="inline-flex items-center bg-transparent border border-white hover:bg-white/10 px-6 py-3 rounded-lg text-lg font-semibold text-white transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore Services
                </motion.a>
              </div>

              {/* Stats or Trust Indicators */}
              <div className="mt-12 grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-400">500+</p>
                  <p className="text-sm text-gray-300">Happy Clients</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-400">24/7</p>
                  <p className="text-sm text-gray-300">Support</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-400">100%</p>
                  <p className="text-sm text-gray-300">Satisfaction</p>
                </div>
              </div>
            </motion.div>

            {/* Right Content - Floating Form or Image */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden md:block"
            >
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-2xl border border-white/20">
                <h3 className="text-2xl font-semibold text-white mb-4">Quick Appointment</h3>
                {/* Form elements would go here */}
                <div className="space-y-4">
                  <input type="text" placeholder="Your Name" className="w-full px-4 py-3 bg-white/20 rounded-lg text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-500" />
                  <input type="email" placeholder="Email Address" className="w-full px-4 py-3 bg-white/20 rounded-lg text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-500" />
                  <select className="w-full px-4 py-3 bg-white/20 rounded-lg text-black outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Select Service</option>
                    <option>Oil Change</option>
                    <option>Brake Service</option>
                    <option>Engine Diagnostic</option>
                  </select>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-lg text-white font-medium transition-all duration-300">
                    Schedule Now
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>


      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{
            opacity: featuresVisible ? 1 : 0,
            y: featuresVisible ? 0 : 50,
          }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800">
            Powerful Features
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Everything you need to manage your garage operations efficiently
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: featuresVisible ? 1 : 0,
                  scale: featuresVisible ? 1 : 0.9,
                }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-white p-8 rounded-xl hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:border-blue-100"
              >
                <div className="bg-blue-50 p-3 rounded-full inline-block mb-6 group-hover:bg-blue-100 transition-colors duration-300">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Inventory Preview Section */}
      <section id="inventory" className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800">
            Our Inventory
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Quality parts and supplies for all your vehicle needs
          </p>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">{error}</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {inventoryData.slice(0, 6).map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                  <div className="bg-gray-100 rounded-lg h-48 mb-4 flex items-center justify-center">
                    <Package className="w-16 h-16 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{item.name}</h3>
                  <p className="text-gray-600 mb-3">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600 font-semibold">
                      ${(item.price / 1000).toFixed(2)}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {item.unit} in stock
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <a
              href="/inventorymanagement"
              className="inline-block bg-blue-100 hover:bg-blue-200 text-blue-700 px-8 py-3 rounded-full text-lg font-medium transition-all duration-300"
            >
              View All Inventory
            </a>
          </div>
        </div>
      </section>

      {/* Promotions Section */}
      <section id="promotions" className="py-24 px-4 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800">
            Current Promotions
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Take advantage of our special offers and save
          </p>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">{error}</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {promotionsData.slice(0, 3).map((promo, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden relative"
                >
                  <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 rounded-bl-lg">
                    {promo.discountPercent}% OFF
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800 pr-16">{promo.promotionName}</h3>
                  <div className="flex items-center text-gray-500 mb-4">
                    <Clock className="w-4 h-4 mr-2" />
                    <span>
                      {new Date(promo.startDate).toLocaleDateString()} - {new Date(promo.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  {promo.servicePromotions && promo.servicePromotions.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Available on services:</p>
                      <ul className="space-y-1">
                        {promo.servicePromotions.map((sp, i) => (
                          <li key={i} className="text-gray-600 text-sm flex items-center">
                            <Wrench className="w-3 h-3 mr-2 text-blue-500" />
                            {sp.service ? sp.service.serviceName : "Service details unavailable"}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <a href="/services" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Book eligible service →
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-4 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{
            opacity: testimonialsVisible ? 1 : 0,
            y: testimonialsVisible ? 0 : 50,
          }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-gray-800">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Trusted by garage owners and service managers nationwide
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: testimonialsVisible ? 1 : 0,
                  scale: testimonialsVisible ? 1 : 0.9,
                }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-gray-50 p-8 rounded-xl hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">{testimonial.content}</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{testimonial.name}</p>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>


    </div>
  );
}