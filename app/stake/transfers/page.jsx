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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { convertWeiToEth } from "@/lib/utils"; // Utility function for handling assets conversion if needed.

export default function TransfersPage() {
  const [transfers, setTransfers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [filters, setFilters] = React.useState({
    from: "",
    to: "",
    first: "10",
    orderBy: "timestamp_",
    orderDirection: "desc",
  });
  const { toast } = useToast();

  const fetchTransfers = React.useCallback(async () => {
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
      const response = await fetch(`/api/stake/transfers?${params.toString()}`);
      const data = await response.json();
      setTransfers(data);
    } catch (err) {
      setError("Failed to fetch transfers. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  React.useEffect(() => {
    fetchTransfers();
  }, [fetchTransfers]);

  const handleFilterReset = () => {
    setFilters({
      from: "",
      to: "",
      first: "10",
      orderBy: "timestamp_",
      orderDirection: "desc",
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
                Transfers
              </CardTitle>
              <CardDescription className="text-gray-500">
                View and filter transfer transactions for token movements.
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
                  id="from"
                  placeholder="From Address"
                  value={filters.from}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, from: e.target.value }))
                  }
                  className="border-gray-300"
                />
                <Input
                  id="to"
                  placeholder="To Address"
                  value={filters.to}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, to: e.target.value }))
                  }
                  className="border-gray-300"
                />
                <Select
                  value={filters.first}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, first: parseInt(value) }))
                  }
                >
                  <SelectTrigger className="border-gray-300">
                    <SelectValue>
                      {filters.first} results {/* Display the selected value */}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {[10, 25, 50, 100].map((value) => (
                      <SelectItem key={value} value={value.toString()}>
                        {value} results
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-6 flex flex-wrap gap-4">
                <Button
                  onClick={fetchTransfers}
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

        {/* Transfers Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Transfer History
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
              ) : transfers.length > 0 ? (
                <div className="relative overflow-x-auto rounded-lg border border-gray-200">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>From</TableHead>
                        <TableHead>To</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Block</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transfers.map((transfer) => (
                        <TableRow key={transfer.id}>
                          <TableCell>
                            <Tooltip>
                              <TooltipTrigger>
                                <div className="flex items-center">
                                  {formatAddress(transfer.from)}
                                  <CopyIcon
                                    className="ml-2 h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700"
                                    onClick={() =>
                                      copyToClipboard(transfer.from)
                                    }
                                  />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>{transfer.from}</TooltipContent>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Tooltip>
                              <TooltipTrigger>
                                <div className="flex items-center">
                                  {formatAddress(transfer.to)}
                                  <CopyIcon
                                    className="ml-2 h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700"
                                    onClick={() => copyToClipboard(transfer.to)}
                                  />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>{transfer.to}</TooltipContent>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            {parseInt(transfer.value).toLocaleString()}
                          </TableCell>
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
                  No transfer transactions found.
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
