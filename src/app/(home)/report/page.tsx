"use client";

import React, { useState } from "react";
import { createReport } from "@/dbUtils/ManagerAPIs/reportservice";

const ReportPage = () => {
  const [formData, setFormData] = useState({
    problem: "",
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const reportData = {
        ...formData,
        customerId: 1,
      };

      const response = await createReport(reportData);
      if (response.isSuccess) {
        setMessage("Report created successfully!");
        setFormData({ problem: "", title: "", description: "" });
      } else {
        setMessage("Failed to create report.");
      }
    } catch (error) {
      setMessage("Error creating report.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-3xl font-bold text-center mb-6">
        Report Information
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Problem</label>
          <input
            type="text"
            name="problem"
            value={formData.problem}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-lg h-28"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg text-lg hover:bg-blue-700 transition disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Report"}
        </button>
        {message && (
          <p className="text-center mt-4 text-green-600">{message}</p>
        )}
      </form>
    </div>
  );
};

export default ReportPage;
