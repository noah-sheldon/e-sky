import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_USDE_MAINNET_SUBGRAPH_URI,
  cache: new InMemoryCache(),
});

const USER_STAKE_QUERY = gql`
  query GetUserStake($owner: String!) {
    deposits(where: { owner: $owner }) {
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
    withdrawals(where: { owner: $owner }) {
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
    rewardsReceiveds(where: { contractId: $owner }) {
      id
      block_number
      timestamp_
      transactionHash_
      contractId_
      amount
    }
    lockedAmountRedistributeds(where: { to: $owner }) {
      id
      block_number
      timestamp_
      transactionHash_
      contractId_
      from
      to
      amount
    }
  }
`;

export async function GET(request) {
  const url = new URL(request.url);
  const owner = url.searchParams.get("owner");

  if (!owner) {
    return new Response(JSON.stringify({ error: "owner is required" }), {
      status: 400,
    });
  }

  try {
    const { data } = await client.query({
      query: USER_STAKE_QUERY,
      variables: { owner },
    });

    // Aggregate Data
    const totalDeposits = data.deposits.reduce(
      (sum, d) => sum + BigInt(d.assets),
      BigInt(0)
    );
    const totalWithdrawals = data.withdrawals.reduce(
      (sum, w) => sum + BigInt(w.assets),
      BigInt(0)
    );
    const totalRewards = data.rewardsReceiveds.reduce(
      (sum, r) => sum + BigInt(r.amount),
      BigInt(0)
    );
    const totalLocked = data.lockedAmountRedistributeds.reduce(
      (sum, l) => sum + BigInt(l.amount),
      BigInt(0)
    );

    return new Response(
      JSON.stringify({
        totalStaked: totalDeposits - totalWithdrawals,
        totalRewards,
        totalLocked,
        deposits: data.deposits,
        withdrawals: data.withdrawals,
        rewards: data.rewardsReceiveds,
        lockedAmounts: data.lockedAmountRedistributeds,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
