import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

const Steps = ({ status }) => {
  const steps = [
    { name: "Pending", status: "pending" },
    {
      name: status === "Accept" ? "Accept" : "Reject",
      status: status.toLowerCase(),
    },
  ];

  return (
    <div className="flex space-x-4">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step.status === "pending"
                ? "bg-gray-300"
                : step.status === "accept"
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          >
            {index + 1}
          </div>
          <div className="ml-2">{step.name}</div>
        </div>
      ))}
    </div>
  );
};

const AppointmentDetail = () => {
  const [appointment, setAppointment] = useState(null);
  const router = useRouter();
  const { appointmentId } = router.query;

  useEffect(() => {
    const fetchAppointment = async () => {
      const response = await fetch(`/api/appointments/${appointmentId}`);
      const data = await response.json();
      setAppointment(data);
    };

    if (appointmentId) {
      fetchAppointment();
    }
  }, [appointmentId]);

  if (!appointment) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <div>
        <h3 className="text-xl font-bold mb-2">Status Steps</h3>
        <Steps status={appointment.status} />
      </div>
      <h2 className="text-2xl font-bold mb-4">Appointment Details</h2>
      <div className="space-y-4">
        <p>
          <strong>Date:</strong> {new Date(appointment.date).toLocaleString()}
        </p>
        <p>
          <strong>Status:</strong> {appointment.status}
        </p>
        <p>
          <strong>Note:</strong> {appointment.note}
        </p>
        <div>
          <h3 className="text-xl font-bold mb-2">Services</h3>
          {appointment.appointmentServices.map((service) => (
            <div
              key={service.appointmentServiceId}
              className="p-4 border rounded-lg"
            >
              <p>
                <strong>Service Name:</strong> {service.service.serviceName}
              </p>
              <p>
                <strong>Description:</strong> {service.service.description}
              </p>
              <p>
                <strong>Total Price:</strong> {service.service.totalPrice}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetail;
