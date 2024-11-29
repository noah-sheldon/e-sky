"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableHeader,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { FiTrendingUp, FiUser, FiDatabase } from "react-icons/fi";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Utility function to format large numbers
const formatToEth = (value) =>
  (value / 1e18).toLocaleString("en-US", { maximumFractionDigits: 2 });

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/stake/stats");
        const result = await response.json();
        if (response.ok) {
          setData(result);
        } else {
          setError(result.error || "Failed to fetch data");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <SkeletonDashboard />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-4xl font-bold text-blue-400">Staking Dashboard</h1>
        <p className="text-gray-300">
          Overview of staking protocol metrics and user activity
        </p>
      </header>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Deposits"
          value={data.protocolMetrics.totalDeposits}
          icon={<FiDatabase />}
        />
        <MetricCard
          title="Total Withdrawals"
          value={data.protocolMetrics.totalWithdrawals}
          icon={<FiTrendingUp />}
        />
        <MetricCard
          title="Net Staked"
          value={data.protocolMetrics.netStaked}
          icon={<FiDatabase />}
        />
        <MetricCard
          title="Total Rewards"
          value={data.protocolMetrics.totalRewards}
          icon={<FiUser />}
        />
      </div>

      {/* Top Stakers Table */}
      <section className="mt-8">
        <Card className="shadow-lg bg-gray-800">
          <CardHeader>
            <CardTitle className="text-blue-400">Top Stakers</CardTitle>
            <CardDescription className="text-gray-400">
              Displaying the top stakers and their assets.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table className="mt-4 font-mono text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead>Owner</TableHead>
                  <TableHead>Assets (ETH)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.topStakers.map((staker, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <AddressWithCopyTooltip address={staker.owner} />
                    </TableCell>
                    <TableCell className="text-right">
                      {staker.assets}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      {/* Top Approvals Table */}
      {/* <section className="mt-8">
        <Card className="shadow-lg bg-gray-800">
          <CardHeader>
            <CardTitle className="text-blue-400">Top Approvals</CardTitle>
            <CardDescription className="text-gray-400">
              Displaying the top token approvals and values.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table className="mt-4 font-mono text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead>Spender</TableHead>
                  <TableHead>Value (ETH)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.approvalsMetrics.mostApprovedSpenders.map(
                  (spender, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <AddressWithCopyTooltip address={spender.spender} />
                      </TableCell>
                      <TableCell className="text-right">
                        {formatToEth(spender.value)}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section> */}

      {/* Transfers Table */}
      <section className="mt-8">
        <Card className="shadow-lg bg-gray-800">
          <CardHeader>
            <CardTitle className="text-blue-400">Top Transfers</CardTitle>
            <CardDescription className="text-gray-400">
              Displaying the top token transfer addresses and counts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table className="mt-4 font-mono text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead>Address</TableHead>
                  <TableHead>Transfer Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.transfersMetrics.topTransferAddresses.map(
                  (transfer, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <AddressWithCopyTooltip address={transfer.address} />
                      </TableCell>
                      <TableCell className="text-right">
                        {transfer.count}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ title, value, icon }) => (
  <Card className="flex items-center p-6 shadow-lg bg-gray-800">
    <div className="text-2xl text-blue-400">{icon}</div>
    <div className="ml-4">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="text-xl font-bold text-yellow-400">{value} ETH</p>
    </div>
  </Card>
);

// Address With Copy Tooltip Component
const AddressWithCopyTooltip = ({ address }) => {
  const { toast } = useToast();

  if (!address || address === "N/A") return "N/A";

  return (
    <div className="flex items-center">
      {/* Copy Icon */}
      <button
        onClick={() => {
          navigator.clipboard.writeText(address);
          toast({
            title: "Copied!",
            description: `Address ${address} copied to clipboard.`,
            duration: 3000,
          });
        }}
        className="mr-2 text-blue-400 hover:text-blue-600"
      >
        <Copy size={16} />
      </button>
      {/* Tooltip for Address */}
      <Tooltip>
        <TooltipTrigger>{`${address.slice(0, 6)}...${address.slice(
          -4
        )}`}</TooltipTrigger>
        <TooltipContent>
          <span>{address}</span>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

// Skeleton Loader
const SkeletonDashboard = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {Array.from({ length: 4 }).map((_, i) => (
      <Skeleton key={i} className="h-32 w-full rounded-md" />
    ))}
    <Skeleton className="h-48 w-full col-span-2 rounded-md" />
    <Skeleton className="h-48 w-full col-span-2 rounded-md" />
  </div>
);

export default Dashboard;
