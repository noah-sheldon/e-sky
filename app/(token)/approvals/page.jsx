"use client";

import * as React from "react";
import { ExternalLinkIcon, CopyIcon } from "lucide-react";
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
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { convertWeiToEth } from "@/lib/utils";

export default function ApprovalsPage() {
  const [approvals, setApprovals] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // Filters and Sorting
  const [filters, setFilters] = React.useState({
    owner: "",
    spender: "",
    first: "10",
    orderBy: "timestamp_",
    orderDirection: "desc",
    minValue: "",
    maxValue: "",
  });

  const fetchApprovals = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      first: filters.first,
      orderBy: filters.orderBy,
      orderDirection: filters.orderDirection,
      ...(filters.owner && { owner: filters.owner }),
      ...(filters.spender && { spender: filters.spender }),
      ...(filters.minValue && { minValue: filters.minValue }),
      ...(filters.maxValue && { maxValue: filters.maxValue }),
    });

    try {
      const response = await fetch(`/api/token/approvals?${params.toString()}`);
      const data = await response.json();
      if (response.ok) {
        setApprovals(data);
      } else {
        setError(data.error || "Failed to fetch approvals");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  React.useEffect(() => {
    fetchApprovals();
  }, [fetchApprovals]);

  const handleFilterReset = () => {
    setFilters({
      owner: "",
      spender: "",
      first: "10",
      orderBy: "timestamp_",
      orderDirection: "desc",
      minValue: "",
      maxValue: "",
    });
  };

  const formatValue = (value) =>
    parseInt(value).toLocaleString("en-US", { style: "decimal" });

  const formatAddress = (address) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  const { toast } = useToast();

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `Address ${text} copied to clipboard.`,
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <div className="mx-auto max-w-7xl space-y-8 p-6">
        {/* Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-blue-600">
                Approvals Explorer
              </CardTitle>
              <CardDescription>
                Explore approval events on the blockchain. Use filters to refine
                your search and view approval details.
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
                  id="owner"
                  placeholder="Owner Address"
                  value={filters.owner}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, owner: e.target.value }))
                  }
                  className="border-gray-300"
                />
                <Input
                  id="spender"
                  placeholder="Spender Address"
                  value={filters.spender}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      spender: e.target.value,
                    }))
                  }
                  className="border-gray-300"
                />
                <Input
                  id="minValue"
                  placeholder="Min Value"
                  value={filters.minValue}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      minValue: e.target.value,
                    }))
                  }
                  className="border-gray-300"
                />
                <Input
                  id="maxValue"
                  placeholder="Max Value"
                  value={filters.maxValue}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      maxValue: e.target.value,
                    }))
                  }
                  className="border-gray-300"
                />
              </div>
              <div className="mt-6 flex flex-wrap gap-4">
                <Button
                  onClick={fetchApprovals}
                  className="bg-blue-500 text-white hover:bg-blue-600"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Apply Filters"}
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

        {/* Approval Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Approval History
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
              ) : approvals.length > 0 ? (
                <Table className="text-sm">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Owner</TableHead>
                      <TableHead>Spender</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Block</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvals.map((approval) => (
                      <TableRow key={approval.id}>
                        <TableCell>
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="flex items-center">
                                {formatAddress(approval.owner)}
                                <CopyIcon
                                  className="ml-2 h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700"
                                  onClick={() =>
                                    copyToClipboard(approval.owner)
                                  }
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{approval.owner}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="flex items-center">
                                {formatAddress(approval.spender)}
                                <CopyIcon
                                  className="ml-2 h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700"
                                  onClick={() =>
                                    copyToClipboard(approval.spender)
                                  }
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{approval.spender}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                        <TableCell>{convertWeiToEth(approval.value)}</TableCell>
                        <TableCell>{approval.block_number}</TableCell>
                        <TableCell>
                          {new Date(
                            parseInt(approval.timestamp_) * 1000
                          ).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <a
                            href={`https://etherscan.io/tx/${approval.transactionHash_}`}
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
                  No approvals found.
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
