"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { LoginDto } from "../login/dto/login.dto";
import useAuthStore from "./hooks/useAuthStore";
import { RoleCode } from "@/enums/role.enum";
import { message } from "antd";
import axiosInstance from "@/dbUtils/axios";

export default function LoginPage() {
  const { login, setUser, setToken } = useAuthStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginSuccess, setIsLoginSuccess] = useState(false);
  const [userRole, setUserRole] = useState<number | null>(null);

  // Password reset states
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const mutation = useMutation({
    mutationFn: login,
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (response) => {
      setIsLoading(false);
      if (response.success) {
        const { loginResModel, token } = response.data || {};

        if (loginResModel) {
          setUser({
            userId: loginResModel.userId,
            fullName: loginResModel.fullName,
            role: loginResModel.role,
            email: loginResModel.email,
            phone: loginResModel.phone,
            address: loginResModel.address,
            status: loginResModel.status,
            createdAt: loginResModel.createdAt,
            updatedAt: loginResModel.updatedAt,
          });
          setToken(token ?? "");

          // Lưu role để sử dụng khi bấm "Đi đến Trang chủ"
          setUserRole(loginResModel.role);
          setIsLoginSuccess(true);
        } else {
          message.error("Login failed: User data is missing.");
        }
      } else {
        message.error(response.message);
      }
    },
    onError: (error: unknown) => {
      setIsLoading(false);
      message.error("Login failed: " + (error instanceof Error ? error.message : String(error)));
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values: LoginDto = {
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    };
    mutation.mutate(values);
  };

  const handleGoToHomePage = () => {
    if (userRole === RoleCode.ADMIN) {
      router.push("/dashboard");
    } else if (userRole === RoleCode.EMPLOYEE) {
      router.push("/appointments");
    } else if (userRole === RoleCode.MANAGER) {
      router.push("/appointments");
    } else {
      router.push("/");
    }
  };

  const handleForgotPassword = async () => {
    if (!email || !email.includes('@')) {
      message.error("Please enter a valid email address.");
      return;
    }

    setResetLoading(true);
    try {
      const response = await axiosInstance.post(`/user/forgot-password?email=${email}`);
      if (response) {
        localStorage.setItem("forgotEmail", email);
        message.success("Reset code sent to your email.");
        console.log("aaa")
        setShowForgotPasswordModal(false);
        setShowResetPasswordModal(true);
      } else {
        message.error(response || "Failed to send reset code.");
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }, message?: string };
      message.error("Error: " + (err.response?.data?.message || err.message || "Unknown error"));
    } finally {
      setResetLoading(false);
    }
  };

  const handleResetPassword = async () => {
    const storedEmail = localStorage.getItem("forgotEmail");
    if (!storedEmail) {
      message.error("Email not found. Please request a new reset code.");
      return;
    }
    if (!resetCode) {
      message.error("Please enter the reset code.");
      return;
    }
    if (!newPassword) {
      message.error("Please enter a new password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      message.error("Passwords do not match.");
      return;
    }

    setResetLoading(true);
    try {
      console.log(
        resetCode
      )
      const response = await axiosInstance.post(`/user/reset-password?email=${storedEmail}&code=${encodeURIComponent(resetCode)}&newPassword=${encodeURIComponent(newPassword)}`);

      console.log(response)
      if (response.data.isSuccess) {
        message.success("Password reset successfully. Please login with your new password.");
        setShowResetPasswordModal(false);
        // Clear states
        setEmail("");
        setResetCode("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        message.error(response.data.message || "Failed to reset password.");
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }, message?: string };
      message.error("Error: " + (err.response?.data?.message || err.message || "Unknown error"));
    } finally {
      setResetLoading(false);
    }
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
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              className="w-full p-3 rounded-lg bg-gray-900 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your Username"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              className="w-full p-3 rounded-lg bg-gray-900 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your Password"
              required
            />
          </div>

          {mutation.isError && (
            <p className="text-red-500 text-sm text-center">
              {mutation.error instanceof Error ? mutation.error.message : String(mutation.error)}
            </p>
          )}

          <motion.button
            whileHover={isLoading ? undefined : { scale: 1.05 }}
            whileTap={isLoading ? undefined : { scale: 0.95 }}
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg text-lg font-semibold transition-all duration-300 ${isLoading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
              }`}
          >
            {isLoading ? "Đang đăng nhập..." : "Login"}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Don&apos;t have an account?{" "}
            <a
              href="/signup"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Signup
            </a>
          </p>
          <p className="text-gray-400">
            Or
          </p>
          <p className="text-gray-400">
            Forget password?{" "}
            <a
              href="#"
              className="text-blue-400 hover:text-blue-300 underline"
              onClick={(e) => {
                e.preventDefault();
                setShowForgotPasswordModal(true);
              }}
            >
              Reset password
            </a>
          </p>
        </div>
      </motion.div>

      {isLoginSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800 p-6 rounded-lg shadow-lg text-center space-y-4 max-w-sm w-full mx-4"
          >
            <h2 className="text-2xl font-bold text-green-400">
              Đăng nhập thành công!
            </h2>
            <p className="text-gray-300">
              Bạn đã đăng nhập thành công vào hệ thống.
            </p>
            <button
              onClick={handleGoToHomePage}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-500 hover:to-purple-500"
            >
              Đi đến Trang chủ
            </button>
          </motion.div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800 p-6 rounded-lg shadow-lg text-center space-y-4 max-w-sm w-full mx-4"
          >
            <h2 className="text-2xl font-bold text-blue-400">
              Password Reset
            </h2>
            <p className="text-gray-300">
              Enter your email to receive a password reset code.
            </p>

            <div className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-900 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your Email"
                required
              />

              <div className="flex gap-3">
                <button
                  onClick={() => setShowForgotPasswordModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white font-semibold hover:bg-gray-600"
                  disabled={resetLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleForgotPassword}
                  disabled={resetLoading}
                  className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-500 hover:to-purple-500"
                >
                  {resetLoading ? "Sending..." : "Send Code"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800 p-6 rounded-lg shadow-lg text-center space-y-4 max-w-sm w-full mx-4"
          >
            <h2 className="text-2xl font-bold text-blue-400">
              Reset Your Password
            </h2>
            <p className="text-gray-300">
              Enter the code sent to your email and your new password.
            </p>

            <div className="space-y-4">
              <input
                type="text"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-900 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Reset Code"
                required
              />

              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-900 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="New Password"
                required
              />

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-900 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm Password"
                required
              />

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowResetPasswordModal(false);
                    setShowForgotPasswordModal(true);
                  }}
                  className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white font-semibold hover:bg-gray-600"
                  disabled={resetLoading}
                >
                  Back
                </button>
                <button
                  onClick={handleResetPassword}
                  disabled={resetLoading}
                  className="flex-1 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-500 hover:to-purple-500"
                >
                  {resetLoading ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}