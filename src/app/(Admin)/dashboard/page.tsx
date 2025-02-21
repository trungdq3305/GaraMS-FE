"use client";

import React, { useEffect, useState } from "react";
import { getDashboardData, getTopServices, getRecentAppointments } from "@/dbUtils/AdminAPIs/dashboardservice";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, CartesianGrid } from "recharts";
import moment from "moment";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF4560"];

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [topServices, setTopServices] = useState<any[]>([]);
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const dashboard = await getDashboardData();
        const services = await getTopServices(5);
        const appointments = await getRecentAppointments(5);

        setDashboardData(dashboard);
        setTopServices(services);
        setRecentAppointments(appointments);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  if (!dashboardData) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Dashboard Overview</h1>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h2 className="font-bold text-lg">Total Revenue</h2>
          <p className="text-2xl">${dashboardData.totalRevenue.toLocaleString()}</p>
          <p className="text-gray-500">Overall revenue generated</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h2 className="font-bold text-lg">Total Services</h2>
          <p className="text-2xl">{dashboardData.totalServices}</p>
          <p className="text-gray-500">Number of services offered</p>
        </div>
        <div className="bg-white shadow rounded-lg p-4 text-center">
          <h2 className="font-bold text-lg">Total Appointments</h2>
          <p className="text-2xl">{dashboardData.totalAppointments}</p>
          <p className="text-gray-500">Total appointments booked</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart for Revenue Distribution */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-center">Revenue Distribution by Service</h2>
          <PieChart width={400} height={300} className="mx-auto">
            <Pie
              data={topServices}
              dataKey="revenue"
              nameKey="serviceName"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {topServices.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
          <p className="text-gray-500 text-center mt-4">Breakdown of revenue contribution by top services</p>
        </div>

        {/* Bar Chart for Top Services */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-center">Top Services by Revenue</h2>
          <BarChart width={500} height={300} data={topServices} className="mx-auto">
            <XAxis dataKey="serviceName" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#0088FE" />
          </BarChart>
          <p className="text-gray-500 text-center mt-4">Top-performing services based on revenue</p>
        </div>
      </div>

      {/* Line Chart for Recent Appointments */}
      <div className="mt-8 bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-center">Recent Appointments Overview</h2>
        <LineChart width={600} height={300} data={recentAppointments} className="mx-auto">
          <XAxis dataKey="date" tickFormatter={(date) => moment(date).format("MMM DD")} />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="totalAmount" stroke="#FF8042" />
        </LineChart>
        <p className="text-gray-500 text-center mt-4">Trend of total amounts from recent appointments</p>
      </div>
    </div>
  );
};

export default Dashboard;
