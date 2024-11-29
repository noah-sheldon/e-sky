import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

// Initialize Apollo Client
const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_USDE_MAINNET_SUBGRAPH_URI,
  cache: new InMemoryCache(),
});

// GraphQL Queries to Fetch Data
const APPROVALS_QUERY = gql`
  query GetLatestApprovals(
    $first: Int
    $orderBy: Approval_orderBy
    $orderDirection: OrderDirection
  ) {
    approvals(
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      block_number
      timestamp_
      transactionHash_
      contractId_
      owner
      spender
      value
    }
  }
`;

const TRANSFERS_QUERY = gql`
  query GetTopTransfers(
    $first: Int
    $orderBy: Transfer_orderBy
    $orderDirection: OrderDirection
  ) {
    transfers(
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      block_number
      timestamp_
      transactionHash_
      contractId_
      from
      to
      value
    }
  }
`;

export async function GET(request) {
  const url = new URL(request.url);

  const first = parseInt(url.searchParams.get("first") || 10);
  const orderBy = url.searchParams.get("orderBy") || "timestamp_";
  const orderDirection = url.searchParams.get("orderDirection") || "desc";

  try {
    // Fetch latest 10 approvals (sorted by timestamp_)
    const approvalData = await client.query({
      query: APPROVALS_QUERY,
      variables: {
        first,
        orderBy: orderBy, // Sorting approvals by timestamp
        orderDirection: orderDirection, // Descending order for the latest approvals
      },
    });

    // Fetch top 10 transfers (sorted by value)
    const transferData = await client.query({
      query: TRANSFERS_QUERY,
      variables: {
        first,
        orderBy: orderBy, // Sorting transfers by value (descending)
        orderDirection: orderDirection, // Descending order for the highest value transfers
      },
    });

    // Convert Wei to Ether (1 ETH = 10^18 Wei)
    const weiToEth = (wei) => (parseFloat(wei) / 1e18).toFixed(18);

    // Convert value from Wei to Ether for approvals and transfers
    const latestApprovals = approvalData.data.approvals.map((approval) => ({
      ...approval,
      value: weiToEth(approval.value), // Convert Wei to Ether
    }));

    const topTransfers = transferData.data.transfers.map((transfer) => ({
      ...transfer,
      value: weiToEth(transfer.value), // Convert Wei to Ether
    }));

    return new Response(
      JSON.stringify({
        latestApprovals, // Last 10 approvals sorted by timestamp
        topTransfers, // Top 10 transfers sorted by timestamp
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
