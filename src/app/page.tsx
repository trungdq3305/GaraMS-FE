import React from "react";

export default function HomePage() {
  return (
    <main className="p-6 bg-gray-100 min-h-screen">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Garage Management System
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700">Manage Vehicles</h2>
            <p className="text-gray-600 mt-2">
              Add, update, or view details about vehicles serviced at the garage.
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700">Manage Services</h2>
            <p className="text-gray-600 mt-2">
              Keep track of all services offered and their prices.
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-700">Customer Records</h2>
            <p className="text-gray-600 mt-2">
              Maintain a database of all customers and their vehicles.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}