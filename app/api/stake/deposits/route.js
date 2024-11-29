import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

// Initialize Apollo Client
const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_USDE_STAKE_SUBGRAPH_URI,
  cache: new InMemoryCache(),
});

// GraphQL Query for Deposits
const DEPOSIT_QUERY = gql`
  query GetDeposits(
    $first: Int
    $orderBy: Deposit_orderBy
    $orderDirection: OrderDirection
    $where: Deposit_filter
  ) {
    deposits(
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
      sender
      owner
      assets
      shares
    }
  }
`;

export async function GET(request) {
  const url = new URL(request.url);

  // Extract query parameters
  const first = parseInt(url.searchParams.get("first") || 10);
  const orderBy = url.searchParams.get("orderBy") || "timestamp_";
  const orderDirection = url.searchParams.get("orderDirection") || "desc";
  const sender = url.searchParams.get("sender");
  const owner = url.searchParams.get("owner");
  const contractId_ = url.searchParams.get("contractId_");

  // Build filters dynamically based on the provided query parameters
  const filters = {};
  if (sender) filters.sender = sender;
  if (owner) filters.owner = owner;
  if (contractId_) filters.contractId_ = contractId_;

  try {
    // Execute GraphQL query
    const { data } = await client.query({
      query: DEPOSIT_QUERY,
      variables: { first, orderBy, orderDirection, where: filters },
    });

    // Return the deposit data as JSON
    return new Response(JSON.stringify(data.deposits), {
      status: 200,
    });
  } catch (error) {
    // Handle and return any errors
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
