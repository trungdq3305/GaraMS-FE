"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../../../dbUtils/axios"; // Đường dẫn tới file axiosInstance của bạn

interface Service {
    id: number;
    name: string;
    price: number;
    description: string;
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
    const [servicesList, setServicesList] = useState<Service[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await axiosInstance.get("service/services");
                const services = response.data.map((service: any, index: number) => ({
                    id: service.serviceId || index + 1, // Ensure a unique id
                    name: service.serviceName,
                    price: service.price,
                    description: service.description,
                }));
                setServicesList(services);
            } catch (err) {
                setError("Failed to load services.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    const handleServiceToggle = (service: Service) => {
        setFormData((prev) => {
            const isSelected = prev.services.some((s) => s.id === service.id);
            const newServices = isSelected
                ? prev.services.filter((s) => s.id !== service.id)
                : [...prev.services, service];

            return { ...prev, services: newServices };
        });
    };

    const handleSubmit = async () => {
        const payload = {
            appointmentId: 0, // ID sẽ được tạo bởi server
            date: formData.date,
            note: formData.note,
            status: "Pending", // Đặt trạng thái mặc định
            vehicleId: parseInt(formData.vehicle),
            serviceIds: formData.services.map((service) => service.id),
        };

        try {
            const response = await axiosInstance.post("appointments", payload);
            alert("Appointment booked successfully!");
            console.log("Response:", response.data);
        } catch (err) {
            console.error("Error booking appointment:", err);
            alert("Failed to book appointment.");
        }
    };

    const totalPrice = formData.services.reduce((sum, service) => sum + service.price, 0);

    if (loading) return <div>Loading services...</div>;
    if (error) return <div className="text-red-600">{error}</div>;

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
                    <span className="text-gray-700">Date and Time:</span>
                    <input
                        type="datetime-local"
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="block">
                        <span className="text-gray-700">Full Name:</span>
                        <input
                            type="text"
                            className="w-full p-2 border rounded mt-1"
                            value={formData.username}
                            readOnly
                        />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Email:</span>
                        <input
                            type="email"
                            className="w-full p-2 border rounded mt-1"
                            value={formData.email}
                            readOnly
                        />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Phone:</span>
                        <input
                            type="tel"
                            className="w-full p-2 border rounded mt-1"
                            value={formData.phone}
                            readOnly
                        />
                    </label>
                    <label className="block">
                        <span className="text-gray-700">Vehicle:</span>
                        <input
                            type="number"
                            className="w-full p-2 border rounded mt-1"
                            value={formData.vehicle}
                            onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
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
                                <span>
                                    {service.name} - ${service.price}
                                </span>
                            </motion.label>
                        ))}
                    </div>
                </div>
                <div className="mt-4 text-lg font-semibold">
                    Total Price: <span className="text-blue-600">${totalPrice}</span>
                </div>
                <motion.button
                    className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    onClick={handleSubmit}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Book Appointment
                </motion.button>
            </motion.div>
        </motion.div>
    );
}
