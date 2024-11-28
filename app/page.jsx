"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function Home() {
  const [dataSummary, setDataSummary] = useState({
    transfers: 0,
    approvals: 0,
    ownershipTransfers: 0,
    minterUpdateds: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/token/stats");
        const result = await response.json();
        if (result.success) {
          setDataSummary(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatStat = (value) => (value >= 100 ? "100+" : value);

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-800 via-blue-600 to-blue-500 text-center py-16 px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
          Explore <span className="text-yellow-300">USDe</span> Insights
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Real-time blockchain statistics and updates for the USDe token.
        </p>
        <Link href="/dashboard">
          <button className="bg-yellow-300 text-gray-900 px-6 py-3 rounded-md text-lg font-semibold hover:bg-yellow-400 transition duration-300">
            Explore Dashboard
          </button>
        </Link>
      </div>

      {/* Summary Section */}
      <div className="container mx-auto py-16 px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          USDe Token Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-48 w-full bg-gray-800" />
            ))
          ) : error ? (
            <p className="text-red-500 text-center">Error: {error}</p>
          ) : (
            <>
              {/* Transfers */}
              <Card className="bg-gray-800 hover:scale-105 transition-transform duration-300">
                <CardHeader>
                  <CardTitle className="text-yellow-300 text-xl">
                    Token Transfers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">
                    {formatStat(dataSummary.transfers)}
                  </p>
                  <Link href="/transfers">
                    <button className="mt-4 text-blue-400 hover:underline">
                      View Transfers
                    </button>
                  </Link>
                </CardContent>
              </Card>

              {/* Approvals */}
              <Card className="bg-gray-800 hover:scale-105 transition-transform duration-300">
                <CardHeader>
                  <CardTitle className="text-yellow-300 text-xl">
                    Approvals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">
                    {formatStat(dataSummary.approvals)}
                  </p>
                  <Link href="/approvals">
                    <button className="mt-4 text-blue-400 hover:underline">
                      View Approvals
                    </button>
                  </Link>
                </CardContent>
              </Card>

              {/* Ownership Transfers */}
              <Card className="bg-gray-800 hover:scale-105 transition-transform duration-300">
                <CardHeader>
                  <CardTitle className="text-yellow-300 text-xl">
                    Ownership Transfers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">
                    {formatStat(dataSummary.ownershipTransfers)}
                  </p>
                  <Link href="/ownership-transfers">
                    <button className="mt-4 text-blue-400 hover:underline">
                      View Ownership
                    </button>
                  </Link>
                </CardContent>
              </Card>

              {/* Minter Updates */}
              <Card className="bg-gray-800 hover:scale-105 transition-transform duration-300">
                <CardHeader>
                  <CardTitle className="text-yellow-300 text-xl">
                    Minter Updates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold">
                    {formatStat(dataSummary.minterUpdateds)}
                  </p>
                  <Link href="/minter-updated">
                    <button className="mt-4 text-blue-400 hover:underline">
                      View Updates
                    </button>
                  </Link>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
