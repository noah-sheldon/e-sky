"use client";

import * as React from "react";
import {
  ExternalLinkIcon,
  CopyIcon,
  ArrowDownIcon,
  ArrowUpIcon,
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
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

export default function OwnershipTransferredPage() {
  const [events, setEvents] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const { toast } = useToast();

  // Filters and Sorting
  const [filters, setFilters] = React.useState({
    previousOwner: "",
    newOwner: "",
    first: "10",
    orderBy: "timestamp_",
    orderDirection: "desc",
  });

  const fetchOwnershipTransfers = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      first: filters.first,
      orderBy: filters.orderBy,
      orderDirection: filters.orderDirection,
      ...(filters.previousOwner && { previousOwner: filters.previousOwner }),
      ...(filters.newOwner && { newOwner: filters.newOwner }),
    });

    try {
      const response = await fetch(
        `/api/token/ownership-transfers?${params.toString()}`
      );
      const data = await response.json();
      if (response.ok) {
        setEvents(data);
      } else {
        setError(data.error || "Failed to fetch OwnershipTransferred events");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  React.useEffect(() => {
    fetchOwnershipTransfers();
  }, [fetchOwnershipTransfers]);

  const handleFilterReset = () => {
    setFilters({
      previousOwner: "",
      newOwner: "",
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
      title: "Copied to Clipboard",
      description: text,
      variant: "default",
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="mx-auto max-w-7xl space-y-8 p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-blue-600">
                Ownership Transfers
              </CardTitle>
              <CardDescription>
                Explore ownership transfer events on the blockchain. Use filters
                to refine your search and view event details.
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
              <CardTitle className="text-xl font-semibold">Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Input
                  id="previousOwner"
                  placeholder="Previous Owner Address"
                  value={filters.previousOwner}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      previousOwner: e.target.value,
                    }))
                  }
                  className="border-gray-300"
                />
                <Input
                  id="newOwner"
                  placeholder="New Owner Address"
                  value={filters.newOwner}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      newOwner: e.target.value,
                    }))
                  }
                  className="border-gray-300"
                />
                <Select
                  value={filters.orderDirection}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      orderDirection: value,
                    }))
                  }
                >
                  <SelectTrigger className="border-gray-300">
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
                <Select
                  value={filters.first}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      first: value,
                    }))
                  }
                >
                  <SelectTrigger className="border-gray-300">
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
                  onClick={fetchOwnershipTransfers}
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

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Ownership Transfer History
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
                <div className="text-red-500">{error}</div>
              ) : events.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Previous Owner</TableHead>
                      <TableHead>New Owner</TableHead>
                      <TableHead>Block</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="flex items-center">
                                {formatAddress(event.previousOwner)}
                                <CopyIcon
                                  className="ml-2 h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700"
                                  onClick={() =>
                                    copyToClipboard(event.previousOwner)
                                  }
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{event.previousOwner}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="flex items-center">
                                {formatAddress(event.newOwner)}
                                <CopyIcon
                                  className="ml-2 h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700"
                                  onClick={() =>
                                    copyToClipboard(event.newOwner)
                                  }
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{event.newOwner}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                        <TableCell>{event.block_number}</TableCell>
                        <TableCell>
                          {new Date(
                            parseInt(event.timestamp_) * 1000
                          ).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <a
                            href={`https://etherscan.io/tx/${event.transactionHash_}`}
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
                  No OwnershipTransferred events found.
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
