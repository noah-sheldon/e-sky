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

// Utility function to calculate percentage change
const getPercentageChange = (current, previous) => {
  if (!previous) return 0;
  return ((current - previous) / previous) * 100;
};

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
    const interval = setInterval(fetchData, 30000); // Refresh data every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading) {
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-4xl font-bold tracking-tight">Staking Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time overview of staking protocol metrics and user activity
        </p>
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
                  <TableCell className="text-right font-mono">
                    {formatToEth(staker.assets)}
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
                <TableHead className="text-right">Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.transfersMetrics.topTransferAddresses.map(
                (transfer, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <AddressWithCopyTooltip address={transfer.address} />
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {transfer.count}
                    </TableCell>
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
          <p className="font-mono text-xs">{address}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default Dashboard;
