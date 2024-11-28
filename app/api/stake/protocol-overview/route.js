const PROTOCOL_OVERVIEW_QUERY = gql`
  query GetProtocolOverview {
    deposits {
      id
      assets
    }
    withdrawals {
      id
      assets
    }
    rewardsReceiveds {
      id
      amount
    }
    lockedAmountRedistributeds {
      id
      amount
    }
  }
`;

export async function GET() {
  try {
    const { data } = await client.query({
      query: PROTOCOL_OVERVIEW_QUERY,
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
        totalRewardsDistributed: totalRewards,
        totalLocked,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
