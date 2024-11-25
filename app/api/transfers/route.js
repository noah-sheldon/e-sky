import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_USDE_MAINNET_SUBGRAPH_URI, // Use the URI from the .env file
  cache: new InMemoryCache(),
});

const TRANSFER_QUERY = gql`
  query GetTransfers(
    $first: Int
    $orderBy: Transfer_orderBy
    $orderDirection: OrderDirection
    $where: Transfer_filter
  ) {
    transfers(
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
      where: $where
    ) {
      id
      from
      to
      value
      block_number
      transactionHash_
      timestamp_
    }
  }
`;

export async function GET(request) {
  const url = new URL(request.url);
  const first = url.searchParams.get("first") || 10;
  const orderBy = url.searchParams.get("orderBy") || "timestamp_";
  const orderDirection = url.searchParams.get("orderDirection") || "desc";
  const from = url.searchParams.get("from") || null;
  const to = url.searchParams.get("to") || null;

  const filters = {};
  if (from) filters.from = from;
  if (to) filters.to = to;

  try {
    const { data } = await client.query({
      query: TRANSFER_QUERY,
      variables: {
        first: parseInt(first),
        orderBy,
        orderDirection,
        where: filters,
      },
    });
    return new Response(JSON.stringify(data.transfers), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
