"use client";

import * as React from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ExternalLinkIcon,
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
  };

  React.useEffect(() => {
    fetchTransfers();
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950 text-white">
      <div className="mx-auto max-w-7xl space-y-8 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-gray-800 bg-gray-900/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-3xl font-bold tracking-tight text-yellow-300">
                Transfers Explorer
              </CardTitle>
              <CardDescription className="text-gray-400">
                Explore token transfers on the USDe blockchain. Use filters to
                refine your search and view transaction details.
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="border-gray-800 bg-gray-900/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <label
                    htmlFor="from"
                    className="text-sm font-medium text-gray-300"
                  >
                    From Address
                  </label>
                  <Input
                    id="from"
                    placeholder="0x..."
                    value={filters.from}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, from: e.target.value }))
                    }
                    className="border-gray-800 bg-gray-800/50"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="to"
                    className="text-sm font-medium text-gray-300"
                  >
                    To Address
                  </label>
                  <Input
                    id="to"
                    placeholder="0x..."
                    value={filters.to}
                    onChange={(e) =>
                      setFilters((prev) => ({ ...prev, to: e.target.value }))
                    }
                    className="border-gray-800 bg-gray-800/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Order Direction
                  </label>
                  <Select
                    value={filters.orderDirection}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, orderDirection: value }))
                    }
                  >
                    <SelectTrigger className="border-gray-800 bg-gray-800/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="desc">
                        <span className="flex items-center gap-2">
                          <ArrowDownIcon className="h-4 w-4" />
                          Descending
                        </span>
                      </SelectItem>
                      <SelectItem value="asc">
                        <span className="flex items-center gap-2">
                          <ArrowUpIcon className="h-4 w-4" />
                          Ascending
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Results Limit
                  </label>
                  <Select
                    value={filters.first}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, first: value }))
                    }
                  >
                    <SelectTrigger className="border-gray-800 bg-gray-800/50">
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
              </div>

              <div className="mt-6 flex flex-wrap gap-4">
                <Button
                  onClick={fetchTransfers}
                  className="bg-blue-600 hover:bg-blue-700"
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
                  className="border-gray-700 hover:bg-gray-800"
                >
                  Reset Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-gray-800 bg-gray-900/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Transfer History
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full bg-gray-800" />
                  <Skeleton className="h-12 w-full bg-gray-800" />
                  <Skeleton className="h-12 w-full bg-gray-800" />
                </div>
              ) : error ? (
                <div className="rounded-lg bg-red-500/10 p-4 text-red-400">
                  <p>Error: {error}</p>
                </div>
              ) : transfers.length > 0 ? (
                <div className="relative overflow-x-auto rounded-lg border border-gray-800">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-800 hover:bg-gray-800/50">
                        <TableHead className="text-gray-300">From</TableHead>
                        <TableHead className="text-gray-300">To</TableHead>
                        <TableHead className="text-gray-300">Value</TableHead>
                        <TableHead className="text-gray-300">Block</TableHead>
                        <TableHead className="text-gray-300">
                          Timestamp
                        </TableHead>
                        <TableHead className="text-right text-gray-300">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transfers.map((transfer) => (
                        <TableRow
                          key={transfer.id}
                          className="border-gray-800 hover:bg-gray-800/50"
                        >
                          <TableCell className="font-mono text-sm">
                            {formatAddress(transfer.from)}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {formatAddress(transfer.to)}
                          </TableCell>
                          <TableCell>{formatValue(transfer.value)}</TableCell>
                          <TableCell>{transfer.block_number}</TableCell>
                          <TableCell>
                            {new Date(
                              parseInt(transfer.timestamp_) * 1000
                            ).toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <a
                              href={`https://etherscan.io/tx/${transfer.transactionHash_}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300"
                            >
                              View
                              <ExternalLinkIcon className="h-4 w-4" />
                            </a>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="rounded-lg bg-gray-800/50 p-8 text-center">
                  <p className="text-gray-400">
                    No transfers found matching your criteria.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
