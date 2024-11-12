import type { Config } from "@netlify/functions";
import * as LaunchDarkly from 'launchdarkly-node-server-sdk';

const baseUrl = process.env.URL; // Use environment variable for production, fallback for local development

// Initialize the LaunchDarkly client outside the handler function
let ldClient: LaunchDarkly.LDClient | null = null;

export default async function orders() {
  let endpoint: string;
  let headers: Record<string, string> = {
    Accept: "application/json",
  };

  // Initialize the LaunchDarkly client if it hasn't been initialized
  if (!ldClient) {
    ldClient = LaunchDarkly.init(process.env.LAUNCHDARKLY_SDK_KEY);
    await ldClient.waitForInitialization();
  }

  // Create a user object (you may want to customize this based on your needs)
  const user = {
    key: 'user-key-123',
    // Add other user properties if needed
  };

  // Evaluate the feature flag
  const orderSource = await ldClient.variation('order-source', user, 'default-source');
  console.log("LAUNCHDARKLY orderSource", orderSource);
  if (!orderSource) {
    return new Response("Missing shopping source", { 
      status: 400,
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  }
//updating api endpoint
  endpoint = `/.netlify/functions/wordpress-api`;

  // Validate if the endpoint exists
  let fullUrl = new URL(endpoint, baseUrl).toString();

  console.log(fullUrl);
  try {
    const response = await fetch(fullUrl, { headers });
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      return new Response("Error fetching data", { 
        status: response.status,
        headers: {
          'Cache-Control': 'no-store, max-age=0'
        }
      });
    }
    const json = await response.json();
    console.log(json);

    return new Response(JSON.stringify(json), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  } catch (error) {
    console.error(`Failed to fetch data from ${orderSource}:`, error);
    return new Response("Internal server error", { 
      status: 500,
      headers: {
        'Cache-Control': 'no-store, max-age=0'
      }
    });
  }
}

export const config: Config = {
  method: "GET",
  path: "/api/orders",
};