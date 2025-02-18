"use client";

import { Card, CardContent } from "@/components/ui/cart";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { Bell, Menu } from "lucide-react";

const dataPie = [
    { name: "Manager", value: 400, color: "#3b82f6" },
    { name: "Employee", value: 300, color: "#14b8a6" },
    { name: "Customer", value: 200, color: "#a855f7" },
];

const dataLine = [
    { date: "2024-01-01", value: 1000 },
    { date: "2024-01-07", value: 1500 },
    { date: "2024-01-14", value: 2000 },
    { date: "2024-01-21", value: 1800 },
    { date: "2024-01-28", value: 2200 },
    { date: "2024-02-04", value: 1400 },
];

export default function Dashboard() {
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-100 p-4 space-y-4">
                <button className="flex items-center space-x-2 text-gray-700">
                    <Menu size={20} />
                    <span>Menu</span>
                </button>
                <nav className="space-y-2">
                    <a href="#" className="flex items-center space-x-2 p-2 rounded bg-gray-200">
                        <span>🏠 Home</span>
                    </a>
                    <a href="#" className="flex items-center space-x-2 p-2">
                        <span>📊 Management</span>
                    </a>
                    <a href="#" className="flex items-center space-x-2 p-2">
                        <span>📦 Services</span>
                    </a>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6">
                {/* Header */}
                {/* <header className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-bold">Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        <Bell size={24} />
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                            <span>User</span>
                        </div>
                    </div>
                </header> */}

                {/* Statistics Cards */}
                <div className="grid grid-cols-4 gap-4 mb-6">
                    {[
                        { title: "Today's Sales", value: "$53,000", change: "+30%", icon: "💲" },
                        { title: "Today's Users", value: "$3,200", change: "+20%", icon: "🚀" },
                        { title: "New Clients", value: "$1,200", change: "-15%", icon: "📅" },
                        { title: "New Orders", value: "$13,200", change: "+1%", icon: "🛍" },
                    ].map((stat, index) => (
                        <Card key={index} className="p-4 shadow-md">
                            <CardContent className="flex justify-between items-center">
                                <div>
                                    <p className="text-gray-500">{stat.title}</p>
                                    <p className="text-xl font-bold">{stat.value}</p>
                                    <p className={`text-sm ${stat.change.includes("-") ? "text-red-500" : "text-green-500"}`}>{stat.change}</p>
                                </div>
                                <span className="text-4xl">{stat.icon}</span>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-2 gap-6">
                    {/* Pie Chart */}
                    <Card className="p-4 shadow-md">
                        <h2 className="text-lg font-semibold mb-2">Personnel statistics</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={dataPie} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                                    {dataPie.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="flex justify-center space-x-4 mt-4">
                            {dataPie.map((item, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-sm">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Line Chart */}
                    <Card className="p-4 shadow-md">
                        <h2 className="text-lg font-semibold mb-2">Revenue statistics</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={dataLine}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </div>
            </main>
        </div>
    );
}
