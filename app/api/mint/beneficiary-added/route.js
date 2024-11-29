import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

// Initialize Apollo Client
const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_USDE_MINT_SUBGRAPH_URI,
  cache: new InMemoryCache(),
});

// GraphQL Query to Fetch Beneficiary Added Events
const BENEFICIARY_ADDED_QUERY = gql`
  query GetBeneficiaryAdded(
    $first: Int
    $orderBy: BeneficiaryAdded_orderBy
    $orderDirection: OrderDirection
  ) {
    beneficiaryAddeds(
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
      beneficiary
    }
  }
`;

export async function GET(request) {
  const url = new URL(request.url);

  const first = parseInt(url.searchParams.get("first") || 10);
  const orderBy = url.searchParams.get("orderBy") || "timestamp_";
  const orderDirection = url.searchParams.get("orderDirection") || "desc";

  try {
    // Fetch Beneficiary Added events
    const beneficiaryData = await client.query({
      query: BENEFICIARY_ADDED_QUERY,
      variables: {
        first,
        orderBy,
        orderDirection,
      },
    });

    return new Response(
      JSON.stringify({
        beneficiaryAdded: beneficiaryData.data.beneficiaryAdded,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
