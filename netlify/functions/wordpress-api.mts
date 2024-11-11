import type { Config } from "@netlify/functions";

async function getProducts() {
  const apiUrl = process.env.WPENGINE_API_URL;
  if (!apiUrl) throw new Error("WPENGINE_API_URL is not defined");

  const res = await fetch(apiUrl);
  const result = await res.json();
  const nodes = result || [];
  console.log("ALL PRODUCTS", nodes);


  return nodes
  .filter((node: any) => node.acf?.product_image)
  .map((node: any) => ({
    id: node.id || null,
    title: node.title.rendered || null,
    imageUrl: node.acf?.product_image || null,
    price: node.acf?.price.substring(1) || null,
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
