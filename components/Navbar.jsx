"use client";
import React, { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@radix-ui/react-navigation-menu";
import Link from "next/link";
import { FaRocket } from "react-icons/fa";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="bg-gradient-to-r from-blue-800 via-blue-600 to-blue-500 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto py-4 flex items-center justify-between">
        {/* Logo (Left-Aligned) */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <FaRocket className="w-8 h-8 text-white drop-shadow-lg" />
            <span className="text-2xl md:text-3xl font-bold tracking-wide text-yellow-300">
              e-sky
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Menu (Centered) */}
        <NavigationMenu className="hidden md:flex justify-center flex-grow">
          <NavigationMenuList className="flex gap-8">
            {/* Dashboard */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="relative group">
                <Link
                  href="/dashboard"
                  className="text-lg font-semibold px-4 py-2 rounded-md transition-all duration-200 group-hover:text-blue-100 group-hover:bg-blue-700 group-hover:shadow-lg"
                >
                  Dashboard
                </Link>
              </NavigationMenuTrigger>
            </NavigationMenuItem>

            {/* USDe Mainnet Dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger className="relative group">
                <span className="text-lg font-semibold px-4 py-2 rounded-md transition-all duration-200 group-hover:text-blue-100 group-hover:bg-blue-700 group-hover:shadow-lg cursor-pointer">
                  USDe Mainnet
                </span>
              </NavigationMenuTrigger>
              <NavigationMenuContent className="absolute mt-2 bg-white text-gray-800 rounded-lg shadow-lg p-4 w-64">
                <ul className="flex flex-col gap-3">
                  <li>
                    <Link
                      href="/transfers"
                      className="text-base font-medium text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      Transfers
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/approvals"
                      className="text-base font-medium text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      Approvals
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/ownership-transfers"
                      className="text-base font-medium text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      Ownership Transfers
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/minter-updated"
                      className="text-base font-medium text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      Minter Updates
                    </Link>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center">
          <button
            className="text-white bg-blue-700 px-3 py-2 rounded-md shadow-md focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            Menu
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-900 text-white p-4">
          <NavigationMenu className="flex flex-col gap-4">
            <NavigationMenuList className="flex flex-col gap-6">
              {/* Dashboard */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-lg font-medium hover:text-blue-400">
                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </NavigationMenuTrigger>
              </NavigationMenuItem>

              {/* USDe Mainnet Dropdown */}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-lg font-medium hover:text-blue-400">
                  USDe Mainnet
                </NavigationMenuTrigger>
                <NavigationMenuContent className="mt-2 bg-white text-gray-800 rounded-lg shadow-lg p-4">
                  <ul className="flex flex-col gap-3">
                    <li>
                      <Link
                        href="/transfers"
                        className="text-base font-medium text-gray-900 hover:text-blue-600"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Transfers
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/approvals"
                        className="text-base font-medium text-gray-900 hover:text-blue-600"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Approvals
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/ownership-transfers"
                        className="text-base font-medium text-gray-900 hover:text-blue-600"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Ownership Transfers
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/minter-updated"
                        className="text-base font-medium text-gray-900 hover:text-blue-600"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Minter Updates
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      )}
    </div>
  );
}
