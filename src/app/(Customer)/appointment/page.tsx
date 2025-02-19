"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Service {
    id: number;
    name: string;
    price: number;
}

interface FormData {
    date: string;
    note: string;
    vehicle: string;
    username: string;
    email: string;
    phone: string;
    services: Service[];
}

const servicesList: Service[] = [
    { id: 1, name: "Oil Change", price: 50 },
    { id: 2, name: "Tire Rotation", price: 30 },
    { id: 3, name: "Brake Inspection", price: 40 },
    { id: 4, name: "Car Wash", price: 20 },
    { id: 5, name: "Engine Check", price: 100 },
];

export default function AppointmentPage() {
    const [formData, setFormData] = useState<FormData>({
        date: "",
        note: "",
        vehicle: "",
        username: "",
        email: "",
        phone: "",
        services: [],
    });

    const handleServiceToggle = (service: Service) => {
        setFormData((prev) => {
            const isSelected = prev.services.some((s) => s.id === service.id);
            const newServices = isSelected
                ? prev.services.filter((s) => s.id !== service.id)
                : [...prev.services, service];

            return { ...prev, services: newServices };
        });
    };

    const totalPrice = formData.services.reduce((sum, service) => sum + service.price, 0);

    return (
        <motion.div
            className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.div
                className="max-w-2xl w-full p-6 bg-white shadow-md rounded-lg border border-gray-300 m-4"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                <h1 className="text-2xl font-bold mb-4">Book an Appointment</h1>
                <label className="block mb-2">
                    <span className="text-gray-700">Date:</span>
                    <input
                        type="date"
                        className="w-full p-2 border rounded mt-1"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                </label>
                <label className="block mb-2">
                    <span className="text-gray-700">Note:</span>
                    <textarea
                        className="w-full p-2 border rounded mt-1"
                        value={formData.note}
                        onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    />
                </label>
                <label className="block mb-2">
                    <span className="text-gray-700">Vehicle:</span>
                    <input
                        type="text"
                        className="w-full p-2 border rounded mt-1"
                        value={formData.vehicle}
                        onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                    />
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="block">
                        <span className="text-gray-700">Username:</span>
                        <input
                            type="text"
                            className="w-full p-2 border rounded mt-1"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Email:</span>
                        <input
                            type="email"
                            className="w-full p-2 border rounded mt-1"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Phone:</span>
                        <input
                            type="tel"
                            className="w-full p-2 border rounded mt-1"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </label>
                </div>
                <div className="mt-4">
                    <span className="text-gray-700 font-semibold">Select Services:</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                        {servicesList.map((service) => (
                            <motion.label
                                key={service.id}
                                className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-gray-100"
                                whileHover={{ scale: 1.05 }}
                            >
                                <input
                                    type="checkbox"
                                    checked={formData.services.some((s) => s.id === service.id)}
                                    onChange={() => handleServiceToggle(service)}
                                />
                                <span>{service.name} - ${service.price}</span>
                            </motion.label>
                        ))}
                    </div>
                </div>
                <div className="mt-4 text-lg font-semibold">
                    Total Price: <span className="text-blue-600">${totalPrice}</span>
                </div>
                <motion.button
                    className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    onClick={() => alert("Appointment booked successfully!")}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Book Appointment
                </motion.button>
            </motion.div>
        </motion.div>
    );
}
