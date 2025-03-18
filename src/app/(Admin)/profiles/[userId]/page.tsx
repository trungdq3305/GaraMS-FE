"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input, Button, message } from "antd";
import useAuthStore from "@/app/login/hooks/useAuthStore";

const ProfilePage = () => {
  const { user, setUser } = useAuthStore();
  const { userId } = useParams();
  const router = useRouter();

  const [profile, setProfile] = useState({
    name: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  useEffect(() => {
    if (!user || user.userId.toString() !== userId) {
      message.error("You don't have permission to access this page");
      router.replace("/");
    }
  }, [user, userId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async () => {
    try {
      const updatedUser = {
        ...user,
        ...profile,
        userId: user?.userId ?? 0,
        role: user?.role ?? 0,
        status: user?.status ?? false,
        address: user?.address ?? "",
        createdAt: user?.createdAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setUser(updatedUser);
      message.success("Cập nhật hồ sơ thành công!");
    } catch {
      message.error("Cập nhật thất bại. Vui lòng thử lại!");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold mb-4">Profile Information</h2>

      <div className="flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 bg-gray-500 text-white flex items-center justify-center rounded-full text-xl">
          {profile.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-lg font-semibold">{profile.name}</p>
          <p className="text-sm text-gray-600">
            Role:{" "}
            {user?.role === 4 ? "Admin" : user?.role === 3 ? "Manager" : "User"}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-700">Full Name</label>
          <Input name="name" value={profile.name} onChange={handleChange} />
        </div>

        <div>
          <label className="block text-gray-700">Email</label>
          <Input name="email" value={profile.email} onChange={handleChange} />
        </div>

        <div>
          <label className="block text-gray-700">Phone number</label>
          <Input name="phone" value={profile.phone} onChange={handleChange} />
        </div>

        <div>
          <label className="block text-gray-700">Address</label>
          <Input
            name="address"
            value={profile.address}
            onChange={handleChange}
          />
        </div>

        <Button type="primary" onClick={handleUpdateProfile}>
          Save changes
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;
