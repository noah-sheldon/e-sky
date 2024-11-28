import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import { NextResponse } from "next/server";

// Initialize Apollo Client
const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_USDE_MAINNET_SUBGRAPH_URI,
  cache: new InMemoryCache(),
});

// GraphQL Query with Correct Filter Syntax
const GET_STATS_LAST_MONTH_QUERY = gql`
  query GetOverviewDataLastMonth($timestamp_gt: BigInt!) {
    approvals(where: { timestamp__gt: $timestamp_gt }) {
      id
    }
    transfers(where: { timestamp__gt: $timestamp_gt }) {
      id
    }
    ownershipTransferreds(where: { timestamp__gt: $timestamp_gt }) {
      id
    }
    minterUpdateds(where: { timestamp__gt: $timestamp_gt }) {
      id
    }
  }
`;

export async function GET() {
  // Calculate timestamp for the last 30 days
  const thirtyDaysAgo = Math.floor(Date.now() / 1000) - 30 * 24 * 60 * 60;

  try {
    // Fetch data from the GraphQL API
    const { data } = await client.query({
      query: GET_STATS_LAST_MONTH_QUERY,
      variables: { timestamp_gt: thirtyDaysAgo },
    });

    // Calculate counts from the response
    const stats = {
      approvals: data.approvals.length || 0,
      transfers: data.transfers.length || 0,
      ownershipTransfers: data.ownershipTransferreds.length || 0,
      minterUpdateds: data.minterUpdateds.length || 0,
    };

    // Return the stats as JSON
    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    // Log and return errors
    console.error("GraphQL Error:", error.message);
    return NextResponse.json({ success: false, error: error.message });
  }
}
