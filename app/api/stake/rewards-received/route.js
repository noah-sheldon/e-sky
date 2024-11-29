import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_USDE_STAKE_SUBGRAPH_URI,
  cache: new InMemoryCache(),
});

const REWARDS_RECEIVED_QUERY = gql`
  query GetRewardsReceived(
    $first: Int
    $orderBy: RewardsReceived_orderBy
    $orderDirection: OrderDirection
    $where: RewardsReceived_filter
  ) {
    rewardsReceiveds(
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
      amount
    }
  }
`;

export async function GET(request) {
  const url = new URL(request.url);

  const first = parseInt(url.searchParams.get("first") || 10);
  const orderBy = url.searchParams.get("orderBy") || "timestamp_";
  const orderDirection = url.searchParams.get("orderDirection") || "desc";

  const filters = {};

  try {
    const { data } = await client.query({
      query: REWARDS_RECEIVED_QUERY,
      variables: {
        first,
        orderBy,
        orderDirection,
        where: filters,
      },
    });

    return new Response(JSON.stringify(data.rewardsReceiveds), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
