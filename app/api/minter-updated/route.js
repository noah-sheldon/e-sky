import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

// Create Apollo Client
const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_USDE_MAINNET_SUBGRAPH_URI, // Subgraph URI from .env
  cache: new InMemoryCache(),
});

// GraphQL query for MinterUpdated events
const MINTER_UPDATED_QUERY = gql`
  query GetMinterUpdates(
    $first: Int
    $orderBy: MinterUpdated_orderBy
    $orderDirection: OrderDirection
    $where: MinterUpdated_filter
  ) {
    minterUpdateds(
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      id
      block_number
      timestamp_
      transactionHash_
      contractId_
      newMinter
      oldMinter
    }
  }
`;

export async function GET(request) {
  const url = new URL(request.url);

  // Extract query parameters
  const first = parseInt(url.searchParams.get("first") || 10); // Default: fetch 10 results
  const orderBy = url.searchParams.get("orderBy") || "timestamp_"; // Default: order by timestamp
  const orderDirection = url.searchParams.get("orderDirection") || "desc"; // Default: descending order
  const newMinter = url.searchParams.get("newMinter"); // Filter by new minter address
  const oldMinter = url.searchParams.get("oldMinter"); // Filter by old minter address

  // Build filters for GraphQL query
  const filters = {};
  if (newMinter) filters.newMinter = newMinter;
  if (oldMinter) filters.oldMinter = oldMinter;

  try {
    // Fetch data using Apollo Client
    const { data } = await client.query({
      query: MINTER_UPDATED_QUERY,
      variables: { first, orderBy, orderDirection, where: filters },
    });

    // Return the MinterUpdated events as JSON
    return new Response(JSON.stringify(data.minterUpdateds), { status: 200 });
  } catch (error) {
    // Handle errors
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
