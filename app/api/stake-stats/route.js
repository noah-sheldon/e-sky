import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

// Initialize Apollo Client
const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_USDE_STAKE_SUBGRAPH_URI,
  cache: new InMemoryCache(),
});

// GraphQL Query (Unmodified)
const STAKE_STATS_QUERY = gql`
  query GetEnhancedStakeStats {
    deposits {
      block_number
      timestamp_
      transactionHash_
      contractId_
      assets
      owner
    }
    withdraws {
      block_number
      timestamp_
      transactionHash_
      contractId_
      assets
      owner
    }
    rewardsReceiveds {
      block_number
      timestamp_
      transactionHash_
      contractId_
      amount
    }
    approvals {
      block_number
      timestamp_
      transactionHash_
      contractId_
      owner
      spender
      value
    }
    transfers {
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

// Utility function to calculate aggregate metrics
const calculateAggregate = (items, key) => {
  return items.reduce((sum, item) => sum + BigInt(item[key] || 0), BigInt(0));
};

// Utility function to calculate top stakers
const calculateTopStakers = (deposits) => {
  const stakers = deposits.reduce((acc, { owner, assets }) => {
    acc[owner] = (acc[owner] || BigInt(0)) + BigInt(assets || 0);
    return acc;
  }, {});

  return Object.entries(stakers)
    .sort(([, a], [, b]) => Number(b - a))
    .slice(0, 10)
    .map(([owner, assets]) => ({ owner, assets: assets.toString() }));
};

// API Handler
export async function GET() {
  try {
    const { data } = await client.query({ query: STAKE_STATS_QUERY });

    if (!data) {
      return new Response(
        JSON.stringify({
          error: "No data received from the GraphQL endpoint.",
        }),
        { status: 500 }
      );
    }

    // Protocol Metrics
    const totalDeposits = calculateAggregate(data.deposits, "assets");
    const totalWithdrawals = calculateAggregate(data.withdraws, "assets");
    const totalRewards = calculateAggregate(data.rewardsReceiveds, "amount");
    const netStaked = totalDeposits - totalWithdrawals;

    // Unique Active Users
    const uniqueUsers = new Set([
      ...data.deposits.map((d) => d.owner),
      ...data.withdraws.map((w) => w.owner),
    ]);

    // Top Stakers
    const topStakers = calculateTopStakers(data.deposits);

    // Return Response
    return new Response(
      JSON.stringify({
        protocolMetrics: {
          totalDeposits: totalDeposits.toString(),
          totalWithdrawals: totalWithdrawals.toString(),
          netStaked: netStaked.toString(),
          totalRewards: totalRewards.toString(),
        },
        uniqueActiveUsers: uniqueUsers.size,
        topStakers,
        approvals: data.approvals,
        transfers: data.transfers,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching enhanced stake stats:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch enhanced stake stats.",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}
