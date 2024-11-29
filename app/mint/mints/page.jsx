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
import { convertWeiToEth } from "@/lib/utils";

export default function MintsPage() {
  const [mints, setMints] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [filters, setFilters] = React.useState({
    minter: "",
    first: "10",
    orderBy: "timestamp_",
    orderDirection: "desc",
  });
  const { toast } = useToast();

  const fetchMints = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      first: filters.first,
      orderBy: filters.orderBy,
      orderDirection: filters.orderDirection,
      ...(filters.minter && { minter: filters.minter }),
    });

    try {
      const response = await fetch(`/api/mint/mints?${params.toString()}`);
      const data = await response.json();
      setMints(data.mints);
    } catch (err) {
      setError("Failed to fetch mints. Please try again.", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  React.useEffect(() => {
    fetchMints();
  }, [fetchMints]);

  const handleFilterReset = () => {
    setFilters({
      minter: "",
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-blue-600">
                Mints
              </CardTitle>
              <CardDescription className="text-gray-500">
                View and filter mint transactions.
              </CardDescription>
            </CardHeader>
          </Card>
        </motion.div>

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
                  id="minter"
                  placeholder="Minter Address"
                  value={filters.minter}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, minter: e.target.value }))
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
                    <SelectValue>{filters.first} results</SelectValue>
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
                  onClick={fetchMints}
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Mint History
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
              ) : mints.length > 0 ? (
                <div className="relative overflow-x-auto rounded-lg border border-gray-200">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Minter</TableHead>
                        <TableHead>Benefactor</TableHead>
                        <TableHead>Beneficiary</TableHead>
                        <TableHead>Collateral Asset</TableHead>
                        <TableHead>Collateral Amount</TableHead>
                        <TableHead>USDe Amount</TableHead>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mints.map((mint) => (
                        <TableRow key={mint.id}>
                          <TableCell>
                            <Tooltip>
                              <TooltipTrigger>
                                <div className="flex items-center">
                                  {formatAddress(mint.minter)}
                                  <CopyIcon
                                    className="ml-2 h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700"
                                    onClick={() => copyToClipboard(mint.minter)}
                                  />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>{mint.minter}</TooltipContent>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Tooltip>
                              <TooltipTrigger>
                                <div className="flex items-center">
                                  {formatAddress(mint.benefactor)}
                                  <CopyIcon
                                    className="ml-2 h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700"
                                    onClick={() =>
                                      copyToClipboard(mint.benefactor)
                                    }
                                  />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>{mint.benefactor}</TooltipContent>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Tooltip>
                              <TooltipTrigger>
                                <div className="flex items-center">
                                  {formatAddress(mint.beneficiary)}
                                  <CopyIcon
                                    className="ml-2 h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700"
                                    onClick={() =>
                                      copyToClipboard(mint.beneficiary)
                                    }
                                  />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                {mint.beneficiary}
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                          <TableCell>{mint.collateral_asset}</TableCell>
                          <TableCell>
                            {parseInt(
                              convertWeiToEth(mint.collateral_amount)
                            ).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {parseInt(
                              convertWeiToEth(mint.usde_amount)
                            ).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {new Date(
                              parseInt(mint.timestamp_) * 1000
                            ).toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <Tooltip>
                              <TooltipTrigger>
                                <a
                                  href={`https://etherscan.io/tx/${mint.transactionHash_}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLinkIcon className="h-4 w-4 text-blue-500" />
                                </a>
                              </TooltipTrigger>
                              <TooltipContent>View on Etherscan</TooltipContent>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div>No mints found.</div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
