// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import axiosInstance from "../../../dbUtils/axios";
// import useAuthStore from "@/app/login/hooks/useAuthStore";
// import { useVehicle } from "@/dbUtils/vehicleAPIs/vehicleLogin";
// import {
//   createAppointment,
//   AppointmentCreateDTO,
// } from "@/dbUtils/appointmentAPIs/appointment";

// interface Service {
//   id: number;
//   name: string;
//   totalPrice: number;
//   description: string;
// }

// interface FormData {
//   date: string;
//   note: string;
//   vehicle: string;
//   username: string;
//   email: string;
//   phone: string;
//   services: Service[];
// }

// export default function AppointmentPage() {
//   const [formData, setFormData] = useState<FormData>({
//     date: "",
//     note: "",
//     vehicle: "",
//     username: "",
//     email: "",
//     phone: "",
//     services: [],
//   });
//   const [servicesList, setServicesList] = useState<Service[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [showModal, setShowModal] = useState<boolean>(false);
//   const { user } = useAuthStore();
//   const { data: vehicleData } = useVehicle();

//   // Tự động điền thông tin người dùng từ localStorage
//   useEffect(() => {
//     const userInfo = localStorage.getItem("userInfo");
//     console.log(userInfo);
//     if (userInfo) {
//       try {
//         const user = JSON.parse(userInfo);
//         setFormData((prev) => ({
//           ...prev,
//           username: user.fullName || "",
//           email: user.email || "",
//           phone: user.phone || "",
//         }));
//       } catch (err) {
//         console.error("Failed to parse userinfo from localStorage:", err);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     const fetchServices = async () => {
//       try {
//         const response = await axiosInstance.get("service/services");
//         console.log(response);
//         const services = response.data.data.map(
//           (service: any, index: number) => ({
//             id: service.serviceId || index + 1, // Ensure a unique id
//             name: service.serviceName,
//             totalPrice: service.totalPrice,
//             description: service.description,
//           })
//         );
//         setServicesList(services);
//       } catch (err) {
//         setError("Failed to load services.");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchServices();
//   }, []);

//   const handleServiceToggle = (service: Service) => {
//     setFormData((prev) => {
//       const isSelected = prev.services.some((s) => s.id === service.id);
//       const newServices = isSelected
//         ? prev.services.filter((s) => s.id !== service.id)
//         : [...prev.services, service];

//       return { ...prev, services: newServices };
//     });
//   };

//   const handleSubmit = async () => {
//     try {
//       const serviceIdsArray = formData.services.map((service) => service.id);

//       const payload: AppointmentCreateDTO = {
//         appointmentId: 0,
//         date: formData.date,
//         note: formData.note,
//         status: "",
//         vehicleId: parseInt(formData.vehicle),
//         serviceIds: serviceIdsArray,
//       };

//       console.log("Sending payload:", payload);

//       const response = await createAppointment(payload);
//       console.log("Response:", response);

//       if (response.isSuccess) {
//         setShowModal(true);
//       } else {
//         alert(`Failed to book appointment: ${response.message}`);
//       }
//     } catch (err: any) {
//       console.error("Error booking appointment:", err);
//       alert(`Failed to book appointment: ${err.message || "Unknown error"}`);
//     }
//   };

//   const handleReload = () => {
//     setShowModal(false);
//     setFormData({
//       date: "",
//       note: "",
//       vehicle: "",
//       username: user?.fullName || "",
//       email: user?.email || "",
//       phone: user?.phone || "",
//       services: [],
//     });
//   };

//   const totalPrice = formData.services.reduce(
//     (sum, service) => sum + service.totalPrice,
//     0
//   );

//   if (loading) return <div>Loading services...</div>;
//   if (error) return <div className="text-red-600">{error}</div>;

