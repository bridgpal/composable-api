import type { Config } from "@netlify/functions";
const source = Netlify.env.get("SHOPPING_SOURCE");


const baseUrl = process.env.URL; // Use environment variable for production, fallback for local development



export default async function orders() {
  let endpoint: string;
  let headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (!source) {
    return new Response("Missing shopping source", { status: 400 });
  }

  endpoint = `/.netlify/functions/${source}`;

  // Validate if the endpoint exists
  let fullUrl = new URL(endpoint, baseUrl).toString();

  console.log(fullUrl);
  try {
    const response = await fetch(fullUrl, { headers });
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return new Response("Error fetching data", { status: response.status });
    }
    const json = await response.json();
    console.log(json);
    // @ts-expect-error this syntax is allowed
    return Response.json(json);
  } catch (error) {
    console.error(`Failed to fetch data from ${source}:`, error);
    return new Response("Internal server error", { status: 500 });
  }
}

export const config: Config = {
  method: "GET",
  path: "/api/orders",
};