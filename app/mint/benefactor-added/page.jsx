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

export default function BenefactorAddedPage() {
  const [benefactorAddeds, setBenefactorAddeds] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [filters, setFilters] = React.useState({
    benefactor: "",
    first: "10",
    orderBy: "timestamp_",
    orderDirection: "desc",
  });
  const { toast } = useToast();

  const fetchBenefactorAddeds = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      first: filters.first,
      orderBy: filters.orderBy,
      orderDirection: filters.orderDirection,
      ...(filters.benefactor && { benefactor: filters.benefactor }),
    });

    try {
      const response = await fetch(
        `/api/mint/benefactor-added?${params.toString()}`
      );
      const data = await response.json();

      // Ensure we handle the response structure correctly
      const benefactorAddedData = data.benefactorAdded || []; // Update this line as per the actual response structure
      setBenefactorAddeds(benefactorAddedData);
    } catch (err) {
      setError(
        "Failed to fetch benefactor added events. Please try again.",
        err
      );
    } finally {
      setLoading(false);
    }
  }, [filters]);

  React.useEffect(() => {
    fetchBenefactorAddeds();
  }, [fetchBenefactorAddeds]);

  const handleFilterReset = () => {
    setFilters({
      benefactor: "",
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
                Benefactor Added Events
              </CardTitle>
              <CardDescription className="text-gray-500">
                View and filter events where a benefactor was added.
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
                  id="benefactor"
                  placeholder="Benefactor Address"
                  value={filters.benefactor}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      benefactor: e.target.value,
                    }))
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
                  onClick={fetchBenefactorAddeds}
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

        {/* Benefactor Added Events Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Benefactor Added History
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
              ) : benefactorAddeds.length > 0 ? (
                <div className="relative overflow-x-auto rounded-lg border border-gray-200">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Block Number</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Transaction Hash</TableHead>
                        <TableHead>Benefactor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {benefactorAddeds.map((event) => (
                        <TableRow key={event.id}>
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
                              <ExternalLinkIcon className="ml-1 h-4 w-4" />
                            </a>
                          </TableCell>
                          <TableCell>
                            <Tooltip>
                              <TooltipTrigger>
                                <div className="flex items-center">
                                  {formatAddress(event.benefactor)}
                                  <CopyIcon
                                    className="ml-2 h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700"
                                    onClick={() =>
                                      copyToClipboard(event.benefactor)
                                    }
                                  />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <span>Copy address</span>
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div>No events found.</div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
