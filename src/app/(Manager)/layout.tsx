"use client";
import React from "react";

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <main className="container mx-auto p-4">{children}</main>
        </div>
    );
}