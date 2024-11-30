"use client";
import React, { useState } from "react";
import Link from "next/link";
import { FaRocket } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

const menuItems = [
  {
    label: "USDe Token",
    links: [
      { href: "/usde/transfers", text: "Transfers" },
      { href: "/usde/approvals", text: "Approvals" },
      { href: "/usde/ownership-transfers", text: "Ownership Transfers" },
      { href: "/usde/minter-updated", text: "Minter Updates" },
    ],
  },
  {
    label: "sUSDe Token",
    links: [
      { href: "/stake/deposits", text: "Deposits" },
      { href: "/stake/withdraws", text: "Withdrawals" },
      { href: "/stake/rewards-received", text: "Rewards Received" },
    ],
  },
  {
    label: "Mint Token",
    links: [
      { href: "/mint/mints", text: "Mints" },
      { href: "/mint/beneficiary-added", text: "Beneficiary Added" },
      { href: "/mint/benefactor-added", text: "Benefactor Added" },
    ],
  },
];

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

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {menuItems.map((item, index) => (
            <DropdownMenu key={index}>
              <DropdownMenuTrigger asChild>
                <button className="text-lg font-semibold px-4 py-2 rounded-md transition-all duration-200 hover:text-yellow-300 hover:bg-blue-700 hover:shadow-lg">
                  {item.label}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="bg-white text-gray-800 rounded-lg shadow-lg py-2"
              >
                {item.links.map((link) => (
                  <DropdownMenuItem key={link.href}>
                    <Link
                      href={link.href}
                      className="block px-4 py-2 text-sm hover:bg-blue-100 hover:text-blue-800"
                    >
                      {link.text}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden bg-blue-700 px-3 py-2 rounded-md shadow-md focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          Menu
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-900 text-white p-4">
          {menuItems.map((item, index) => (
            <div key={index} className="mb-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-full text-left text-lg font-semibold py-2 border-b border-white hover:text-yellow-300">
                    {item.label}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="bg-white text-gray-800 rounded-lg shadow-lg py-2 mt-1"
                >
                  {item.links.map((link) => (
                    <DropdownMenuItem key={link.href}>
                      <Link
                        href={link.href}
                        className="block px-4 py-2 text-sm hover:bg-blue-100 hover:text-blue-800"
                        onClick={() => setIsMobileMenuOpen(false)} // Close mobile menu on link click
                      >
                        {link.text}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
