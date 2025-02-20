import React from "react";
import "./globals.css";
import Footer from "@/components/basics/footer"
import Navbar from "@/components/basics/navbar";

export const metadata = {
  title: "Garage Management System",
  description: "Manage your garage efficiently with our system.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <main>{children}</main>
      </body>
    </html >
  );
}
