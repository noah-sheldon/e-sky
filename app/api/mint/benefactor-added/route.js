import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

// Initialize Apollo Client
const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_USDE_MINT_SUBGRAPH_URI,
  cache: new InMemoryCache(),
});

// GraphQL Query to Fetch Benefactor Added Events
const BENEFECTOR_ADDED_QUERY = gql`
  query GetBenefactorAdded(
    $first: Int
    $orderBy: BenefactorAdded_orderBy
    $orderDirection: OrderDirection
  ) {
    benefactorAddeds(
      first: $first
      orderBy: $orderBy
      orderDirection: $orderDirection
    ) {
      id
      block_number
      timestamp_
      transactionHash_
      contractId_
      benefactor
    }
  }
`;

export async function GET(request) {
  const url = new URL(request.url);

  const first = parseInt(url.searchParams.get("first") || 10);
  const orderBy = url.searchParams.get("orderBy") || "timestamp_"; // Adjust based on available fields in your schema
  const orderDirection = url.searchParams.get("orderDirection") || "desc";

  try {
    // Fetch Benefactor Added events
    const benefactorData = await client.query({
      query: BENEFECTOR_ADDED_QUERY,
      variables: {
        first,
        orderBy, // Make sure this corresponds to a valid orderBy field
        orderDirection,
      },
    });

    return new Response(
      JSON.stringify({
        benefactorAdded: benefactorData.data.benefactorAddeds,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
