import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axios";
import useAuthStore from "@/app/login/hooks/useAuthStore";

export interface RecentAppointment {
  appointmentId: number;
  customerName: string;
  date: string;
  status: string;
  totalAmount: number;
}

export interface TopService {
  serviceId: number;
  serviceName: string;
  bookingCount: number;
}

export interface DashboardData {
  totalServices: number;
  totalCategories: number;
  totalActiveServices: number;
  totalActiveCategories: number;
  totalAppointments: number;
  totalPendingAppointments: number;
  totalCompletedAppointments: number;
  totalRevenue: number;
  totalCustomers: number;
  totalEmployees: number;
  recentAppointments: RecentAppointment[];
  topServices: TopService[];
}

// Separated the API call from the hook to avoid React hooks rules violation
const fetchDashboard = async (token: string | null): Promise<DashboardData> => {
  if (!token) {
    throw new Error("Authentication token not found");
  }

  const response = await axiosInstance.get("dashboard", {
    headers: {
      Authorization: `Bearer ${token}`, // Fixed template string syntax
    },
  });

  return response.data.data;
};

export const useDashboard = () => {
  const { token } = useAuthStore();

  return useQuery<DashboardData, Error>({
    queryKey: ["dashboard", token],
    queryFn: () => fetchDashboard(token),
    enabled: !!token,
    retry: false,
  });
};
