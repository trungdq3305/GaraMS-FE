import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchAppointments = async () => {
      const response = await fetch("/api/appointments");
      const data = await response.json();
      setAppointments(data);
    };

    fetchAppointments();
  }, []);

  const handleAppointmentClick = (appointmentId: number) => {
    router.push(`/appointment/${appointmentId}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Appointment History</h2>
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div
            key={appointment.appointmentId}
            className="p-4 border rounded-lg cursor-pointer hover:bg-gray-100"
            onClick={() => handleAppointmentClick(appointment.appointmentId)}
          >
            <p>
              <strong>Date:</strong>{" "}
              {new Date(appointment.date).toLocaleString()}
            </p>
            <p>
              <strong>Status:</strong> {appointment.status}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentHistory;
