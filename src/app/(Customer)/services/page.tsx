"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const services = [
    {
        title: "Vehicle Maintenance",
        desc: "Comprehensive vehicle check-ups and repairs.",
        img: "https://www.kbb.com/wp-content/uploads/2021/08/car-maintenance-guide.jpeg",
    },
    {
        title: "Oil & Fluid Services",
        desc: "Quality oil changes and fluid replacements.",
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZASwBuwyMLXcGMQwExi_IEtPaYxeEHXctDw&s",
    },
    {
        title: "Brake & Suspension Repair",
        desc: "Ensuring safety with professional repairs.",
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRv876to6k0n8dRQ8FpTJtfutN1DMFCxp3nKw&s",
    },
    {
        title: "Tire Services",
        desc: "Balancing, alignment, and replacements.",
        img: "https://www.mrnobodystire.com/wp-content/uploads/2024/06/tire-stand.jpg",
    },
    {
        title: "Battery Services",
        desc: "Battery testing and replacements.",
        img: "https://www.hyattsautocare.com/wp-content/uploads/2020/03/189-1024x683.jpg",
    },
    {
        title: "Diagnostics & Inspections",
        desc: "Advanced vehicle diagnostics and checks.",
        img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRv876to6k0n8dRQ8FpTJtfutN1DMFCxp3nKw&s",
    },
];

export default function ServicesPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <motion.h1
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-5xl font-extrabold text-gray-900 text-center mb-12"
            >
                Our Services
            </motion.h1>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                {services.map((service, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: index * 0.2 }}
                        className="relative h-96 rounded-xl overflow-hidden shadow-xl group"
                    >
                        <Image
                            src={service.img}
                            alt={service.title}
                            layout="fill"
                            objectFit="cover"
                            className="absolute inset-0 w-full h-full group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-70 transition-all duration-500 flex flex-col justify-center items-center text-center p-6">
                            <h3 className="text-3xl font-bold text-white drop-shadow-lg">{service.title}</h3>
                            <p className="text-lg text-gray-200 mt-4 bg-gray-900 bg-opacity-50 p-3 rounded-lg shadow-md">
                                {service.desc}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
