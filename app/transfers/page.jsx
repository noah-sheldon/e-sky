"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function Transfers() {
  const [transfers, setTransfers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  // Filters and Sorting
  const [filters, setFilters] = React.useState({
    from: "",
    to: "",
    first: 10,
    orderBy: "timestamp_",
    orderDirection: "desc",
  });

  const fetchTransfers = async () => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      first: filters.first.toString(),
      orderBy: filters.orderBy,
      orderDirection: filters.orderDirection,
      ...(filters.from && { from: filters.from }),
      ...(filters.to && { to: filters.to }),
    });

    try {
      const response = await fetch(`/api/transfers?${params.toString()}`);
      const data = await response.json();
      if (response.ok) {
        setTransfers(data);
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTransfers();
  }, [filters]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterReset = () => {
    setFilters({
      from: "",
      to: "",
      first: 10,
      orderBy: "timestamp_",
      orderDirection: "desc",
    });
  };

  const formatValue = (value) =>
    parseInt(value).toLocaleString("en-US", { style: "decimal" });

  const FiltersContent = () => (
    <div className="space-y-4">
      <div>
        <label htmlFor="from" className="text-sm font-medium text-gray-300">
          From Address
        </label>
        <Input
          id="from"
          name="from"
          placeholder="Enter from address"
          value={filters.from}
          onChange={handleInputChange}
          className="mt-2"
        />
      </div>

      <div>
        <label htmlFor="to" className="text-sm font-medium text-gray-300">
          To Address
        </label>
        <Input
          id="to"
          name="to"
          placeholder="Enter to address"
          value={filters.to}
          onChange={handleInputChange}
          className="mt-2"
        />
      </div>

      <div>
        <label
          htmlFor="orderDirection"
          className="text-sm font-medium text-gray-300"
        >
          Order Direction
        </label>
        <select
          id="orderDirection"
          name="orderDirection"
          value={filters.orderDirection}
          onChange={handleInputChange}
          className="mt-2 w-full bg-gray-800 text-white px-4 py-2 rounded-md"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>

      <div>
        <label htmlFor="first" className="text-sm font-medium text-gray-300">
          Number of Results
        </label>
        <Input
          id="first"
          name="first"
          type="number"
          min="1"
          max="100"
          value={filters.first}
          onChange={handleInputChange}
          className="mt-2"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Button
          onClick={() => {
            fetchTransfers();
            setOpen(false);
          }}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Apply Filters
        </Button>
        <Button
          onClick={() => {
            handleFilterReset();
            setOpen(false);
          }}
          className="w-full bg-gray-600 hover:bg-gray-700"
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-900 text-white min-h-screen p-6">
      <div className="max-w-[1400px] mx-auto">
        {/* Single Card for Content */}
        <Card>
          <CardHeader>
            <CardTitle className="text-yellow-300 text-2xl flex items-center gap-4">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="shrink-0">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle filters</span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-[300px] bg-gray-900 border-gray-800"
                >
                  <SheetHeader>
                    <SheetTitle className="text-white">Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FiltersContent />
                  </div>
                </SheetContent>
              </Sheet>
              Transfers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-6">
              Explore token transfers on the USDe blockchain. Use filters to
              refine your search and view transaction details.
            </p>

            {/* Transfers Table */}
            {loading ? (
              <Skeleton className="h-48 w-full" />
            ) : error ? (
              <p className="text-red-500">Error: {error}</p>
            ) : transfers.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>From</TableHead>
                      <TableHead>To</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Block</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Transaction Hash</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transfers.map((transfer) => (
                      <TableRow key={transfer.id}>
                        <TableCell>{transfer.from}</TableCell>
                        <TableCell>{transfer.to}</TableCell>
                        <TableCell>{formatValue(transfer.value)}</TableCell>
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
                            className="text-blue-400 hover:underline"
                          >
                            View
                          </a>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-gray-400">No transfers found.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
