import axiosInstance from "../axios";

// export const getDashboardData = async () => {
//   const response = await axiosInstance.get("/dashboard");
//   return response.data;
// };

// export const getTopServices = async (count: number) => {
//   const response = await axiosInstance.get(`/dashboard/top-services?count=${count}`);
//   return response.data;
// };

// export const getRevenue = async (startDate: string, endDate: string) => {
//   const response = await axiosInstance.get(`/dashboard/revenue?startDate=${startDate}&endDate=${endDate}`);
//   return response.data;
// };

// export const getRecentAppointments = async (count: number) => {
//   const response = await axiosInstance.get(`/dashboard/recent-appointments?count=${count}`);
//   return response.data;
// };
export const getDashboardData = async () => {
    return {
      totalServices: 25,
      totalCategories: 10,
      totalActiveServices: 20,
      totalActiveCategories: 8,
      totalAppointments: 150,
      totalPendingAppointments: 25,
      totalCompletedAppointments: 100,
      totalRevenue: 50000,
      totalCustomers: 120,
      totalEmployees: 15,
      recentAppointments: [
        {
          appointmentId: 1,
          customerName: "John Doe",
          date: "2025-02-20T12:00:00.000Z",
          status: "Completed",
          totalAmount: 100,
        },
        {
          appointmentId: 2,
          customerName: "Jane Smith",
          date: "2025-02-19T15:30:00.000Z",
          status: "Pending",
          totalAmount: 200,
        },
        {
          appointmentId: 3,
          customerName: "Alice Brown",
          date: "2025-02-18T10:45:00.000Z",
          status: "Cancelled",
          totalAmount: 150,
        },
      ],
      topServices: [
        {
          serviceId: 1,
          serviceName: "Car Wash",
          bookingCount: 50,
          revenue: 10000,
        },
        {
          serviceId: 2,
          serviceName: "Car Clean",
          bookingCount: 30,
          revenue: 6000,
        },
        {
          serviceId: 3,
          serviceName: "Change Tire",
          bookingCount: 20,
          revenue: 4000,
        },
      ],
    };
  };
  
  export const getTopServices = async (count: number) => {
    return [
      {
        serviceId: 1,
        serviceName: "Car Wash",
        bookingCount: 50,
        revenue: 10000,
      },
      {
        serviceId: 2,
        serviceName: "Car Clean",
        bookingCount: 30,
        revenue: 6000,
      },
      {
        serviceId: 3,
        serviceName: "Change Tire",
        bookingCount: 20,
        revenue: 4000,
      },
      {
        serviceId: 4,
        serviceName: "Oil Change",
        bookingCount: 10,
        revenue: 2000,
      },
      {
        serviceId: 5,
        serviceName: "Battery Replacement",
        bookingCount: 5,
        revenue: 1000,
      },
    ];
  };
  
  export const getRecentAppointments = async (count: number) => {
    return [
      {
        appointmentId: 1,
        customerName: "John Doe",
        date: "2025-02-20T12:00:00.000Z",
        status: "Completed",
        totalAmount: 100,
      },
      {
        appointmentId: 2,
        customerName: "Jane Smith",
        date: "2025-02-19T15:30:00.000Z",
        status: "Pending",
        totalAmount: 200,
      },
      {
        appointmentId: 3,
        customerName: "Alice Brown",
        date: "2025-02-18T10:45:00.000Z",
        status: "Cancelled",
        totalAmount: 150,
      },
      {
        appointmentId: 4,
        customerName: "Robert White",
        date: "2025-02-17T09:30:00.000Z",
        status: "Completed",
        totalAmount: 120,
      },
      {
        appointmentId: 5,
        customerName: "Laura Black",
        date: "2025-02-16T14:00:00.000Z",
        status: "Pending",
        totalAmount: 80,
      },
    ];
  };
  