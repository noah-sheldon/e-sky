const HISTORICAL_TRENDS_QUERY = gql`
  query GetHistoricalTrends {
    deposits(orderBy: timestamp_, orderDirection: asc) {
      timestamp_
      assets
    }
    rewardsReceiveds(orderBy: timestamp_, orderDirection: asc) {
      timestamp_
      amount
    }
  }
`;

export async function GET(request) {
  try {
    const { data } = await client.query({
      query: HISTORICAL_TRENDS_QUERY,
    });

    // Group by timestamp
    const groupByDate = (items, key) => {
      return items.reduce((acc, item) => {
        const date = new Date(parseInt(item.timestamp_) * 1000)
          .toISOString()
          .split("T")[0];
        acc[date] = (acc[date] || BigInt(0)) + BigInt(item[key]);
        return acc;
      }, {});
    };

    const deposits = groupByDate(data.deposits, "assets");
    const rewards = groupByDate(data.rewardsReceiveds, "amount");

    return new Response(JSON.stringify({ deposits, rewards }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
