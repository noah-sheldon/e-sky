import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_USDE_MAINNET_SUBGRAPH_URI,
  cache: new InMemoryCache(),
});

const OWNERSHIP_TRANSFER_QUERY = gql`
  query GetOwnershipTransferreds(
    $first: Int
    $orderBy: OwnershipTransferred_orderBy
    $orderDirection: OrderDirection
    $where: OwnershipTransferred_filter
  ) {
    ownershipTransferreds(
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
      previousOwner
      newOwner
    }
  }
`;

export async function GET(request) {
  const url = new URL(request.url);

  const first = parseInt(url.searchParams.get("first") || 10);
  const orderBy = url.searchParams.get("orderBy") || "timestamp_";
  const orderDirection = url.searchParams.get("orderDirection") || "desc";
  const previousOwner = url.searchParams.get("previousOwner");
  const newOwner = url.searchParams.get("newOwner");

  const filters = {};
  if (previousOwner) filters.previousOwner = previousOwner;
  if (newOwner) filters.newOwner = newOwner;

  try {
    const { data } = await client.query({
      query: OWNERSHIP_TRANSFER_QUERY,
      variables: { first, orderBy, orderDirection, where: filters },
    });

    return new Response(JSON.stringify(data.ownershipTransferreds), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
