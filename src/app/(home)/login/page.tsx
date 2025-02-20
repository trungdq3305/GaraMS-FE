"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation"; // For routing in Next.js
import { login } from "../../../dbUtils/authAPIs/loginservice";
import { axiosAuth } from "@/dbUtils/axiosAuth";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Trạng thái loading khi gửi form
  const [isLoginSuccess, setIsLoginSuccess] = useState(false); // Trạng thái login thành công
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset lỗi
    setIsLoading(true); // Bắt đầu loading
  
    try {
      const response = await login(username, password);
      if (response.isSuccess && response.data?.token) {
        // Lưu token và thông tin user
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("userInfo", JSON.stringify(response.data.loginResModel));
        
        // Hiển thị modal thành công
        setIsLoginSuccess(true);
        
      } else {
        setError("Sai tên đăng nhập hoặc mật khẩu. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      setError("Có lỗi xảy ra trong quá trình đăng nhập. Vui lòng thử lại.");
    } finally {
      setIsLoading(false); // Kết thúc loading
    }
  };

  const goToHomePage = () => {
    setIsLoginSuccess(false);
  
    // Lấy thông tin user từ localStorage và kiểm tra null
    const userInfoString = localStorage.getItem("userInfo");
    const userInfo = userInfoString ? JSON.parse(userInfoString) : null;
  
    if (userInfo?.role === 3) {
      router.push("/appointments"); // Điều hướng đến "/appointments" nếu role = 3
    } else if (userInfo?.role === 1) {
      router.push("/"); // Điều hướng đến "/" nếu role = 1
      setTimeout(() => {
        window.location.reload(); // Reload lại trang sau khi điều hướng
      }, 100);
    }
    else if (userInfo?.role === 4) {
        router.push("/dashboard"); // Điều hướng đến "/" nếu role = 1
      } else {
      router.push("/"); 
      setTimeout(() => {
        window.location.reload(); // Reload lại trang sau khi điều hướng
      }, 1000);// Mặc định điều hướng đến "/" nếu không thỏa mãn điều kiện
    }
  
     // Đợi một chút để đảm bảo điều hướng được hoàn thành
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700"
      >
        <h1 className="text-3xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Welcome Back
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-900 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your Username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg bg-gray-900 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your Password"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <motion.button
            whileHover={isLoading ? undefined : { scale: 1.05 }}
            whileTap={isLoading ? undefined : { scale: 0.95 }}
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg text-lg font-semibold transition-all duration-300 ${
              isLoading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
            }`}
          >
            {isLoading ? "Đang đăng nhập..." : "Login"}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-400 hover:text-blue-300 underline">
              Signup
            </a>
          </p>
        </div>
      </motion.div>

      {/* Modal for success message */}
      {isLoginSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800 p-6 rounded-lg shadow-lg text-center space-y-4"
          >
            <h2 className="text-2xl font-bold text-green-400">Đăng nhập thành công!</h2>
            <p className="text-gray-300">Bạn đã đăng nhập thành công vào hệ thống.</p>
            <button
              onClick={goToHomePage}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-500 hover:to-purple-500"
            >
              Đi đến Trang chủ
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
