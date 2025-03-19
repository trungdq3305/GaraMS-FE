import React from "react";
import "../globals.css";
import Footer from "@/components/basics/footer";
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
    <div>
      <Navbar></Navbar>
      <main >
        {children}
      </main>
      <Footer></Footer>
    </div>
  );
}
