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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

export default function BeneficiariesPage() {
  const [beneficiaries, setBeneficiaries] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const { toast } = useToast();

  const fetchBeneficiaries = React.useCallback(async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      first: "10", // You can adjust this number dynamically
      orderBy: "timestamp_",
      orderDirection: "desc",
    });

    try {
      const response = await fetch(
        `/api/mint/beneficiary-added?${params.toString()}`
      );
      const data = await response.json();
      setBeneficiaries(data.beneficiaryAdded || []);
    } catch (err) {
      setError("Failed to fetch beneficiary data. Please try again.", err);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchBeneficiaries();
  }, [fetchBeneficiaries]);

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
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-blue-600">
              Beneficiary Added
            </CardTitle>
            <CardDescription className="text-gray-500">
              View the added beneficiaries and their associated benefactors.
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Beneficiary Table */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Beneficiary Added History
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
            ) : beneficiaries.length > 0 ? (
              <div className="relative overflow-x-auto rounded-lg border border-gray-200">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Benefactor</TableHead>
                      <TableHead>Beneficiary</TableHead>
                      <TableHead>Transaction Hash</TableHead>
                      <TableHead>Block</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {beneficiaries.map((beneficiary) => (
                      <TableRow key={beneficiary.id}>
                        <TableCell>
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="flex items-center">
                                {formatAddress(beneficiary.benefactor)}
                                <CopyIcon
                                  className="ml-2 h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700"
                                  onClick={() =>
                                    copyToClipboard(beneficiary.benefactor)
                                  }
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              {beneficiary.benefactor}
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="flex items-center">
                                {formatAddress(beneficiary.beneficiary)}
                                <CopyIcon
                                  className="ml-2 h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700"
                                  onClick={() =>
                                    copyToClipboard(beneficiary.beneficiary)
                                  }
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              {beneficiary.beneficiary}
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <a
                            href={`https://etherscan.io/tx/${beneficiary.transactionHash_}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            View
                            <ExternalLinkIcon className="ml-1 h-4 w-4" />
                          </a>
                        </TableCell>
                        <TableCell>{beneficiary.block_number}</TableCell>
                        <TableCell>
                          {new Date(
                            parseInt(beneficiary.timestamp_) * 1000
                          ).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                No beneficiaries found.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
