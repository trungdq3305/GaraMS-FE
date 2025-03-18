"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuthStore from "../login/hooks/useAuthStore";

const ManagerLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const onLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}{user?.role === 4 && (
      <aside className="w-64 bg-gray-800 text-white flex flex-col shadow-md">
        <div className="h-20 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
          <h1 className="text-2xl font-bold">GaraMS Admin</h1>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-4">
            
              <>
              <li>
                <Link
                  href="/dashboard"
                  className="block px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/usermanagement"
                  className="block px-4 py-2 rounded-lg hover:bg-gray-700"
                >
                  User Management
                </Link>
              </li>
              </>
            

            
          </ul>
        </nav>
        <button
          onClick={onLogout}
          className="m-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
        >
          Logout
        </button>
      </aside>
      )}
{user?.role === 3 && (
      <aside className="w-64 bg-gray-800 text-white flex flex-col shadow-md">
        <div className="h-20 flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
          <h1 className="text-2xl font-bold">GaraMS Manager</h1>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-4">
            

            
              <>
                <li>
                  <Link
                    href="/appointments"
                    className="block px-4 py-2 rounded-lg hover:bg-gray-700"
                  >
                    Appointments
                  </Link>
                </li>
                <li>
                  <Link
                    href="/inventorymanagement"
                    className="block px-4 py-2 rounded-lg hover:bg-gray-700"
                  >
                    Inventory - Supplier
                  </Link>
                </li>
                <li>
                  <Link
                    href="/servicemanagement"
                    className="block px-4 py-2 rounded-lg hover:bg-gray-700"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    href="/promotionmanagement"
                    className="block px-4 py-2 rounded-lg hover:bg-gray-700"
                  >
                    Promotion
                  </Link>
                </li>
                <li>
                  <Link
                    href="/employeemanagement"
                    className="block px-4 py-2 rounded-lg hover:bg-gray-700"
                  >
                    Employee
                  </Link>
                </li>
                <li>
                  <Link
                    href="/reportmanagement"
                    className="block px-4 py-2 rounded-lg hover:bg-gray-700"
                  >
                    Report
                  </Link>
                </li>
              </>
            
          </ul>
        </nav>
        <button
          onClick={onLogout}
          className="m-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500"
        >
          Logout
        </button>
      </aside>
      )}
      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
};

export default ManagerLayout;
