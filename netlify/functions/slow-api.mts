import type { Config } from "@netlify/functions";

async function getProducts() {
  const apiUrl = process.env.SLOW_API_URL;
  if (!apiUrl) throw new Error("SLOW_API is not defined");

  const res = await fetch(apiUrl, {
    // Prevent fetch from using cached responses
    cache: 'no-store',
    headers: {
      'Pragma': 'no-cache',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    }
  });
  const result = await res.json();
  console.log("slow api results", result)
  const nodes = result || [];
  console.log("ALL PRODUCTS", nodes);


//   .filter((node: any) => node.acf?.product_image)
  return nodes

  .map((node: any) => ({
    id: node.id || null,
    title: node.title || null,
    imageUrl: node.image || null,
    price: node.price || null,
  }));
}

export default async function handler(event: Config) {
  const products = await getProducts();

  return new Response(JSON.stringify(products), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
