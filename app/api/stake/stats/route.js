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

// Utility function to convert Wei to ETH
const convertWeiToEth = (value) => {
  return (BigInt(value) / BigInt(1e18)).toString(); // Convert Wei to ETH as string
};

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
    .sort(([, a], [, b]) => (b > a ? 1 : -1)) // Compare BigInt directly
    .slice(0, 10)
    .map(([owner, assets]) => ({ owner, assets: convertWeiToEth(assets) })); // Convert assets to ETH
};

// Utility function to calculate approvals metrics
const calculateApprovalMetrics = (approvals) => {
  // Calculate total approved value
  const totalApprovedValue = approvals.reduce(
    (sum, approval) => sum + BigInt(approval.value || 0),
    BigInt(0)
  );

  // Calculate the most approved spenders
  const spenders = approvals.reduce((acc, approval) => {
    acc[approval.spender] =
      (acc[approval.spender] || BigInt(0)) + BigInt(approval.value || 0);
    return acc;
  }, {});

  const mostApprovedSpenders = Object.entries(spenders)
    .sort(([, a], [, b]) => (a > b ? -1 : 1)) // Sort BigInt values
    .slice(0, 10) // Take top 10 spenders
    .map(([spender, value]) => ({
      spender,
      value: convertWeiToEth(value), // Convert value to ETH
    }));

  return {
    totalApprovedValue: convertWeiToEth(totalApprovedValue), // Total approved value in ETH
    mostApprovedSpenders, // Top 10 spenders
  };
};

// Utility function to calculate transfer metrics
const calculateTransferMetrics = (transfers) => {
  const totalTransferredValue = transfers.reduce(
    (sum, transfer) => sum + BigInt(transfer.value || 0),
    BigInt(0)
  );

  const transferCounts = transfers.reduce((acc, transfer) => {
    acc[transfer.from] = (acc[transfer.from] || 0) + 1;
    acc[transfer.to] = (acc[transfer.to] || 0) + 1;
    return acc;
  }, {});
  const topTransferAddresses = Object.entries(transferCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([address, count]) => ({ address, count }));

  return {
    totalTransferredValue: convertWeiToEth(totalTransferredValue),
    topTransferAddresses,
  };
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

    // Protocol Metrics (convert to ETH)
    const totalDeposits = convertWeiToEth(
      calculateAggregate(data.deposits, "assets")
    );
    const totalWithdrawals = convertWeiToEth(
      calculateAggregate(data.withdraws, "assets")
    );
    const totalRewards = convertWeiToEth(
      calculateAggregate(data.rewardsReceiveds, "amount")
    );
    const netStaked = convertWeiToEth(
      BigInt(calculateAggregate(data.deposits, "assets")) -
        BigInt(calculateAggregate(data.withdraws, "assets"))
    );

    // Unique Active Users
    const uniqueUsers = new Set([
      ...data.deposits.map((d) => d.owner),
      ...data.withdraws.map((w) => w.owner),
    ]);

    // Top Stakers
    const topStakers = calculateTopStakers(data.deposits);

    // Approvals Metrics
    const approvalsMetrics = calculateApprovalMetrics(data.approvals);

    // Transfers Metrics
    const transfersMetrics = calculateTransferMetrics(data.transfers);

    // Return Response
    return new Response(
      JSON.stringify({
        protocolMetrics: {
          totalDeposits,
          totalWithdrawals,
          netStaked,
          totalRewards,
        },
        uniqueActiveUsers: uniqueUsers.size,
        topStakers,
        approvalsMetrics, // includes totalApprovedValue and mostApprovedSpenders
        transfersMetrics,
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
