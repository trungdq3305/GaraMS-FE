"use client";

import React, { useState } from "react";
import AppointmentHistory from "@/app/appointmentbycustomer/page";
import Vehicles from "../vehicle/page";
import useAuthStore from "@/app/login/hooks/useAuthStore";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { user } = useAuthStore();

  return (
    <div className="p-8">
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 ${
            activeTab === "profile" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Profile
        </button>
        <button
          onClick={() => setActiveTab("appointments")}
          className={`px-4 py-2 ${
            activeTab === "appointments"
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Appointment History
        </button>
        <button
          onClick={() => setActiveTab("vehicles")}
          className={`px-4 py-2 ${
            activeTab === "vehicles" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Vehicles
        </button>
      </div>

      {activeTab === "profile" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
          <div className="space-y-2">
            <p>
              <strong>Name:</strong> {user?.fullName}
            </p>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>Phone:</strong> {user?.phone}
            </p>
            <p>
              <strong>Address:</strong> {user?.address}
            </p>
          </div>
        </div>
      )}

      {activeTab === "appointments" && <AppointmentHistory />}
      {activeTab === "vehicles" && <Vehicles />}
    </div>
  );
};

export default Profile;
