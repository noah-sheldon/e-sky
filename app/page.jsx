"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  Copy,
  Database,
  LineChart,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

// Utility function to format large numbers as ETH with commas
const formatToEth = (value) => new Intl.NumberFormat("en-US").format(value);

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);

// Utility function to calculate percentage change
const getPercentageChange = (current, previous) => {
  if (!previous) return 0;
  return ((current - previous) / previous) * 100;
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tokenData, setTokenData] = useState(null);
  const [priceData, setPriceData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/stake/stats");
        const result = await response.json();
        if (!response.ok)
          throw new Error(result.error || "Failed to fetch data");
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 1800000); // Refresh data every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        const response = await fetch("/api/token/stats");
        const result = await response.json();
        if (!response.ok)
          throw new Error(result.error || "Failed to fetch token data");
        setTokenData(result);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTokenData();
    const interval = setInterval(fetchTokenData, 30000); // Refresh data every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        const response = await fetch("/api/price");
        const result = await response.json();
        if (!response.ok)
          throw new Error(result.error || "Failed to fetch data");
        setPriceData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPriceData();
    const interval = setInterval(fetchPriceData, 30000); // Refresh data every 30 seconds
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  if (loading || !data || !tokenData || !priceData) {
    return (
      <div className="p-6 space-y-8 max-w-[1400px] mx-auto">
        {/* Header Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-1/3 mx-auto md:mx-0" />
          <Skeleton className="h-6 w-2/3 mx-auto md:mx-0" />
        </div>

        {/* Metrics Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-32 w-full rounded-lg" />
          ))}
        </div>

        {/* Top Stakers Table Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-8 w-full rounded-lg" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        </div>

        {/* Transfers Table Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-8 w-full rounded-lg" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-destructive">
              Error Loading Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const metrics = [
    {
      title: "Total Deposits",
      value: data.protocolMetrics.totalDeposits,
      icon: Database,
      change: getPercentageChange(
        data.protocolMetrics.totalDeposits,
        data.protocolMetrics.previousTotalDeposits
      ),
    },
    {
      title: "Total Withdrawals",
      value: data.protocolMetrics.totalWithdrawals,
      icon: TrendingUp,
      change: getPercentageChange(
        data.protocolMetrics.totalWithdrawals,
        data.protocolMetrics.previousTotalWithdrawals
      ),
    },
    {
      title: "Net Staked",
      value: data.protocolMetrics.netStaked,
      icon: LineChart,
      change: getPercentageChange(
        data.protocolMetrics.netStaked,
        data.protocolMetrics.previousNetStaked
      ),
    },
    {
      title: "Total Rewards",
      value: data.protocolMetrics.totalRewards,
      icon: Users,
      change: getPercentageChange(
        data.protocolMetrics.totalRewards,
        data.protocolMetrics.previousTotalRewards
      ),
    },
    {
      title: "Active Users",
      value: data.uniqueActiveUsers, // Directly use uniqueActiveUsers
      icon: Users,
      change: null, // No percentage change for active users
    },
  ];

  return (
    <div className="p-6 space-y-8 max-w-[1400px] mx-auto">
      {/* Header Section */}
      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 text-center"
      >
        <h1 className="text-4xl font-bold tracking-tight">
          Ethena USDe Dashboard
        </h1>
        <p className="text-muted-foreground">
          Real-time metrics and analytics for Ethena USDe token.
        </p>
      </motion.div> */}

      {/* USDe Metrics Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <Card className="relative overflow-hidden">
          <CardHeader className="space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Price</CardTitle>
            <div className="text-2xl font-bold">
              {formatCurrency(priceData.price)} USD
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Last Updated:{" "}
              {new Date(priceData.last_updated).toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Cap</CardTitle>
            <div className="text-2xl font-bold">
              {formatCurrency(priceData.market_cap)}
            </div>
          </CardHeader>
          <CardContent>
            <Progress
              value={priceData.percent_change_24h}
              className="h-1 mt-2"
            />
            <p className="text-sm">
              24h Change:{" "}
              <span
                className={
                  priceData.percent_change_24h >= 0
                    ? "text-emerald-500"
                    : "text-red-500"
                }
              >
                {priceData.percent_change_24h.toFixed(2)}%
              </span>
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
            <div className="text-2xl font-bold">
              {formatCurrency(priceData.volume_24h)}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Total Supply: {priceData.total_supply.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              Circulating Supply:{" "}
              {priceData.circulating_supply.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform</CardTitle>
            <div className="text-xl font-bold">{priceData.platform}</div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Token Address:</p>
            <AddressWithCopyTooltip address={priceData.token_address} />
          </CardContent>
        </Card>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        {/* <h1 className="text-4xl font-bold tracking-tight">sUSDe Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time overview of staking protocol metrics and user activity
        </p> */}
      </motion.div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden">
              <CardHeader className="space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <metric.icon className="w-4 h-4 text-muted-foreground" />
                  {metric.change !== null && (
                    <CardDescription>
                      {metric.change > 0 ? (
                        <span className="text-emerald-500 flex items-center">
                          <ArrowUp className="w-4 h-4 mr-1" />
                          {metric.change.toFixed(2)}%
                        </span>
                      ) : (
                        <span className="text-red-500 flex items-center">
                          <ArrowDown className="w-4 h-4 mr-1" />
                          {Math.abs(metric.change).toFixed(2)}%
                        </span>
                      )}
                    </CardDescription>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metric.title === "Active Users"
                    ? metric.value.toLocaleString() // Display raw count for Active Users
                    : `${formatToEth(metric.value)} ETH`}
                </div>
                {metric.change !== null && (
                  <Progress value={50 + metric.change} className="h-1 mt-2" />
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Top Stakers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Stakers</CardTitle>
          <CardDescription>
            Highest value stakers in the protocol
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Owner</TableHead>
                <TableHead className="text-right">Assets (ETH)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.topStakers.map((staker, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <AddressWithCopyTooltip address={staker.owner} />
                  </TableCell>
                  <TableCell className="text-right">
                    {formatToEth(staker.assets)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Latest Approvals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Latest Approvals</CardTitle>
          <CardDescription>Latest approval transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Owner</TableHead>
                <TableHead>Value (ETH)</TableHead>
                <TableHead>Spender</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Transaction Hash</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tokenData.latestApprovals.map((approval, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <AddressWithCopyTooltip address={approval.owner} />
                  </TableCell>
                  <TableCell className="text-right">
                    {formatToEth(approval.value)}
                  </TableCell>
                  <TableCell>
                    <AddressWithCopyTooltip address={approval.spender} />
                  </TableCell>
                  <TableCell>
                    {/* Display timestamp in a readable format */}
                    {new Date(approval.timestamp_ * 1000).toLocaleString()}{" "}
                    {/* Assuming timestamp_ is in Unix time */}
                  </TableCell>
                  <TableCell>
                    <a
                      href={`https://etherscan.io/tx/${approval.transactionHash_}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {approval.transactionHash_.slice(0, 8)}...
                      {approval.transactionHash_.slice(-6)}
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Top Transfers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Transfers</CardTitle>
          <CardDescription>
            Biggest transfer values in the protocol
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Owner</TableHead>
                <TableHead>Transfer Value</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Transaction Hash</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tokenData.topTransfers.map((transfer, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <AddressWithCopyTooltip address={transfer.from} />
                  </TableCell>
                  <TableCell className="text-right">
                    {formatToEth(transfer.value)}
                  </TableCell>
                  <TableCell>
                    <AddressWithCopyTooltip address={transfer.to} />
                  </TableCell>
                  <TableCell>
                    {/* Display timestamp in a readable format */}
                    {new Date(transfer.timestamp_ * 1000).toLocaleString()}{" "}
                    {/* Assuming timestamp_ is in Unix time */}
                  </TableCell>
                  <TableCell>
                    <a
                      href={`https://etherscan.io/tx/${transfer.transactionHash_}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {transfer.transactionHash_.slice(0, 8)}...
                      {transfer.transactionHash_.slice(-6)}
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Transfers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transfers</CardTitle>
          <CardDescription>Latest token transfer activity</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Address</TableHead>
                <TableHead>Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.transfersMetrics.topTransferAddresses.map(
                (transfer, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <AddressWithCopyTooltip address={transfer.address} />
                    </TableCell>
                    <TableCell>{transfer.count}</TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

const AddressWithCopyTooltip = ({ address }) => {
  const { toast } = useToast();

  if (!address || address === "N/A") return "N/A";

  return (
    <div className="flex items-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            onClick={() => {
              navigator.clipboard.writeText(address);
              toast({
                description: `Address ${address} copied to clipboard.`,
              });
            }}
            className="flex items-center hover:text-primary cursor-pointer"
          >
            {address.slice(0, 6)}...{address.slice(-4)}
            <Copy className="w-4 h-4 ml-1" />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{address}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default Dashboard;
