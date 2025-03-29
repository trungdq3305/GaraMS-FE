"use client";

import React, { useState, useEffect, FormEvent } from "react";
import Vehicles from "../vehicle/page";
import WarrantyHistory from "../warrantyhistory/page";
import Appointments from "../customerappointment/page";
import useAuthStore from "@/app/login/hooks/useAuthStore";
import {
  User,
  Car,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Lock,
  Edit,
  Check,
  X,
  Package,
} from "lucide-react";
import axiosInstance from "@/dbUtils/axios";
import WarrantyInventoryPage from "../inventorywarranty/page";
import WarrantyPage from "../warranty/page";
// Define interface for Inventory Invoice
interface InventoryInvoice {
  inventoryInvoiceId: number;
  diliverType: string;
  paymentMethod: string;
  totalAmount: number;
  date: string;
  status: string;
  inventoryInvoiceDetails: InventoryInvoiceDetail[];
}

interface InventoryInvoiceDetail {
  inventoryInvoiceDetailId: number;
  inventoryId: number;
  price: number;
  inventory: {
    inventoryId: number;
    name: string;
    description: string;
  };
  quantity: number;
}

const Profile = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const { user, setUser } = useAuthStore();

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
  const [inventoryInvoices, setInventoryInvoices] = useState<
    InventoryInvoice[]
  >([]);
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false);
  const [invoiceError, setInvoiceError] = useState("");
  // Profile edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [profileUpdateMessage, setProfileUpdateMessage] = useState("");
  const [profileUpdateError, setProfileUpdateError] = useState("");
  const processInventoryInvoices = (invoices: InventoryInvoice[]) => {
    return invoices.map((invoice) => {
      const groupedDetails: Record<
        number,
        InventoryInvoiceDetail & { quantity: number }
      > = {};

      invoice.inventoryInvoiceDetails.forEach((detail) => {
        if (groupedDetails[detail.inventoryId]) {
          groupedDetails[detail.inventoryId].quantity += 1;
        } else {
          groupedDetails[detail.inventoryId] = { ...detail, quantity: 1 };
        }
      });

      return {
        ...invoice,
        inventoryInvoiceDetails: Object.values(groupedDetails),
      };
    });
  };
  const fetchInventoryInvoices = async () => {
    try {
      setIsLoadingInvoices(true);
      setInvoiceError("");

      const response = await axiosInstance.get("inventoryinvoices/of-customer");
      setInventoryInvoices(processInventoryInvoices(response.data));
    } catch (error) {
      console.error("Error fetching inventory invoices:", error);
      setInvoiceError("Failed to load inventory invoices");
    } finally {
      setIsLoadingInvoices(false);
    }
  };
  useEffect(() => {
    if (activeTab === "inventoryinvoices") {
      fetchInventoryInvoices();
    }
  }, [activeTab]);
  const handleRequestCode = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");

      await axiosInstance.post("user/request-change-password", {
        email: user?.email,
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
        oldPassword: oldPassword,
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
        setOldPassword("");
        setSuccessMessage("");
      }, 2000);
    } catch (error) {
      setErrorMessage(
        "Failed to change password. Please check your old password and code."
      );
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
    setOldPassword("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  // Handle edit profile functions
  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset to original values
      setEditedUser({
        fullName: user?.fullName || "",
        email: user?.email || "",
        phone: user?.phone || "",
        address: user?.address || "",
      });
    }
    setIsEditing(!isEditing);
    setProfileUpdateMessage("");
    setProfileUpdateError("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setIsLoading(true);
      setProfileUpdateError("");

      // Call API to update user profile
      await axiosInstance.put("user/edit-user", {
        phone: editedUser.phone,
        email: editedUser.email,
        fullName: editedUser.fullName,
        address: editedUser.address,
      });

      // Update local state - properly handling the User type
      if (user) {
        setUser({
          ...user,
          fullName: editedUser.fullName,
          email: editedUser.email,
          phone: editedUser.phone,
          address: editedUser.address,
        });
      }

      setProfileUpdateMessage("Profile updated successfully");
      setIsEditing(false);

      setTimeout(() => {
        setProfileUpdateMessage("");
      }, 3000);
    } catch (error) {
      setProfileUpdateError("Failed to update profile. Please try again.");
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex space-x-4 mb-8">
        {/* Existing tab buttons */}
        <button
          onClick={() => setActiveTab("profile")}
          className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${
            activeTab === "profile"
              ? "bg-blue-500 text-white shadow-md"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          <User size={18} />
          Profile
        </button>
        <button
          onClick={() => setActiveTab("vehicles")}
          className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${
            activeTab === "vehicles"
              ? "bg-blue-500 text-white shadow-md"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          <Car size={18} />
          Vehicles
        </button>
        <button
          onClick={() => setActiveTab("appointments")}
          className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${
            activeTab === "appointments"
              ? "bg-blue-500 text-white shadow-md"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          <Calendar size={18} />
          Appointments
        </button>
        {/* <button
          onClick={() => setActiveTab("warrantyhistory")}
          className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${
            activeTab === "warrantyhistory"
              ? "bg-blue-500 text-white shadow-md"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          <Calendar size={18} />
          Service Warranty
        </button>
        <button
          onClick={() => setActiveTab("warrantyinventory")}
          className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${
            activeTab === "warrantyinventory"
              ? "bg-blue-500 text-white shadow-md"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          <Calendar size={18} />
          Inventory Warranty
        </button> */}
        <button
          onClick={() => setActiveTab("warranty")}
          className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${
            activeTab === "warranty"
              ? "bg-blue-500 text-white shadow-md"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          <Calendar size={18} />
          Warranty
        </button>
        <button
          onClick={() => setActiveTab("inventoryinvoices")}
          className={`px-4 py-2 rounded-md flex items-center gap-2 transition-all ${
            activeTab === "inventoryinvoices"
              ? "bg-blue-500 text-white shadow-md"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          <Package size={18} />
          Inventory Invoices
        </button>
      </div>

      {activeTab === "profile" && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200">
            <h2 className="text-2xl font-bold">Profile Information</h2>
            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors disabled:bg-green-300"
                  >
                    <Check size={18} />
                    Save
                  </button>
                  <button
                    onClick={handleEditToggle}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleEditToggle}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    <Edit size={18} />
                    Edit Profile
                  </button>
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                  >
                    <Lock size={18} />
                    Change Password
                  </button>
                </>
              )}
            </div>
          </div>

          {profileUpdateMessage && (
            <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
              {profileUpdateMessage}
            </div>
          )}

          {profileUpdateError && (
            <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
              {profileUpdateError}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
              <div className="bg-blue-100 p-3 rounded-full">
                <User className="text-blue-500" size={24} />
              </div>
              <div className="flex-grow">
                <p className="text-sm text-gray-500">Full Name</p>
                {isEditing ? (
                  <input
                    type="text"
                    name="fullName"
                    value={editedUser.fullName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                ) : (
                  <p className="font-medium text-lg">
                    {user?.fullName || "Not provided"}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
              <div className="bg-green-100 p-3 rounded-full">
                <Mail className="text-green-500" size={24} />
              </div>
              <div className="flex-grow">
                <p className="text-sm text-gray-500">Email Address</p>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editedUser.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                ) : (
                  <p className="font-medium text-lg">
                    {user?.email || "Not provided"}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg">
              <div className="bg-purple-100 p-3 rounded-full">
                <Phone className="text-purple-500" size={24} />
              </div>
              <div className="flex-grow">
                <p className="text-sm text-gray-500">Phone Number</p>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={editedUser.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                ) : (
                  <p className="font-medium text-lg">
                    {user?.phone || "Not provided"}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-amber-50 rounded-lg">
              <div className="bg-amber-100 p-3 rounded-full">
                <MapPin className="text-amber-500" size={24} />
              </div>
              <div className="flex-grow">
                <p className="text-sm text-gray-500">Address</p>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={editedUser.address}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                ) : (
                  <p className="font-medium text-lg">
                    {user?.address || "Not provided"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "vehicles" && <Vehicles />}
      {activeTab === "appointments" && <Appointments />}
      {/* {activeTab === "warrantyhistory" && <WarrantyHistory />}
      {activeTab === "warrantyinventory" && <WarrantyInventoryPage />} */}
      {activeTab === "warranty" && <WarrantyPage />}
      {/* New Inventory Invoices Tab */}
      {activeTab === "inventoryinvoices" && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Inventory Invoices</h2>

          {isLoadingInvoices ? (
            <div className="text-center text-gray-500">Loading invoices...</div>
          ) : invoiceError ? (
            <div className="text-red-500">{invoiceError}</div>
          ) : inventoryInvoices.length === 0 ? (
            <div className="text-center text-gray-500">
              No inventory invoices found
            </div>
          ) : (
            <div className="space-y-4">
              {inventoryInvoices.map((invoice) => (
                <div
                  key={invoice.inventoryInvoiceId}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-lg">
                      Invoice #{invoice.inventoryInvoiceId}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        invoice.status === "False"
                          ? "bg-green-100 text-green-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {invoice.status === "False" ? "Completed" : "Completed"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>
                      <strong>Date:</strong> {invoice.date}
                    </div>
                    <div>
                      <strong>Delivery Type:</strong> {invoice.diliverType}
                    </div>
                    <div>
                      <strong>Payment Method:</strong> {invoice.paymentMethod}
                    </div>
                    <div>
                      <strong>Total Amount:</strong> $
                      {invoice.totalAmount.toFixed(2)}
                    </div>
                  </div>
                  {invoice.diliverType === "Shipping" && (
  <div className="mt-2 flex items-center text-blue-600">
    🚚 Inventory will diliver to you in 3-5 days
  </div>
)}
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Items:</h4>
                    <ul className="space-y-2">
                      {invoice.inventoryInvoiceDetails.map((detail) => (
                        <li
                          key={detail.inventoryInvoiceDetailId}
                          className="flex justify-between border-b pb-1 last:border-b-0"
                        >
                          <span>{detail.inventory.name}</span>
                          <span className="font-semibold">
                            ${detail.price.toFixed(2)}
                          </span>
                          <td>x {detail.quantity}</td>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
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
                <p className="mb-4">
                  Click the button below to receive a verification code via
                  email.
                </p>
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
