"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import { createUser } from "@/dbUtils/authAPIs/registerService";
import axiosInstance from "@/dbUtils/axios";
export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [passwordError, setPasswordError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegisterSuccess, setIsRegisterSuccess] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationError, setVerificationError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });

    if (id === "password" || id === "confirmPassword") {
      if (id === "confirmPassword" && value !== formData.password) {
        setPasswordError("Passwords do not match.");
      } else if (id === "password" && value !== formData.confirmPassword) {
        setPasswordError("Passwords do not match.");
      } else {
        setPasswordError("");
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (passwordError || !formData.password || !formData.confirmPassword) {
      alert("Please correct the errors before submitting.");
      return;
    }

    const requestData = {
      userName: formData.username,
      password: formData.password,
      email: formData.email,
      phoneNumber: formData.phone,
      fullName: formData.fullName,
      address: formData.address,
      roleId: 1, // Default role ID
    };

    setLoading(true);

    try {
      await createUser(requestData);
      // Instead of setting success immediately, show the verification modal
      setShowVerificationModal(true);
    } catch (error: any) {
      console.error("Error during registration:", error);
      alert(error || "An error occurred during registration.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVerificationCode(e.target.value);
    setVerificationError("");
  };

  const handleVerifyCode = async () => {
    if (!verificationCode.trim()) {
      setVerificationError("Please enter the verification code");
      return;
    }

    setVerificationLoading(true);
    try {
      const encodedEmail = encodeURIComponent(formData.email);
      const encodedCode = encodeURIComponent(verificationCode);

      const response = await axiosInstance.post(`user/confirm-with-code?email=${formData.email}&code=${verificationCode}`);
      // Verification successful
      setShowVerificationModal(false);
      setIsRegisterSuccess(true);
    } catch (error: any) {
      console.error("Error during verification:", error);
      setVerificationError(error.message || "Invalid verification code. Please try again.");
    } finally {
      setVerificationLoading(false);
    }
  };

  const goToLoginPage = () => {
    window.location.href = "/login"; // Redirect to login page
  };

  const resendVerificationCode = async () => {
    // Implement the logic to resend the verification code
    // This would typically call an API endpoint to resend the code
    alert("Verification code resent to your email.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-100 flex items-center justify-center">
      {/* Verification Code Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800 p-8 rounded-xl shadow-lg text-center space-y-6 max-w-md w-full border border-gray-700"
          >
            <h2 className="text-2xl font-bold text-blue-400">Email Verification</h2>
            <p className="text-gray-300">
              We've sent a verification code to your email address: <br />
              <span className="font-medium text-white">{formData.email}</span>
            </p>

            <div className="space-y-2">
              <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-300 text-left">
                Enter Verification Code
              </label>
              <input
                type="text"
                id="verificationCode"
                value={verificationCode}
                onChange={handleVerificationCodeChange}
                className="w-full p-3 rounded-lg bg-gray-900 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter 6-digit code"
              />
              {verificationError && (
                <p className="text-red-500 text-sm mt-1 text-left">{verificationError}</p>
              )}
            </div>

            <div className="flex flex-col space-y-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleVerifyCode}
                disabled={verificationLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-3 rounded-lg text-lg font-semibold hover:from-blue-500 hover:to-purple-500 transition-all duration-300"
              >
                {verificationLoading ? "Verifying..." : "Verify"}
              </motion.button>

              <button
                onClick={resendVerificationCode}
                className="text-blue-400 hover:text-blue-300 text-sm underline"
              >
                Didn't receive a code? Resend
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Success Modal */}
      {isRegisterSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-800 p-6 rounded-lg shadow-lg text-center space-y-4"
          >
            <h2 className="text-2xl font-bold text-green-400">Registration Successful!</h2>
            <p className="text-gray-300">Your account has been created and verified successfully.</p>
            <button
              onClick={goToLoginPage}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-500 hover:to-purple-500"
            >
              Go to Login Page
            </button>
          </motion.div>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700"
      >
        <h1 className="text-3xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
          Create an Account
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Form Fields */}
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-900 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your Username"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-900 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your Password"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full p-3 rounded-lg bg-gray-900 text-gray-100 border ${passwordError ? "border-red-500" : "border-gray-700"
                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Confirm Your Password"
              required
            />
            {passwordError && (
              <p className="text-red-500 text-sm mt-1">{passwordError}</p>
            )}
          </div>

          {/* Other Fields */}
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-900 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your Full Name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-900 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your Email"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
              Phone
            </label>
            <input
              type="text"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-900 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your Phone Number"
              required
            />
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-2">
              Address
            </label>
            <input
              type="text"
              id="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-gray-900 text-gray-100 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your Address"
              required
            />
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-3 rounded-lg text-lg font-semibold hover:from-blue-500 hover:to-purple-500 transition-all duration-300"
          >
            {loading ? "Registering..." : "Register"}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Already have an account?{" "}
            <a href="/login" className="text-blue-400 hover:text-blue-300 underline">
              Login
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}