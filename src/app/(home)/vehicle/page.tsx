"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useVehicle } from "@/dbUtils/vehicleAPIs/vehicleLogin";
import { useCreateVehicle } from "@/dbUtils/vehicleAPIs/vehicleCreate";
import Link from "next/link";

const Vehicles = () => {
  const router = useRouter();
  const { data: vehicleData, isLoading, error } = useVehicle();
  const { mutate, isPending: isCreating } = useCreateVehicle();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    plateNumber: "",
    brand: "",
    model: "",
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ plateNumber: "", brand: "", model: "" }); // Reset form
  };

  const handleSubmit = () => {
    mutate(formData, {
      onSuccess: () => closeModal(),
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-[50vh]">
        <div className="text-xl">Loading vehicles...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex flex-col justify-center items-center min-h-[50vh]">
        <div className="text-xl text-red-500 mb-4">
          {error.message || "Error loading vehicles"}
        </div>
        <Link
          href="/"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Back to homepage
        </Link>
      </div>
    );
  }

  const vehicles = Array.isArray(vehicleData)
    ? vehicleData
    : vehicleData
    ? [vehicleData]
    : [];

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Vehicle Information
      </h2>

      {vehicles.length === 0 ? (
        <div className="p-6 flex flex-col justify-center items-center min-h-[50vh]">
          <div className="text-xl mb-4">
            You do not have vehicle information
          </div>
          <button
            onClick={openModal}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Add your new vehicle
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.vehicleId}
                className="bg-white shadow-lg rounded-lg p-6 border flex justify-between items-center"
              >
                <div>
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
                  onClick={() => router.push(`/profile/${vehicle.vehicleId}`)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Detail
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={openModal}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Add new vehicle
            </button>
          </div>
        </>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h3 className="text-2xl font-bold mb-4">Add New Vehicle</h3>
            <input
              type="text"
              placeholder="Plate Number"
              value={formData.plateNumber}
              onChange={(e) =>
                setFormData({ ...formData, plateNumber: e.target.value })
              }
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="text"
              placeholder="Brand"
              value={formData.brand}
              onChange={(e) =>
                setFormData({ ...formData, brand: e.target.value })
              }
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="text"
              placeholder="Model"
              value={formData.model}
              onChange={(e) =>
                setFormData({ ...formData, model: e.target.value })
              }
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-between">
              <button
                onClick={closeModal}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                disabled={isCreating}
              >
                {isCreating ? "Adding..." : "Add Vehicle"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vehicles;
