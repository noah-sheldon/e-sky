import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

// Create Apollo Client
const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_USDE_MAINNET_SUBGRAPH_URI, // Your subgraph URI from .env
  cache: new InMemoryCache(),
});

// GraphQL query for fetching Approval data
const APPROVAL_QUERY = gql`
  query GetApprovals(
    $first: Int
    $orderBy: Approval_orderBy
    $orderDirection: OrderDirection
    $where: Approval_filter
  ) {
    approvals(
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
      owner
      spender
      value
    }
  }
`;

// Handler for GET requests
export async function GET(request) {
  const url = new URL(request.url);

  // Extract query parameters
  const first = parseInt(url.searchParams.get("first") || 10); // Default: fetch 10 results
  const orderBy = url.searchParams.get("orderBy") || "timestamp_"; // Default: order by timestamp
  const orderDirection = url.searchParams.get("orderDirection") || "desc"; // Default: descending order
  const owner = url.searchParams.get("owner"); // Filter by owner address
  const spender = url.searchParams.get("spender"); // Filter by spender address
  const minValue = url.searchParams.get("minValue"); // Filter by minimum approval value
  const maxValue = url.searchParams.get("maxValue"); // Filter by maximum approval value

  // Build the filter object for GraphQL
  const filters = {};
  if (owner) filters.owner = owner;
  if (spender) filters.spender = spender;
  if (minValue) filters.value_gte = minValue; // Greater than or equal to minValue
  if (maxValue) filters.value_lte = maxValue; // Less than or equal to maxValue

  try {
    // Execute the GraphQL query
    const { data } = await client.query({
      query: APPROVAL_QUERY,
      variables: { first, orderBy, orderDirection, where: filters },
    });

    // Return the approvals as JSON
    return new Response(JSON.stringify(data.approvals), { status: 200 });
  } catch (error) {
    // Handle errors
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
