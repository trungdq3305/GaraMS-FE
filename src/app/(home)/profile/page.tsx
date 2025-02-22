"use client";

import React, { useState } from "react";
// import { useRouter } from "next/navigation";
import AppointmentHistory from "@/app/appointmentbycustomer/page";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  //   const router = useRouter();

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
      </div>

      {activeTab === "profile" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
          <div className="space-y-2">
            <p>
              <strong>Name:</strong>{" "}
            </p>
            <p>
              <strong>Email:</strong>{" "}
            </p>
            <p>
              <strong>Phone:</strong>{" "}
            </p>
          </div>
        </div>
      )}

      {activeTab === "appointments" && <AppointmentHistory />}
    </div>
  );
};

export default Profile;
