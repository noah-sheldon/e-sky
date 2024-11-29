import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_USDE_MINT_SUBGRAPH_URI,
  cache: new InMemoryCache(),
});

const MINTS_QUERY = gql`
  query GetMints(
    $first: Int
    $orderBy: Mint_orderBy
    $orderDirection: OrderDirection
  ) {
    mints(first: $first, orderBy: $orderBy, orderDirection: $orderDirection) {
      id
      block_number
      timestamp_
      transactionHash_
      contractId_
      order_id
      benefactor
      beneficiary
      minter
      collateral_asset
      collateral_amount
      usde_amount
    }
  }
`;

export async function GET(request) {
  const url = new URL(request.url);

  const first = parseInt(url.searchParams.get("first") || 10);
  const orderBy = url.searchParams.get("orderBy") || "timestamp_";
  const orderDirection = url.searchParams.get("orderDirection") || "desc";

  try {
    const response = await client.query({
      query: MINTS_QUERY,
      variables: {
        first,
        orderBy,
        orderDirection,
      },
    });

    if (!response || !response.data || !response.data.mints) {
      throw new Error("No data found in the response");
    }

    return new Response(
      JSON.stringify({
        mints: response.data.mints,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in Apollo query:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
