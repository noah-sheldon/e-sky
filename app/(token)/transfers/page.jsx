"use client";

import * as React from "react";
import {
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { convertWeiToEth } from "@/lib/utils";

export default function TransfersPage() {
  const [transfers, setTransfers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // Filters and Sorting
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
      const response = await fetch(`/api/token/transfers?${params.toString()}`);
      const data = await response.json();
      if (response.ok) {
        setTransfers(data);
      } else {
        setError(data.error || "Failed to fetch transfers");
      }
    } catch (err) {
      setError(err.message);
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

  const formatValue = (value) =>
    parseInt(value).toLocaleString("en-US", { style: "decimal" });

  const formatAddress = (address) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `Address ${text} copied to clipboard.`,
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <div className="mx-auto max-w-7xl space-y-8 p-6">
        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-blue-600">
                Transfers Explorer
              </CardTitle>
              <CardDescription>
                Explore token transfers on the USDe blockchain. Use filters to
                refine your search and view transaction details.
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
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Filters</CardTitle>
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
                />
                <Input
                  id="to"
                  placeholder="To Address"
                  value={filters.to}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, to: e.target.value }))
                  }
                />
                <Select
                  value={filters.orderDirection}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, orderDirection: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">Descending</SelectItem>
                    <SelectItem value="asc">Ascending</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={filters.first}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, first: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
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
                  className="bg-blue-600 text-white hover:bg-blue-700"
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
                <Button onClick={handleFilterReset} variant="outline">
                  Reset Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Transfer Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Transfer History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : error ? (
                <div className="rounded-lg bg-red-500/10 p-4 text-red-400">
                  <p>Error: {error}</p>
                </div>
              ) : transfers.length > 0 ? (
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
                                  onClick={() => copyToClipboard(transfer.from)}
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{transfer.from}</p>
                            </TooltipContent>
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
                            <TooltipContent>
                              <p>{transfer.to}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          {formatValue(convertWeiToEth(transfer.value))}
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
                          </a>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center text-gray-500">
                  No transfers found.
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
