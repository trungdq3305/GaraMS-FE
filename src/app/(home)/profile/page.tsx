"use client";

import React, { useState, FormEvent } from "react";
import Vehicles from "../vehicle/page";
import Appointments from "../customerappointment/page";
import useAuthStore from "@/app/login/hooks/useAuthStore";
import { User, Car, Calendar, Mail, Phone, MapPin, Lock } from "lucide-react";
import axiosInstance from "@/dbUtils/axios";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { user } = useAuthStore();

  // Password change states
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isCodeRequested, setIsCodeRequested] = useState(false);
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState("");

  const handleRequestCode = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      await axiosInstance.post("user/request-change-password", {
        email: user?.email
      });

      setIsCodeRequested(true);
      setSuccessMessage("Verification code sent to your email");
    } catch (error) {
      setErrorMessage("Failed to request code. Please try again.");
      console.error("Error requesting code:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return;
    }

    try {
      setIsLoading(true);

      const response = await axiosInstance.put("user/change-password", {
        oldPassword: oldPassword, // Thêm trường nhập oldPassword vào form
        newPassword: newPassword,
        confirmationCode: code,
      });

      setSuccessMessage("Password changed successfully");
      setTimeout(() => {
        setShowPasswordModal(false);
        setIsCodeRequested(false);
        setCode("");
        setNewPassword("");
        setConfirmPassword("");
        setOldPassword(""); // Reset old password input
        setSuccessMessage("");
      }, 2000);
    } catch (error) {
      setErrorMessage("Failed to change password. Please check your old password and code.");
      console.error("Error changing password:", error);
    } finally {
      setIsLoading(false);
    }
  };


  const closeModal = () => {
    setShowPasswordModal(false);
    setIsCodeRequested(false);
    setCode("");
    setNewPassword("");
    setConfirmPassword("");
    setOldPassword(""); // Reset oldPassword
    setErrorMessage("");
    setSuccessMessage("");
  };


  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${activeTab === "profile"
            ? "bg-blue-500 text-white shadow-md"
            : "bg-gray-200 hover:bg-gray-300"
            }`}
        >
          <User size={18} />
          Profile
        </button>
        <button
          onClick={() => setActiveTab("vehicles")}
          className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${activeTab === "vehicles"
            ? "bg-blue-500 text-white shadow-md"
            : "bg-gray-200 hover:bg-gray-300"
            }`}
        >
          <Car size={18} />
          Vehicles
        </button>
        <button
          onClick={() => setActiveTab("appointments")}
          className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${activeTab === "appointments"
            ? "bg-blue-500 text-white shadow-md"
            : "bg-gray-200 hover:bg-gray-300"
            }`}
        >
          <Calendar size={18} />
          Appointments
        </button>
      </div>

      {activeTab === "profile" && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200">
            <h2 className="text-2xl font-bold">Profile Information</h2>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              <Lock size={18} />
              Change Password
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
              <div className="bg-blue-100 p-3 rounded-full">
                <User className="text-blue-500" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium text-lg">{user?.fullName || "Not provided"}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
              <div className="bg-green-100 p-3 rounded-full">
                <Mail className="text-green-500" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-medium text-lg">{user?.email || "Not provided"}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg">
              <div className="bg-purple-100 p-3 rounded-full">
                <Phone className="text-purple-500" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="font-medium text-lg">{user?.phone || "Not provided"}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-lg">
              <div className="bg-amber-100 p-3 rounded-full">
                <MapPin className="text-amber-500" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium text-lg">{user?.address || "Not provided"}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "vehicles" && <Vehicles />}
      {activeTab === "appointments" && <Appointments />}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Change Password</h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            {!isCodeRequested ? (
              <div>
                <p className="mb-4">Click the button below to receive a verification code via email.</p>
                <button
                  onClick={handleRequestCode}
                  disabled={isLoading}
                  className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                >
                  {isLoading ? "Sending..." : "Request Verification Code"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleChangePassword}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Old Password
                  </label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>

                {errorMessage && (
                  <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                    {errorMessage}
                  </div>
                )}

                {successMessage && (
                  <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
                    {successMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                >
                  {isLoading ? "Processing..." : "Change Password"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;