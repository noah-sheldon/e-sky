"use client";

import * as React from "react";
import { ExternalLinkIcon, RefreshCwIcon as ReloadIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { convertWeiToEth } from "@/lib/utils";

export default function RewardsReceivedPage() {
  const [rewards, setRewards] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [filters, setFilters] = React.useState({
    first: "10",
    orderBy: "timestamp_",
    orderDirection: "desc",
  });

  const fetchRewards = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      first: filters.first,
      orderBy: filters.orderBy,
      orderDirection: filters.orderDirection,
    });

    try {
      const response = await fetch(
        `/api/stake/rewards-received?${params.toString()}`
      );
      const data = await response.json();
      setRewards(data);
    } catch (err) {
      setError("Failed to fetch rewards. Please try again.", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  React.useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  const handleFilterReset = () => {
    setFilters({
      first: "10",
      orderBy: "timestamp_",
      orderDirection: "desc",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50 text-gray-800">
      <div className="mx-auto max-w-7xl space-y-8 p-6">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-blue-600">
                Rewards Received
              </CardTitle>
              <CardDescription className="text-gray-500">
                View and filter rewards received events on the staking platform.
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Select
                  value={filters.first.toString()}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, first: parseInt(value) }))
                  }
                >
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Select Limit" />
                  </SelectTrigger>
                  <SelectContent>
                    {[10, 25, 50, 100].map((value) => (
                      <SelectItem key={value} value={value.toString()}>
                        {value} results
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={filters.orderDirection}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, orderDirection: value }))
                  }
                >
                  <SelectTrigger className="border-gray-300">
                    <SelectValue placeholder="Order Direction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Descending</SelectItem>
                    <SelectItem value="asc">Ascending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-6 flex flex-wrap gap-4">
                <Button
                  onClick={fetchRewards}
                  className="bg-blue-500 text-white hover:bg-blue-600"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Apply Filters"
                  )}
                </Button>
                <Button
                  onClick={handleFilterReset}
                  variant="outline"
                  className="border-gray-300 hover:bg-gray-100"
                >
                  Reset Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Rewards Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Rewards History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full bg-gray-200" />
                  <Skeleton className="h-12 w-full bg-gray-200" />
                  <Skeleton className="h-12 w-full bg-gray-200" />
                </div>
              ) : error ? (
                <div className="text-red-500">{error}</div>
              ) : rewards.length > 0 ? (
                <div className="relative overflow-x-auto rounded-lg border border-gray-200">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Amount</TableHead>
                        <TableHead>Block</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rewards.map((reward) => (
                        <TableRow key={reward.id}>
                          <TableCell>
                            {parseInt(
                              convertWeiToEth(reward.amount)
                            ).toLocaleString("en-US")}
                          </TableCell>
                          <TableCell>{reward.block_number}</TableCell>
                          <TableCell>
                            {new Date(
                              parseInt(reward.timestamp_) * 1000
                            ).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <a
                              href={`https://etherscan.io/tx/${reward.transactionHash_}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline"
                            >
                              View
                              <ExternalLinkIcon className="ml-1 h-4 w-4" />
                            </a>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  No rewards transactions found.
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
