import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_USDE_STAKE_SUBGRAPH_URI,
  cache: new InMemoryCache(),
});

const WITHDRAW_QUERY = gql`
  query GetWithdraws(
    $first: Int
    $orderBy: Withdraw_orderBy
    $orderDirection: OrderDirection
    $where: Withdraw_filter
  ) {
    withdraws(
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
      receiver
      owner
      assets
      shares
    }
  }
`;

export async function GET(request) {
  const url = new URL(request.url);

  const first = parseInt(url.searchParams.get("first") || 10);
  const orderBy = url.searchParams.get("orderBy") || "timestamp_";
  const orderDirection = url.searchParams.get("orderDirection") || "desc";
  const sender = url.searchParams.get("sender");
  const receiver = url.searchParams.get("receiver");
  const owner = url.searchParams.get("owner");

  const filters = {};
  if (sender) filters.sender = sender;
  if (receiver) filters.receiver = receiver;
  if (owner) filters.owner = owner;

  try {
    const { data } = await client.query({
      query: WITHDRAW_QUERY,
      variables: { first, orderBy, orderDirection, where: filters },
    });

    return new Response(JSON.stringify(data.withdraws), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
