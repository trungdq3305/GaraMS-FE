"use client";

import React from "react";
import Link from "next/link";
import { User } from "lucide-react"; // Import icon từ lucide-react
import useAuthStore from "@/app/login/hooks/useAuthStore";
import { useRouter } from "next/navigation";

export default function Navbar() {
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [isLoading, setIsLoading] = useState(true); // Trạng thái để theo dõi việc kiểm tra token

  // // Kiểm tra token trong localStorage
  // useEffect(() => {
  //   const token = localStorage.getItem("authToken");
  //   if (token) {
  //     setIsAuthenticated(true);
  //   }
  //   setIsLoading(false); // Xác nhận kiểm tra đã hoàn tất
  // }, []);

  // const handleLogout = () => {
  //   // Xóa token khỏi localStorage và cập nhật trạng thái
  //   localStorage.removeItem("authToken");
  //   localStorage.removeItem("userInfo");
  //   setIsAuthenticated(false);
  // };
  const { user, logout } = useAuthStore(); // Lấy user và logout từ useAuthStore
  const isAuthenticated = !!user; // Kiểm tra xem người dùng đã đăng nhập hay chưa
  const router = useRouter();

  const handleLogout = () => {
    logout(); // Gọi hàm logout từ useAuthStore
    router.push("/login");
  };

  return (
    <nav className="bg-gray-800 shadow-md shadow-black/5 w-full flex relative justify-between items-center mx-auto md:px-7 h-20 z-50">
      <div className="hidden md:block">
        <Link
          href="/"
          className="inline-block py-2 px-3 hover:bg-gray-600 rounded-full font-semibold"
        >
          <div className="flex items-center relative cursor-pointer whitespace-nowrap text-white">
            Home
          </div>
        </Link>
        <Link
          href="/services"
          className="inline-block py-2 px-3 hover:bg-gray-600 rounded-full font-semibold"
        >
          <div className="flex items-center relative cursor-pointer whitespace-nowrap text-white">
            Services
          </div>
        </Link>
        <Link
          href="/promotions"
          className="inline-block py-2 px-3 hover:bg-gray-600 rounded-full font-semibold"
        >
          <div className="flex items-center relative cursor-pointer whitespace-nowrap text-white">
            Promotions
          </div>
        </Link>
        <Link
          href="/inventories"
          className="inline-block py-2 px-3 hover:bg-gray-600 rounded-full font-semibold"
        >
          <div className="flex items-center relative cursor-pointer whitespace-nowrap text-white">
            Inventory
          </div>
        </Link>
        <Link
          href="/report"
          className="inline-block py-2 px-3 hover:bg-gray-600 rounded-full font-semibold"
        >
          <div className="flex items-center relative cursor-pointer whitespace-nowrap text-white">
            Report
          </div>
        </Link>
        <Link
          href="/term_policy"
          className="inline-block py-2 px-3 hover:bg-gray-600 rounded-full font-semibold"
        >
          <div className="flex items-center relative cursor-pointer whitespace-nowrap text-white">
            Term And Policy
          </div>
        </Link>
      </div>

      <Link
        href="/"
        className="flex items-center py-3 border-b border-b-gray-400 text-sm md:text-2xl md:mr-32"
      >
        <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          G A R A M S
        </h2>
      </Link>

      <div className="flex-initial">
        <div className="flex justify-end items-center relative">
          {isAuthenticated ? (
            <div className="flex items-center mr-4 space-x-3">
              <Link href="/profile">
                <User className="text-white w-6 h-6" /> {/* Icon người dùng */}
              </Link>
              <div className="text-white font-semibold hover:underline">
                {user.fullName}
              </div>
              <button
                onClick={handleLogout}
                className="text-white font-semibold hover:underline"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex space-x-4 mt-4">
              <Link
                href="/login"
                className="px-6 py-3 text-white bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 rounded-lg font-semibold tracking-wide transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 border border-gray-700"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-6 py-3 text-white bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 rounded-lg font-semibold tracking-wide transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 border border-purple-700"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
