import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_USDE_MAINNET_SUBGRAPH_URI, // Ensure to set this in your .env
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

  const first = parseInt(url.searchParams.get("first") || "10");
  const orderBy = url.searchParams.get("orderBy") || "timestamp_";
  const orderDirection = url.searchParams.get("orderDirection") || "desc";
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const value = url.searchParams.get("value");

  const filters = {};
  if (from) filters.from = from;
  if (to) filters.to = to;
  if (value) filters.value = value;

  try {
    const { data } = await client.query({
      query: TRANSFER_QUERY,
      variables: { first, orderBy, orderDirection, where: filters },
    });

    return new Response(JSON.stringify(data.transfers), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
