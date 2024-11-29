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
      <div className="container mx-auto py-4 flex items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <FaRocket className="w-8 h-8 text-white drop-shadow-lg" />
            <span className="text-2xl md:text-3xl font-bold tracking-wide text-yellow-300">
              e-sky
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Menu */}
        <NavigationMenu className="hidden md:flex justify-end flex-grow">
          <NavigationMenuList className="flex gap-8">
            {/* USDe Token Dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <Link href="/usde">
                  <span className="text-lg font-semibold px-4 py-2 rounded-md transition-all duration-200 hover:text-yellow-300 hover:bg-blue-700 hover:shadow-lg cursor-pointer">
                    USDe Token
                  </span>
                </Link>
              </NavigationMenuTrigger>
              <NavigationMenuContent className="absolute mt-2 bg-white text-gray-800 rounded-lg shadow-lg p-4 w-64">
                <ul className="flex flex-col gap-3">
                  <li>
                    <Link
                      href="/usde/transfers"
                      className="text-base font-medium text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      Transfers
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/usde/approvals"
                      className="text-base font-medium text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      Approvals
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/usde/ownership-transfers"
                      className="text-base font-medium text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      Ownership Transfers
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/usde/minter-updated"
                      className="text-base font-medium text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      Minter Updates
                    </Link>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            {/* sUSDe Token Dropdown */}
            <NavigationMenuItem>
              <NavigationMenuTrigger asChild>
                <Link
                  href="/stake"
                  className="text-lg font-semibold px-4 py-2 rounded-md transition-all duration-200 hover:text-yellow-300 hover:bg-blue-700 hover:shadow-lg cursor-pointer"
                >
                  sUSDe Token
                </Link>
              </NavigationMenuTrigger>
              <NavigationMenuContent className="absolute mt-2 bg-white text-gray-800 rounded-lg shadow-lg p-4 w-64">
                <ul className="flex flex-col gap-3">
                  <li>
                    <Link
                      href="/stake/deposits"
                      className="text-base font-medium text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      Deposits
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/stake/withdraws"
                      className="text-base font-medium text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      Withdrawals
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/stake/rewards-received"
                      className="text-base font-medium text-gray-900 hover:text-blue-600 transition-colors"
                    >
                      Rewards Received
                    </Link>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden bg-blue-700 px-3 py-2 rounded-md shadow-md focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          Menu
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-900 text-white p-4 shadow-lg">
          <NavigationMenu className="flex flex-col gap-4">
            <NavigationMenuList className="flex flex-col gap-6">
              {/* USDe Token */}
              <NavigationMenuItem>
                <NavigationMenuTrigger asChild>
                  <Link
                    href="/usde"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-medium hover:text-yellow-300 cursor-pointer transition-all"
                  >
                    USDe Token
                  </Link>
                </NavigationMenuTrigger>
                <NavigationMenuContent className="mt-2">
                  <ul className="flex flex-col gap-3 pl-4">
                    <li>
                      <Link
                        href="/usde/transfers"
                        className="text-base font-medium hover:text-yellow-300 cursor-pointer transition-all"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Transfers
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/usde/approvals"
                        className="text-base font-medium hover:text-yellow-300 cursor-pointer transition-all"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Approvals
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/usde/ownership-transfers"
                        className="text-base font-medium hover:text-yellow-300 cursor-pointer transition-all"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Ownership Transfers
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/usde/minter-updated"
                        className="text-base font-medium hover:text-yellow-300 cursor-pointer transition-all"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Minter Updates
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* sUSDe Token */}
              <NavigationMenuItem>
                <NavigationMenuTrigger asChild>
                  <Link
                    href="/stake"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-medium hover:text-yellow-300 cursor-pointer transition-all"
                  >
                    sUSDe Token
                  </Link>
                </NavigationMenuTrigger>
                <NavigationMenuContent className="mt-2">
                  <ul className="flex flex-col gap-3 pl-4">
                    <li>
                      <Link
                        href="/stake/deposits"
                        className="text-base font-medium hover:text-yellow-300 cursor-pointer transition-all"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Deposits
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/stake/withdraws"
                        className="text-base font-medium hover:text-yellow-300 cursor-pointer transition-all"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Withdrawals
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/stake/rewards-received"
                        className="text-base font-medium hover:text-yellow-300 cursor-pointer transition-all"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Rewards Received
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
