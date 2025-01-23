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
      <body className="bg-gray-50 text-gray-800">
        <div className="flex flex-col min-h-screen">
          <Navbar />
          {/* Main Content */}
          <main className="flex-grow">{children}</main>

          <Footer />
        </div>
      </body>
    </html>
  );
}
