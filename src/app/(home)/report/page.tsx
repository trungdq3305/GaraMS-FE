"use client";

import React, { useState } from "react";

const ReportPage = () => {
  const [formData, setFormData] = useState({
    problem: "",
    title: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Data report", formData);

    setFormData({ problem: "", title: "", description: "" });
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
          className="w-full bg-blue-600 text-white py-2 rounded-lg text-lg hover:bg-blue-700 transition"
        >
          Send report
        </button>
      </form>
    </div>
  );
};

export default ReportPage;
