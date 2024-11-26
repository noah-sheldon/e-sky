"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Transfers() {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters and Sorting
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    first: 10,
    orderBy: "timestamp_",
    orderDirection: "desc",
  });

  const fetchTransfers = async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      first: filters.first,
      orderBy: filters.orderBy,
      orderDirection: filters.orderDirection,
      ...(filters.from && { from: filters.from }),
      ...(filters.to && { to: filters.to }),
    });

    try {
      const response = await fetch(`/api/transfers?${params.toString()}`);
      const data = await response.json();
      if (response.ok) {
        setTransfers(data);
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransfers();
  }, [filters]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterReset = () => {
    setFilters({
      from: "",
      to: "",
      first: 10,
      orderBy: "timestamp_",
      orderDirection: "desc",
    });
  };

  const formatValue = (value) =>
    parseInt(value).toLocaleString("en-US", { style: "decimal" });

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      {/* Page Title */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-yellow-300 text-2xl">Transfers</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            Explore token transfers on the USDe blockchain. Use filters to
            refine your search and view transaction details.
          </p>
        </CardContent>
      </Card>

      {/* Filters Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* From Address */}
            <div>
              <label htmlFor="from" className="text-sm font-medium">
                From Address
              </label>
              <Input
                id="from"
                name="from"
                placeholder="Enter from address"
                value={filters.from}
                onChange={handleInputChange}
              />
            </div>

            {/* To Address */}
            <div>
              <label htmlFor="to" className="text-sm font-medium">
                To Address
              </label>
              <Input
                id="to"
                name="to"
                placeholder="Enter to address"
                value={filters.to}
                onChange={handleInputChange}
              />
            </div>

            {/* Order Direction */}
            <div>
              <label htmlFor="orderDirection" className="text-sm font-medium">
                Order Direction
              </label>
              <select
                id="orderDirection"
                name="orderDirection"
                value={filters.orderDirection}
                onChange={handleInputChange}
                className="bg-gray-800 text-white px-4 py-2 rounded-md"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>

            {/* Limit */}
            <div>
              <label htmlFor="first" className="text-sm font-medium">
                Number of Results
              </label>
              <Input
                id="first"
                name="first"
                type="number"
                min="1"
                max="100"
                value={filters.first}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <Button
              onClick={fetchTransfers}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Apply Filters
            </Button>
            <Button
              onClick={handleFilterReset}
              className="bg-gray-600 hover:bg-gray-700"
            >
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transfers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Transfers Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-48 w-full" />
          ) : error ? (
            <p className="text-red-500">Error: {error}</p>
          ) : transfers.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Block</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Transaction Hash</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transfers.map((transfer) => (
                    <TableRow key={transfer.id}>
                      <TableCell>{transfer.from}</TableCell>
                      <TableCell>{transfer.to}</TableCell>
                      <TableCell>{formatValue(transfer.value)}</TableCell>
                      <TableCell>{transfer.block_number}</TableCell>
                      <TableCell>
                        {new Date(
                          parseInt(transfer.timestamp_) * 1000
                        ).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <a
                          href={`https://etherscan.io/tx/${transfer.transactionHash_}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          View
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-gray-400">No transfers found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
