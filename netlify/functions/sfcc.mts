import type { Config } from "@netlify/functions";

const query = `
  query MyQuery {
    allSfccProduct(limit: 15) {
      nodes {
        image {
          absUrl
        }
        name
        price
        id
      }
    }
  }
`;

async function getProducts() {
  const apiUrl = process.env.SALESFORCE_CONNECT_API_URL;
  if (!apiUrl) throw new Error("SALESFORCE_CONNECT_API_URL is not defined");

  const res = await fetch(apiUrl, {
    method: `POST`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.SALESFORCE_CONNECT_API_TOKEN}`,
    },
    body: JSON.stringify({ query }),
  });

  const result = await res.json();
  const nodes = result?.data?.allSfccProduct?.nodes || [];
  console.log("ALL PRODUCTS", nodes);

  return nodes.map((node: any) => ({
    id: node.id,
    title: node.name,
    imageUrl: node.image?.absUrl || null,
    price: node.price,
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
