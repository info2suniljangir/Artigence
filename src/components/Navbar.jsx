"use client";

import Image from "next/image";
import React from "react";
import { ubuntu } from "@/library/font";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md py-4 px-6 w-full border-b border-gray-100">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo + Company Name */}
        <div className="flex items-center gap-3">
          <Image
            src="/logo.jpeg" // make sure this file exists in your /public folder
            alt="Artigence Logo"
            width={40}
            height={40}
            className="rounded-sm"
          />
          <span className={`text-3xl font-bold tracking-tight drop-shadow-sm ${ubuntu.className}`} style={{ color: "#0074c1" }}>
            Artigence
          </span>
        </div>

        {/* Navigation Links */}
        <div className="flex gap-8 items-center text-gray-700 text-lg font-medium">
          <span className=" transition-colors duration-200 cursor-pointer custom-hover">
            Messages
          </span>
          <span className=" transition-colors duration-200 cursor-pointer custom-hover">
            User
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
