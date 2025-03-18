"use client";

import React from "react";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthGuardProvider } from "@/context/AuthGuardContext";

const queryClient = new QueryClient();

// export const metadata = {
//   title: "Garage Management System",
//   description: "Manage your garage efficiently with our system.",
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <QueryClientProvider client={queryClient}>
        <body className="bg-gray-100 text-gray-900">
          <AuthGuardProvider>
            <main>{children}</main>
          </AuthGuardProvider>
        </body>
      </QueryClientProvider>
    </html>
  );
}
