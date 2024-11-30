import axios from "axios";

export async function GET() {
  try {
    // Fetch API key and base URL from environment variables
    const apiKey = process.env.COINMARKETCAP_API_KEY;
    const baseUrl = process.env.COINMARKETCAP_BASE_URL;

    if (!apiKey || !baseUrl) {
      return new Response(
        JSON.stringify({ error: "API key or Base URL not configured." }),
        { status: 500 }
      );
    }

    // Define API endpoint and parameters
    const endpoint = `${baseUrl}/v1/cryptocurrency/quotes/latest`;
    const params = { symbol: "USDe", convert: "USD" };

    // Fetch data from CoinMarketCap
    const response = await axios.get(endpoint, {
      headers: {
        "X-CMC_PRO_API_KEY": apiKey,
        Accept: "application/json",
      },
      params,
    });

    const data = response.data.data.USDe;

    // Simplify the response data
    const simplifiedData = {
      name: data.name,
      symbol: data.symbol,
      price: data.quote.USD.price,
      volume_24h: data.quote.USD.volume_24h,
      market_cap: data.quote.USD.market_cap,
      percent_change_1h: data.quote.USD.percent_change_1h,
      percent_change_24h: data.quote.USD.percent_change_24h,
      percent_change_7d: data.quote.USD.percent_change_7d,
      circulating_supply: data.circulating_supply,
      total_supply: data.total_supply,
      platform: data.platform.name,
      token_address: data.platform.token_address,
      last_updated: data.last_updated,
    };

    return new Response(JSON.stringify(simplifiedData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(
      "Error fetching data from CoinMarketCap:",
      error.response?.data || error.message
    );
    return new Response(
      JSON.stringify({ error: "Failed to fetch data from CoinMarketCap." }),
      { status: 500 }
    );
  }
}
