"use client";

import * as React from "react";
import {
  ExternalLinkIcon,
  CopyIcon,
  RefreshCwIcon as ReloadIcon,
} from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { convertWeiToEth } from "@/lib/utils";

export default function DepositsPage() {
  const [deposits, setDeposits] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const { toast } = useToast();

  // Filters and Sorting
  const [filters, setFilters] = React.useState({
    sender: "",
    owner: "",
    first: "10",
    orderBy: "timestamp_",
    orderDirection: "desc",
    minAssets: "",
    maxAssets: "",
  });

  const fetchDeposits = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      first: filters.first,
      orderBy: filters.orderBy,
      orderDirection: filters.orderDirection,
      ...(filters.sender && { sender: filters.sender }),
      ...(filters.owner && { owner: filters.owner }),
      ...(filters.minAssets && { minAssets: filters.minAssets }),
      ...(filters.maxAssets && { maxAssets: filters.maxAssets }),
    });

    try {
      const response = await fetch(`/api/stake/deposits?${params.toString()}`);
      const data = await response.json();
      setDeposits(data);
    } catch (err) {
      setError("Failed to fetch deposits. Please try again.", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  React.useEffect(() => {
    fetchDeposits();
  }, [fetchDeposits]);

  const handleFilterReset = () => {
    setFilters({
      sender: "",
      owner: "",
      first: "10",
      orderBy: "timestamp_",
      orderDirection: "desc",
      minAssets: "",
      maxAssets: "",
    });
  };

  const formatAddress = (address) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `Address ${text} copied to clipboard.`,
      status: "success",
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
                Deposits
              </CardTitle>
              <CardDescription className="text-gray-500">
                View the latest deposit transactions on the staking platform.
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
                <Input
                  id="sender"
                  placeholder="Sender Address"
                  value={filters.sender}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, sender: e.target.value }))
                  }
                  className="border-gray-300"
                />
                <Input
                  id="owner"
                  placeholder="Owner Address"
                  value={filters.owner}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, owner: e.target.value }))
                  }
                  className="border-gray-300"
                />
                <Input
                  id="minAssets"
                  placeholder="Min Assets"
                  value={filters.minAssets}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      minAssets: e.target.value,
                    }))
                  }
                  className="border-gray-300"
                />
                <Input
                  id="maxAssets"
                  placeholder="Max Assets"
                  value={filters.maxAssets}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      maxAssets: e.target.value,
                    }))
                  }
                  className="border-gray-300"
                />
              </div>
              <div className="mt-6 flex flex-wrap gap-4">
                <Button
                  onClick={fetchDeposits}
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

        {/* Deposit Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Deposit History
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
              ) : deposits.length > 0 ? (
                <div className="relative overflow-x-auto rounded-lg border border-gray-200">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Sender</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Assets</TableHead>
                        <TableHead>Shares</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {deposits.map((deposit) => (
                        <TableRow key={deposit.id}>
                          <TableCell>
                            <Tooltip>
                              <TooltipTrigger>
                                <div className="flex items-center">
                                  {formatAddress(deposit.sender)}
                                  <CopyIcon
                                    className="ml-2 h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700"
                                    onClick={() =>
                                      copyToClipboard(deposit.sender)
                                    }
                                  />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{deposit.sender}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Tooltip>
                              <TooltipTrigger>
                                <div className="flex items-center">
                                  {formatAddress(deposit.owner)}
                                  <CopyIcon
                                    className="ml-2 h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700"
                                    onClick={() =>
                                      copyToClipboard(deposit.owner)
                                    }
                                  />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{deposit.owner}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            {parseInt(
                              convertWeiToEth(deposit.assets)
                            ).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {parseInt(
                              convertWeiToEth(deposit.shares)
                            ).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {new Date(
                              parseInt(deposit.timestamp_) * 1000
                            ).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <a
                              href={`https://etherscan.io/tx/${deposit.transactionHash_}`}
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
                  No deposit transactions found.
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
