"use client";

import React from "react";
import { useRouter } from "next/navigation";

const vehicles = [
  { vehicleId: 1, plateNumber: "30A-12345", brand: "Toyota", model: "Camry" },
  { vehicleId: 2, plateNumber: "29B-67890", brand: "Honda", model: "Civic" },
];

const Vehicles = () => {
  const router = useRouter();

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Vehicle Information
      </h2>
      <div className="space-y-4">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.vehicleId}
            className="bg-white shadow-lg rounded-lg p-6 border flex flex-col md:flex-row justify-between items-center w-full"
          >
            <div className="text-lg md:text-xl">
              <p>
                <strong>Plate Number:</strong> {vehicle.plateNumber}
              </p>
              <p>
                <strong>Brand:</strong> {vehicle.brand}
              </p>
              <p>
                <strong>Model:</strong> {vehicle.model}
              </p>
            </div>
            <button
              onClick={() => router.push(`/vehicles/${vehicle.vehicleId}`)}
              className="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-2 rounded-lg text-lg hover:bg-blue-700 transition"
            >
              Chi tiết
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Vehicles;
