"use client";

import React from "react";

const vehicles = [
  { vehicleId: 1, plateNumber: "30A-12345", brand: "Toyota", model: "Camry" },
  { vehicleId: 2, plateNumber: "29B-67890", brand: "Honda", model: "Civic" },
];

const Vehicles = () => {
  return (
    <div className="">
      <h2 className="text-2xl font-bold mb-4">Vehicle Information</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.vehicleId}
            className="bg-white shadow-md rounded-lg p-4 border"
          >
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
        ))}
      </div>
    </div>
  );
};

export default Vehicles;
