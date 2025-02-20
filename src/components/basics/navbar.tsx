"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Default to false

  return (
    <nav className="bg-gray-800 shadow-md shadow-black/5 w-full flex relative justify-between items-center mx-auto md:px-7 h-20 z-50">
      <div className="hidden md:block">
        <Link href="/" className="inline-block py-2 px-3 hover:bg-gray-600 rounded-full font-semibold">
          <div className="flex items-center relative cursor-pointer whitespace-nowrap text-white">Home</div>
        </Link>
        <Link href="/vehicles" className="inline-block py-2 px-3 hover:bg-gray-600 rounded-full font-semibold">
          <div className="flex items-center relative cursor-pointer whitespace-nowrap text-white">Vehicles</div>
        </Link>
        <Link href="#" className="inline-block py-2 px-3 hover:bg-gray-600 rounded-full font-semibold">
          <div className="flex items-center relative cursor-pointer whitespace-nowrap text-white">News</div>
        </Link>
        <Link href="#" className="inline-block py-2 px-3 hover:bg-gray-600 rounded-full font-semibold">
          <div className="flex items-center relative cursor-pointer whitespace-nowrap text-white">About Us</div>
        </Link>
        <Link href="/term" className="inline-block py-2 px-3 hover:bg-gray-600 rounded-full font-semibold">
          <div className="flex items-center relative cursor-pointer whitespace-nowrap text-white">Term And Policy</div>
        </Link>

      </div>

      <Link href="/" className="flex items-center py-3 border-b border-b-gray-400 text-sm md:text-2xl md:mr-32">
        <h2 className="text-4xl  font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">G A R A M S</h2>
      </Link>

      <div className="flex-initial">
        <div className="flex justify-end items-center relative">
          {isAuthenticated ? (
            <div className="flex mr-4 mt-1">
              <div className="flex   items-center">
              </div>
              <div className="inline relative">

              </div>
            </div>
          ) : (
            <div className="flex space-x-4 mt-4">
              <Link
                href="/login"
                className="px-6 py-3 text-white bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 rounded-lg font-semibold tracking-wide transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 border border-gray-700"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-6 py-3 text-white bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 rounded-lg font-semibold tracking-wide transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 border border-purple-700"
              >
                Sign Up
              </Link>
            </div>

          )}
        </div>
      </div>
    </nav>
  );
}
