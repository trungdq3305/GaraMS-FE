"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useAppointment } from "@/dbUtils/appointmentAPIs/getAppointment";
import Link from "next/link";

const AppointmentVehicle = () => {
  const { vehicleId } = useParams();

  const { data: appointments, isLoading, error } = useAppointment();

  if (isLoading) {
    return <div className="p-6 text-center">Loading appointments...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-red-500 text-center">
        Error loading appointments
      </div>
    );
  }

  const vehicleData = appointments?.find(
    (vehicle) => vehicle.vehicleId === Number(vehicleId)
  );

  const filteredAppointments = vehicleData?.appointments ?? [];

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Vehicle Appointments
      </h2>
      {filteredAppointments.length === 0 ? (
        <div className="text-center text-lg">
          No appointments found for this vehicle.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <div
              key={appointment.appointmentId}
              className="bg-white shadow-lg rounded-lg p-6 border"
            >
              <p>
                <strong>Date:</strong>{" "}
                {new Date(appointment.date).toLocaleString()}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${
                    appointment.status === "Pending"
                      ? "bg-yellow-500"
                      : appointment.status === "Reject"
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                >
                  {appointment.status}
                </span>
              </p>
              <p>
                <strong>Note:</strong> {appointment.note || "N/A"}
              </p>
              {appointment.rejectReason && (
                <p>
                  <strong>Reject Reason:</strong> {appointment.rejectReason}
                </p>
              )}
              <p>
                <strong>Services:</strong>
              </p>
              <ul className="list-disc pl-6">
                {appointment.appointmentServices.map((service) => (
                  <li key={service.appointmentServiceId}>
                    {service.service.serviceName} - $
                    {service.service.totalPrice}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      <div className="mt-6 text-center">
        <Link
          href="/profile"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Back to Vehicles
        </Link>
      </div>
    </div>
  );
};

export default AppointmentVehicle;