//   return (
//     <motion.div
//       className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
//       initial={{ opacity: 0, y: 50 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <motion.div
//         className="max-w-2xl w-full p-6 bg-white shadow-md rounded-lg border border-gray-300 m-4"
//         initial={{ scale: 0.9 }}
//         animate={{ scale: 1 }}
//         transition={{ duration: 0.3 }}
//       >
//         <h1 className="text-2xl font-bold mb-4">Book an Appointment</h1>
//         <label className="block mb-2">
//           <span className="text-gray-700">Date and Time:</span>
//           <input
//             type="datetime-local"
//             className="w-full p-2 border rounded mt-1"
//             value={formData.date}
//             onChange={(e) => setFormData({ ...formData, date: e.target.value })}
//           />
//         </label>
//         <label className="block mb-2">
//           <span className="text-gray-700">Note:</span>
//           <textarea
//             className="w-full p-2 border rounded mt-1"
//             value={formData.note}
//             onChange={(e) => setFormData({ ...formData, note: e.target.value })}
//           />
//         </label>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <label className="block">
//             <span className="text-gray-700">Full Name:</span>
//             <input
//               type="text"
//               className="w-full p-2 border rounded mt-1"
//               value={user?.fullName}
//               readOnly
//             />
//           </label>
//           <label className="block">
//             <span className="text-gray-700">Email:</span>
//             <input
//               type="email"
//               className="w-full p-2 border rounded mt-1"
//               value={user?.email}
//               readOnly
//             />
//           </label>
//           <label className="block">
//             <span className="text-gray-700">Phone:</span>
//             <input
//               type="tel"
//               className="w-full p-2 border rounded mt-1"
//               value={user?.phone}
//               readOnly
//             />
//           </label>
//           <label className="block">
//             <span className="text-gray-700">Vehicle:</span>
//             <select
//               className="w-full p-2 border rounded mt-1"
//               value={formData.vehicle}
//               onChange={(e) =>
//                 setFormData({ ...formData, vehicle: e.target.value })
//               }
//             >
//               <option value="">-- Select Vehicle --</option>
//               {vehicleData?.map((vehicle) => (
//                 <option key={vehicle.vehicleId} value={vehicle.vehicleId}>
//                   {vehicle.brand} {vehicle.model} - {vehicle.plateNumber}
//                 </option>
//               ))}
//             </select>
//           </label>
//         </div>
//         <div className="mt-4">
//           <span className="text-gray-700 font-semibold">Select Services:</span>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
//             {servicesList.map((service) => (
//               <motion.label
//                 key={service.id}
//                 className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-gray-100"
//                 whileHover={{ scale: 1.05 }}
//               >
//                 <input
//                   type="checkbox"
//                   checked={formData.services.some((s) => s.id === service.id)}
//                   onChange={() => handleServiceToggle(service)}
//                 />
//                 <span>
//                   {service.name} - ${service.totalPrice}
//                 </span>
//               </motion.label>
//             ))}
//           </div>
//         </div>
//         <div className="mt-4 text-lg font-semibold">
//           Total Price: <span className="text-blue-600">${totalPrice}</span>
//         </div>
//         <motion.button
//           className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
//           onClick={handleSubmit}
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           disabled={
//             !formData.vehicle ||
//             formData.services.length === 0 ||
//             !formData.date
//           }
//         >
//           Book Appointment
//         </motion.button>
//       </motion.div>

//       {/* Modal */}
//       {showModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg">
//             <h2 className="text-lg font-semibold mb-4">
//               Appointment Successful!
//             </h2>
//             <p className="mb-4">Do you want to book another appointment?</p>
//             <div className="flex justify-end space-x-2">
//               <button
//                 className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
//                 onClick={() => setShowModal(false)}
//               >
//                 No
//               </button>
//               <button
//                 className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//                 onClick={handleReload}
//               >
//                 Yes
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </motion.div>
//   );
// }
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  Input,
  Select,
  Checkbox,
  Button,
  Modal,
  Typography,
  DatePicker,
} from "antd";
import axiosInstance from "../../../dbUtils/axios";
import useAuthStore from "@/app/login/hooks/useAuthStore";
import { useVehicle } from "@/dbUtils/vehicleAPIs/vehicleLogin";
import {
  createAppointment,
  AppointmentCreateDTO,
} from "@/dbUtils/appointmentAPIs/appointment";
import { getEmployees } from "@/dbUtils/ManagerAPIs/employeeservice";
import dayjs from "dayjs";
import { CheckCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { TextArea } = Input;

interface Service {
  id: number;
  name: string;
  totalPrice: number;
  description: string;
}

interface Employee {
  employeeId: number;
  user: {
    userName: string;
  };
}
interface FormData {
  date: string;
  note: string;
  vehicle: string;
  username: string;
  email: string;
  phone: string;
  employeeId: string;
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
    employeeId: "",
    services: [],
  });

  const [servicesList, setServicesList] = useState<Service[]>([]);
  const [employeesList, setEmployeesList] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const { user } = useAuthStore();
  const { data: vehicleData } = useVehicle();

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        setFormData((prev) => ({
          ...prev,
          username: user.fullName || "",
          email: user.email || "",
          phone: user.phone || "",
        }));
      } catch (err) {
        console.error("Failed to parse userInfo from localStorage:", err);
      }
    }
  }, []);

  // useEffect(() => {
  //   const fetchServices = async () => {
  //     try {
  //       const response = await axiosInstance.get("service/services");
  //       const services = response.data.data.map(
  //         (service: any, index: number) => ({
  //           id: service.serviceId || index + 1,
  //           name: service.serviceName,
  //           totalPrice: service.totalPrice,
  //           description: service.description,
  //         })
  //       );
  //       setServicesList(services);
  //     } catch (err) {
  //       setError("Failed to load services.");
  //       console.error(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchServices();
  // }, []);

  const fetchServices = async () => {
    try {
      const response = await axiosInstance.get("service/services");
      const services = response.data.data.map(
        (service: any, index: number) => ({
          id: service.serviceId || index + 1,
          name: service.serviceName,
          totalPrice: service.totalPrice,
          description: service.description,
        })
      );
      setServicesList(services);
    } catch (err) {
      setError("Failed to load services.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await getEmployees();
      if (response.isSuccess) {
        setEmployeesList(response.data);
      } else {
        setError("Failed to load employees.");
      }
    } catch (err) {
      setError("Failed to load employees.");
      console.error(err);
    }
  };

  // useEffect(() => {
  //   fetchServices();

  //   const intervalId = setInterval(() => {
  //     fetchServices();
  //   }, 10000);

  //   return () => clearInterval(intervalId);
  // }, []);
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchServices(), fetchEmployees()]);
      setLoading(false);
    };

    loadData();

    const intervalId = setInterval(() => {
      fetchServices();
    }, 10000);

    return () => clearInterval(intervalId);
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
    try {
      const serviceIdsArray = formData.services.map((service) => service.id);

      const localDate = dayjs(formData.date).format("YYYY-MM-DDTHH:mm:ss");

      const payload: AppointmentCreateDTO = {
        appointmentId: 0,
        date: localDate,
        note: formData.note,
        status: "",
        vehicleId: parseInt(formData.vehicle),
        employeeId: parseInt(formData.employeeId),
        serviceIds: serviceIdsArray,
      };

      const response = await createAppointment(payload);

      if (response.isSuccess) {
        setShowModal(true);
      } else {
        alert(`Failed to book appointment: ${response.message}`);
      }
    } catch (err: any) {
      console.error("Error booking appointment:", err);
      alert(`Failed to book appointment: ${err.message || "Unknown error"}`);
    }
  };

  const handleReload = () => {
    setShowModal(false);
    setFormData({
      date: "",
      note: "",
      vehicle: "",
      employeeId: "",
      username: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      services: [],
    });
  };

  const disabledHours = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      if (i < 6 || i > 17) {
        hours.push(i);
      }
    }
    return hours;
  };

  const disabledMinutes = (selectedHour: number) => {
    if (selectedHour === 6 || selectedHour === 17) {
      return Array.from({ length: 60 }, (_, i) => i).filter(
        (minute) => minute !== 0
      );
    }
    return [];
  };

  const totalPrice = formData.services.reduce(
    (sum, service) => sum + service.totalPrice,
    0
  );

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
        className="max-w-2xl w-full p-6"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="shadow-lg">
          <Title level={2}>Book an Appointment</Title>

          <div className="mb-4">
            <Text strong>Date and Time:</Text>
            <DatePicker
              showTime
              className="w-full mt-1"
              onChange={(value) =>
                setFormData({
                  ...formData,
                  date: value ? value.toISOString() : "",
                })
              }
              value={formData.date ? dayjs(formData.date) : null}
              disabledHours={disabledHours}
              disabledMinutes={disabledMinutes}
            />
          </div>

          <div className="mb-4">
            <Text strong>Note:</Text>
            <TextArea
              rows={2}
              value={formData.note}
              onChange={(e) =>
                setFormData({ ...formData, note: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input value={user?.fullName} readOnly addonBefore="Full Name" />
            <Input value={user?.email} readOnly addonBefore="Email" />
            <Input
              value={user?.phone}
              readOnly
              addonBefore="Phone"
              style={{ alignContent: "end" }}
            />
            <div>
              <Text strong>Vehicle:</Text>
              <Select
                className="w-full"
                value={formData.vehicle}
                onChange={(value) =>
                  setFormData({ ...formData, vehicle: value })
                }
                placeholder="Select Vehicle"
              >
                {vehicleData?.map((vehicle) => (
                  <Select.Option
                    key={vehicle.vehicleId}
                    value={vehicle.vehicleId}
                  >
                    {vehicle.brand} {vehicle.model} - {vehicle.plateNumber}
                  </Select.Option>
                ))}
              </Select>
            </div>
            <div>
              <Text strong>Employee:</Text>
              <Select
                className="w-full"
                value={formData.employeeId}
                onChange={(value) =>
                  setFormData({ ...formData, employeeId: value })
                }
                placeholder="Select Employee"
              >
                {employeesList.map((employee) => (
                  <Select.Option
                    key={employee.employeeId}
                    value={employee.employeeId.toString()} // Lưu employeeId dưới dạng string để khớp với Select
                  >
                    {employee.user.userName} {/* Hiển thị userName */}
                  </Select.Option>
                ))}
              </Select>
            </div>
          </div>

          <div className="mt-4">
            <Text strong>Select Services:</Text>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              {servicesList.map((service) => (
                <Checkbox
                  key={service.id}
                  checked={formData.services.some((s) => s.id === service.id)}
                  onChange={() => handleServiceToggle(service)}
                >
                  {service.name} - ${service.totalPrice}
                </Checkbox>
              ))}
            </div>
          </div>

          <div className="mt-4 text-lg font-semibold">
            Total Price: <Text type="danger">${totalPrice}</Text>
          </div>

          <Button
            className="w-full mt-4"
            type="primary"
            onClick={handleSubmit}
            disabled={
              !formData.vehicle ||
              formData.services.length === 0 ||
              !formData.date
            }
          >
            Book Appointment
          </Button>
        </Card>
      </motion.div>

      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
      >
        <div className="flex items-center gap-2">
          <CheckCircleOutlined style={{ fontSize: "24px", color: "#52c41a" }} />
          <Title level={3} className="!m-0">
            Appointment Successful!
          </Title>
        </div>
        <Text>Do you want to book another appointment?</Text>
        <div className="mt-4 flex justify-end">
          <Button onClick={() => setShowModal(false)}>No</Button>
          <Button type="primary" className="ml-2" onClick={handleReload}>
            Yes
          </Button>
        </div>
      </Modal>
    </motion.div>
  );
}
