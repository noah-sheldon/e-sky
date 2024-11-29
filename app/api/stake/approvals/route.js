import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_USDE_MAINNET_SUBGRAPH_URI, // Ensure to set this in your .env
  cache: new InMemoryCache(),
});

const APPROVALS_QUERY = gql`
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

export async function GET(request) {
  const url = new URL(request.url);

  const first = parseInt(url.searchParams.get("first") || "10");
  const orderBy = url.searchParams.get("orderBy") || "timestamp_";
  const orderDirection = url.searchParams.get("orderDirection") || "desc";
  const owner = url.searchParams.get("owner");
  const spender = url.searchParams.get("spender");
  const value = url.searchParams.get("value");

  const filters = {};
  if (owner) filters.owner = owner;
  if (spender) filters.spender = spender;
  if (value) filters.value = value;

  try {
    const { data } = await client.query({
      query: APPROVALS_QUERY,
      variables: { first, orderBy, orderDirection, where: filters },
    });

    return new Response(JSON.stringify(data.approvals), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
