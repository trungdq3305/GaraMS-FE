"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Star, Users, Clock } from "lucide-react";

const images = [
  "https://img.freepik.com/premium-photo/car-garage-with-counter-background_265515-9144.jpg",
  "https://png.pngtree.com/thumb_back/fh260/background/20240403/pngtree-cars-in-parking-garage-interior-image_15650262.jpg",
  "https://proauto.vn/wp-content/uploads/2023/12/chi-phi-mo-gara-o-to-kinh-nghiem-mo-gara-o-to-moi-nhat-2024.png",
];

const features = [
  { title: "Customer Management", desc: "Track customer details and history.", icon: Users },
  { title: "Smart Appointments", desc: "Create and manage bookings.", icon: Clock },
  { title: "Billing & Payments", desc: "Generate invoices with ease.", icon: Star },
  { title: "Inventory Tracking", desc: "Monitor parts efficiently.", icon: Star },
];

const testimonials = [
  {
    name: "John Smith",
    role: "Business Owner",
    content: "Best garage management system I've ever used. Simplified our entire workflow.",
    rating: 5
  },
  {
    name: "Sarah Johnson",
    role: "Service Manager",
    content: "The customer tracking features are incredible. Highly recommended!",
    rating: 5
  },
  {
    name: "Mike Williams",
    role: "Auto Shop Owner",
    content: "Increased our efficiency by 50%. Worth every penny.",
    rating: 5
  }
];

export default function HomePage() {
  const [index, setIndex] = useState(0);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const [testimonialsVisible, setTestimonialsVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);
  const [bookingFormVisible, setBookingFormVisible] = useState(false);
  const [quickStatsVisible, setQuickStatsVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const features = document.getElementById('features');
      const testimonials = document.getElementById('testimonials');
      const cta = document.getElementById('cta');

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

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const scrollToStats = () => {
    setQuickStatsVisible(!quickStatsVisible);
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      {/* Hero Section */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center px-4">
        <div className="absolute inset-0 w-full h-full">
          {images.map((img, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: i === index ? 1 : 0 }}
              transition={{ duration: 1 }}
            >
              <img
                src={img}
                alt={`Garage ${i + 1}`}
                className="w-full h-full object-cover brightness-50"
              />
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
          >
            Next-Gen Garage Management
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl md:text-2xl text-gray-300 mb-8"
          >
            Streamline your operations with our advanced management solution
          </motion.p>
          <motion.div
            className="space-x-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <a href="/appointment" className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25">
              Book an Appointment Now
            </a>
            <a href="/contact" className="inline-block bg-gray-800 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-700 transition-all duration-300 border border-gray-700 hover:border-gray-600">
              Contact Us
            </a>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 cursor-pointer"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown size={40} className="text-gray-400" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: featuresVisible ? 1 : 0, y: featuresVisible ? 0 : 50 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Powerful Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: featuresVisible ? 1 : 0, scale: featuresVisible ? 1 : 0.9 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-gray-800 p-6 rounded-xl hover:bg-gray-700 transition-all duration-300 border border-gray-700 hover:border-gray-600"
              >
                <feature.icon className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-gray-800/50">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: testimonialsVisible ? 1 : 0, y: testimonialsVisible ? 0 : 50 }}
          transition={{ duration: 0.8 }}
          className="max-w-7xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            What Our Clients Say
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: testimonialsVisible ? 1 : 0, scale: testimonialsVisible ? 1 : 0.9 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">{testimonial.content}</p>
                <div className="text-sm">
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-gray-400">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: ctaVisible ? 1 : 0, y: ctaVisible ? 0 : 50 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Ready to Transform Your Garage?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Join thousands of successful garage owners who have already upgraded their business
          </p>
          <div className="space-x-4">
            <a href="/register" className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25">
              Start Free Trial
            </a>
            <a href="tel:+1234567890" className="inline-flex items-center bg-gray-800 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-700 transition-all duration-300 border border-gray-700 hover:border-gray-600">
              <Clock className="w-5 h-5 mr-2" />
              Call Us
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
}